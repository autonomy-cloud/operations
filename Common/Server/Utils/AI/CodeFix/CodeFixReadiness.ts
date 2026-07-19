import AIAgentService from "../../../Services/AIAgentService";
import AIService, { AutonomousBudgetStatus } from "../../../Services/AIService";
import LlmProviderService from "../../../Services/LlmProviderService";
import SubjectCodeFixRun from "../SRE/SubjectCodeFixRun";
import AIAgent from "../../../../Models/DatabaseModels/AIAgent";
import LlmProvider from "../../../../Models/DatabaseModels/LlmProvider";
import ObjectID from "../../../../Types/ObjectID";
import {
  AIFixReadiness,
  AIFixReadinessCheck,
} from "../../../../Types/AI/AIFixReadiness";
import CaptureSpan from "../../Telemetry/CaptureSpan";

/*
 * The gates every CodeFix run passes through, in one place. Two surfaces ask
 * the question — the per-exception panel and the project-wide AI Tasks page —
 * and they differ only in how strict their repository gate is (see
 * AIFixReadinessCheckId). Sharing the LLM and agent checks is what keeps the
 * two from drifting into telling the user different stories.
 */
export default class CodeFixReadiness {
  /*
   * An LLM provider the agent may use. Agent completions are server-mediated
   * and metered, so the shared global provider is a valid fallback on cloud
   * too — a project-owned provider simply wins when one exists. A project
   * LLM provider is therefore NOT a prerequisite.
   *
   * The ok-state detail names the resolved provider and its scope: a user
   * running on the shared provider should be able to see that that is what
   * is happening without going to Settings.
   */
  @CaptureSpan()
  public static async getLlmProviderCheck(params: {
    projectId: ObjectID;
  }): Promise<AIFixReadinessCheck> {
    const llmProvider: LlmProvider | null =
      await LlmProviderService.getLlmProviderForMeteredAgentPath(
        params.projectId,
      );

    if (!llmProvider) {
      return {
        id: "llmProvider",
        ok: false,
        title: "LLM provider",
        detail:
          "AI fix tasks need an LLM provider. Add one in Project Settings > AI > LLM Providers. Self-hosted instances can alternatively set the GLOBAL_LLM_PROVIDER_* environment variables to register a global provider for every project.",
      };
    }

    const providerName: string = llmProvider.name || "LLM provider";
    const isGlobal: boolean = llmProvider.isGlobalLlm || false;

    /*
     * The project must also have autonomous execution capacity.
     * executeWithLogging enforces the daily autonomous token budget, and AI_CODE_FIX_FEATURE
     * is one of AUTONOMOUS_AI_FEATURES, so every fix completion goes through
     * it for every provider configuration.
     *
     * A limit of 0 is a documented kill-switch ("pause AI entirely"), i.e.
     * durable config — so without this a paused project would read "ready"
     * forever while every run died at its first completion call.
     */
    const budget: AutonomousBudgetStatus =
      await AIService.getAutonomousDailyBudgetStatus(params.projectId);

    if (budget.exhausted) {
      return {
        id: "llmProvider",
        ok: false,
        title: "LLM provider",
        detail:
          budget.limitInTokens !== null && budget.limitInTokens <= 0
            ? "AI is paused for this project: the daily autonomous AI token limit is set to 0. Raise or unset it in the AI settings pages to let fix tasks run."
            : `The daily autonomous AI token budget is exhausted (${budget.usedTokensToday.toLocaleString()} of ${budget.limitInTokens?.toLocaleString()} tokens used today). Fix tasks resume tomorrow (UTC) — raise or unset the limit in the AI settings pages.`,
      };
    }

    let detail: string = "";

    if (!isGlobal) {
      detail = `Using "${providerName}", this project's own provider. Tasks run on your configured API key.`;
    } else {
      detail = `Using "${providerName}", a shared provider available to every project on this instance. No project provider is needed.`;
    }

    return {
      id: "llmProvider",
      ok: true,
      title: `LLM provider: ${providerName}`,
      detail,
    };
  }

  /*
   * The project-wide repository gate: at least one GitHub-App-connected
   * repository exists. This is the WEAKER claim — it deliberately says
   * nothing about whether a given exception's stack trace will match one.
   * Only GitHub is supported: the agent's clone/push path rejects every
   * other host (see AIAgentDataAPI's repositoryHostedAt guard).
   */
  @CaptureSpan()
  public static async getRepositoryConnectedCheck(params: {
    projectId: ObjectID;
  }): Promise<AIFixReadinessCheck> {
    const hasRepository: boolean =
      await SubjectCodeFixRun.hasGitHubAppConnectedRepository(params.projectId);

    return {
      id: "repositoryConnected",
      ok: hasRepository,
      title: "GitHub repository",
      detail: hasRepository
        ? "Connected through the GitHub App. The agent opens its fix pull requests here."
        : "AI opens its fixes as pull requests, so it needs a repository to push to. Connect one through the GitHub App — installing it imports all of its repositories automatically.",
    };
  }

  // An agent must be alive to pick the task up, or runs sit Queued forever.
  @CaptureSpan()
  public static async getAgentCheck(params: {
    projectId: ObjectID;
  }): Promise<AIFixReadinessCheck> {
    const anyAgent: AIAgent | null = await AIAgentService.getAIAgentForProject(
      params.projectId,
    );

    const isAlive: boolean = anyAgent
      ? AIAgentService.isAgentAlive(anyAgent)
      : false;

    if (isAlive) {
      return {
        id: "agentAvailable",
        ok: true,
        title: `AI agent online: ${anyAgent?.name || "agent"}`,
        detail: "Connected and polling for tasks.",
      };
    }

    return {
      id: "agentAvailable",
      ok: false,
      title: "AI agent online",
      detail: anyAgent
        ? `The AI agent "${anyAgent.name || "agent"}" has not reported in — check that its container is running.`
        : "No AI agent is available for this project. Self-hosted: create an agent under Settings > AI > AI Agents and run its container. Cloud: the shared fleet appears here automatically once enabled.",
    };
  }

  /*
   * Project-wide readiness for the AI Tasks page. Same LLM and agent gates
   * the per-exception check uses, with the any-repository gate in place of
   * per-exception stack-trace resolution.
   */
  @CaptureSpan()
  public static async getProjectReadiness(params: {
    projectId: ObjectID;
  }): Promise<AIFixReadiness> {
    const [repositoryCheck, llmCheck, agentCheck]: [
      AIFixReadinessCheck,
      AIFixReadinessCheck,
      AIFixReadinessCheck,
    ] = await Promise.all([
      this.getRepositoryConnectedCheck({ projectId: params.projectId }),
      this.getLlmProviderCheck({
        projectId: params.projectId,
      }),
      this.getAgentCheck({ projectId: params.projectId }),
    ]);

    /*
     * Ordered the way the user sets them up: connect a repo, point it at a
     * model, run the agent.
     */
    const checks: Array<AIFixReadinessCheck> = [
      repositoryCheck,
      llmCheck,
      agentCheck,
    ];

    return {
      ready: checks.every((check: AIFixReadinessCheck) => {
        return check.ok;
      }),
      checks,
    };
  }
}
