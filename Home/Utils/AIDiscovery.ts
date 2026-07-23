/*
 * AI/LLM discovery surfaces for the marketing site: llms.txt, llms-full.txt,
 * the MCP well-known manifest, markdown variants of marketing pages (*.md)
 * and the /data/*.json endpoints.
 *
 * Everything here is generated from data that already drives the HTML pages
 * (PageSEO, ProductCompare, Reviews) so the two can never drift.
 * These functions are pure (no filesystem or database access) — callers pass
 * in the home URL and, where needed, the blog post list.
 */

import PageSEOConfig, { PageSEOData } from "./PageSEO";
import ProductCompare, {
  Product,
  PricingTier,
  UseCaseComparison,
  getProductCompareSlugs,
} from "./ProductCompare";
import { JSONObject } from "Common/Types/JSON";

/*
 * Minimal blog post shape so this module does not depend on the blog utils
 * (which pull in server-only modules and the blog filesystem).
 */
export interface RecentBlogPostLink {
  title: string;
  description: string;
  fileName: string;
}

function normalizeBaseUrl(homeUrl: string): string {
  return (homeUrl || "https://latticeruntime.com").replace(/\/$/, "");
}

// "Status Page | Free Public & Private Status Pages | Cast Operations" -> "Status Page"
function shortTitle(seo: PageSEOData): string {
  if (seo.softwareApplication?.name) {
    return seo.softwareApplication.name;
  }
  return (seo.title.split("|")[0] || seo.title).trim();
}

function getPagesByType(pageType: PageSEOData["pageType"]): Array<PageSEOData> {
  return Object.values(PageSEOConfig).filter((seo: PageSEOData) => {
    return seo.pageType === pageType;
  });
}

// Escape characters that would break a markdown table cell.
function tableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/*
 * ProductCompare feature cells use "tick" as a sentinel for a checkmark and
 * "" for "not available".
 */
function formatCompareValue(value: string): string {
  if (value === "tick") {
    return "Yes";
  }
  if (!value || !value.trim()) {
    return "No";
  }
  return value;
}

const machineReadableSection: (baseUrl: string) => Array<string> = (
  baseUrl: string,
): Array<string> => {
  return [
    "## Machine-Readable Resources",
    "",
    `- [OpenAPI specification](${baseUrl}/api/openapi/spec): full REST API schema for the Cast Operations platform`,
    `- [MCP server manifest](${baseUrl}/.well-known/mcp.json): connect AI agents to Cast Operations via Model Context Protocol (endpoint: ${baseUrl}/mcp)`,
    `- [Documentation index for LLMs](${baseUrl}/docs/llms.txt): all docs pages with raw markdown variants`,
    `- [API reference](${baseUrl}/reference): human-friendly API documentation`,
    `- [Products (JSON)](${baseUrl}/data/products.json): every product with description and feature list`,
    `- [Comparisons (JSON)](${baseUrl}/data/compare.json): Cast Operations vs other tools`,
    `- [Customer reviews (JSON)](${baseUrl}/data/reviews.json)`,
    `- [Blog RSS feed](${baseUrl}/blog/rss.xml): every post also has a raw markdown variant at /blog/post/<post>/markdown`,
  ];
};

export function generateLlmsTxt(
  homeUrl: string,
  recentPosts: Array<RecentBlogPostLink>,
): string {
  const baseUrl: string = normalizeBaseUrl(homeUrl);
  const lines: Array<string> = [];

  lines.push("# Cast Operations");
  lines.push("");
  lines.push(
    "> Cast Operations is an open-source (Apache 2.0), all-in-one observability platform: uptime monitoring, status pages, incident management, on-call scheduling and alerting, logs, metrics, traces, error tracking, dashboards, workflow automation, runbooks and an AI reliability agent. Available as a cloud service at https://latticeruntime.com or self-hosted.",
  );
  lines.push("");
  lines.push(
    "Most marketing pages on this site have a markdown variant: append `.md` to the page path (for example `/product/monitoring.md`).",
  );
  lines.push("");
  lines.push(...machineReadableSection(baseUrl));

  lines.push("");
  lines.push("## Products");
  lines.push("");
  for (const seo of getPagesByType("product")) {
    lines.push(
      `- [${shortTitle(seo)}](${baseUrl}${seo.canonicalPath}.md): ${seo.description}`,
    );
  }

  lines.push("");
  lines.push("## Solutions");
  lines.push("");
  for (const seo of getPagesByType("solutions")) {
    lines.push(
      `- [${shortTitle(seo)}](${baseUrl}${seo.canonicalPath}.md): ${seo.description}`,
    );
  }

  lines.push("");
  lines.push("## Industries");
  lines.push("");
  for (const seo of getPagesByType("industry")) {
    lines.push(
      `- [${shortTitle(seo)}](${baseUrl}${seo.canonicalPath}.md): ${seo.description}`,
    );
  }

  lines.push("");
  lines.push("## Compare Cast Operations");
  lines.push("");
  for (const slug of getProductCompareSlugs()) {
    const product: Product = ProductCompare(slug);
    lines.push(
      `- [Cast Operations vs ${product.productName}](${baseUrl}/compare/${slug}.md): ${product.tagline}`,
    );
  }

  lines.push("");
  lines.push("## Docs & Support");
  lines.push("");
  lines.push(`- [Documentation](${baseUrl}/docs)`);
  lines.push(
    `- [Documentation for LLMs](${baseUrl}/docs/llms.txt): index of all docs with raw markdown links`,
  );
  lines.push(`- [API Reference](${baseUrl}/reference)`);
  lines.push(
    `- [MCP Server](${baseUrl}/tool/mcp-server.md): query and manage Cast Operations from AI agents`,
  );
  lines.push(`- [Support](${baseUrl}/support)`);
  lines.push(
    "- [Source code on GitHub](https://github.com/autonomy-cloud/operations)",
  );

  if (recentPosts.length > 0) {
    lines.push("");
    lines.push("## Recent Blog Posts");
    lines.push("");
    for (const post of recentPosts) {
      lines.push(
        `- [${post.title}](${baseUrl}/blog/post/${post.fileName}/markdown): ${post.description}`,
      );
    }
    lines.push(`- [All posts](${baseUrl}/blog)`);
  }

  lines.push("");
  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [llms-full.txt](${baseUrl}/llms-full.txt): expanded version of this file with full product and comparison detail inline`,
  );
  lines.push("");

  return lines.join("\n");
}

export function generateLlmsFullTxt(
  homeUrl: string,
  recentPosts: Array<RecentBlogPostLink>,
): string {
  const baseUrl: string = normalizeBaseUrl(homeUrl);
  const lines: Array<string> = [];

  lines.push("# Cast Operations");
  lines.push("");
  lines.push(
    "> Cast Operations is an open-source (Apache 2.0), all-in-one observability platform: uptime monitoring, status pages, incident management, on-call scheduling and alerting, logs, metrics, traces, error tracking, dashboards, workflow automation, runbooks and an AI reliability agent. Available as a cloud service at https://latticeruntime.com or self-hosted.",
  );
  lines.push("");
  lines.push(...machineReadableSection(baseUrl));

  lines.push("");
  lines.push("## Products");
  for (const seo of getPagesByType("product")) {
    lines.push("");
    lines.push(`### ${shortTitle(seo)}`);
    lines.push("");
    lines.push(seo.description);
    lines.push("");
    lines.push(`Page: ${baseUrl}${seo.canonicalPath}`);
    if (seo.softwareApplication) {
      lines.push("");
      lines.push("Features:");
      lines.push("");
      for (const feature of seo.softwareApplication.features) {
        lines.push(`- ${feature}`);
      }
    }
  }

  lines.push("");
  lines.push("## Comparisons");
  for (const slug of getProductCompareSlugs()) {
    const product: Product = ProductCompare(slug);
    lines.push("");
    lines.push(`### Cast Operations vs ${product.productName}`);
    lines.push("");
    lines.push(product.description);
    lines.push("");
    lines.push(
      `Full comparison: ${baseUrl}/compare/${slug} (markdown: ${baseUrl}/compare/${slug}.md)`,
    );
    for (const difference of product.keyDifferences || []) {
      lines.push(`- ${difference.title}: ${difference.description}`);
    }
  }

  if (recentPosts.length > 0) {
    lines.push("");
    lines.push("## Recent Blog Posts");
    lines.push("");
    for (const post of recentPosts) {
      lines.push(
        `- [${post.title}](${baseUrl}/blog/post/${post.fileName}/markdown): ${post.description}`,
      );
    }
  }

  lines.push("");

  return lines.join("\n");
}

/*
 * Markdown variant of a marketing page, generated from its SEO/structured
 * data. Rich for product pages (feature lists); title + description for the
 * rest.
 */
export function generatePageMarkdown(
  seo: PageSEOData,
  homeUrl: string,
): string {
  const baseUrl: string = normalizeBaseUrl(homeUrl);
  const lines: Array<string> = [];

  lines.push(`# ${shortTitle(seo)}`);
  lines.push("");
  lines.push(`> ${seo.description}`);
  lines.push("");
  lines.push(`Canonical page: ${baseUrl}${seo.canonicalPath}`);

  if (seo.softwareApplication) {
    lines.push("");
    lines.push("## Features");
    lines.push("");
    for (const feature of seo.softwareApplication.features) {
      lines.push(`- ${feature}`);
    }
  }

  lines.push("");
  lines.push("## Learn More");
  lines.push("");
  lines.push(
    `- [All Cast Operations products and links for LLMs](${baseUrl}/llms.txt)`,
  );
  lines.push(`- [Deployment options](${baseUrl}/enterprise/overview.md)`);
  lines.push(`- [Documentation](${baseUrl}/docs)`);
  lines.push(`- [Sign up](${baseUrl}/accounts/register)`);
  lines.push("");

  return lines.join("\n");
}

export function generateCompareMarkdown(
  slug: string,
  homeUrl: string,
): string | null {
  const product: Product | undefined = ProductCompare(slug);
  if (!product) {
    return null;
  }

  const baseUrl: string = normalizeBaseUrl(homeUrl);
  const lines: Array<string> = [];

  lines.push(`# Cast Operations vs ${product.productName}`);
  lines.push("");
  lines.push(`> ${product.tagline}`);
  lines.push("");
  lines.push(product.description);
  lines.push("");
  lines.push(product.descriptionLine2);
  lines.push("");
  lines.push(`Canonical page: ${baseUrl}/compare/${slug}`);
  if (product.lastUpdated) {
    lines.push("");
    lines.push(`Last updated: ${product.lastUpdated}`);
  }

  if (product.keyDifferences && product.keyDifferences.length > 0) {
    lines.push("");
    lines.push("## Key Differences");
    for (const difference of product.keyDifferences) {
      lines.push("");
      lines.push(`### ${difference.title}`);
      lines.push("");
      lines.push(difference.description);
    }
  }

  if (product.items && product.items.length > 0) {
    lines.push("");
    lines.push("## Feature Comparison");
    for (const category of product.items) {
      lines.push("");
      lines.push(`### ${category.name}`);
      lines.push("");
      lines.push(
        `| Feature | ${tableCell(product.productName)} | Cast Operations |`,
      );
      lines.push("|---|---|---|");
      for (const item of category.data) {
        lines.push(
          `| ${tableCell(item.title)} (${tableCell(item.description)}) | ${tableCell(formatCompareValue(item.productColumn))} | ${tableCell(formatCompareValue(item.castOperationsColumn))} |`,
        );
      }
    }
  }

  if (product.competitorPricingTiers && product.competitorPricingTiers.length) {
    lines.push("");
    lines.push(`## ${product.productName} Pricing`);
    for (const tier of product.competitorPricingTiers as Array<PricingTier>) {
      lines.push("");
      lines.push(`### ${tier.name} — ${tier.price} ${tier.period}`);
      if (tier.features && tier.features.length) {
        lines.push("");
        lines.push("Includes:");
        for (const feature of tier.features) {
          lines.push(`- ${feature}`);
        }
      }
      if (tier.limitations && tier.limitations.length) {
        lines.push("");
        lines.push("Limitations:");
        for (const limitation of tier.limitations) {
          lines.push(`- ${limitation}`);
        }
      }
    }
  }

  if (product.useCases && product.useCases.length) {
    lines.push("");
    lines.push("## Real-World Cost Comparison");
    lines.push("");
    lines.push(
      `| Scenario | ${tableCell(product.productName)} | Cast Operations |`,
    );
    lines.push("|---|---|---|");
    for (const useCase of product.useCases as Array<UseCaseComparison>) {
      lines.push(
        `| ${tableCell(useCase.scenario)} | ${tableCell(`${useCase.competitorSolution} — ${useCase.competitorCost}`)} | ${tableCell(`${useCase.castOperationsSolution} — ${useCase.castOperationsCost}`)} |`,
      );
    }
  }

  if (product.migrationBenefits && product.migrationBenefits.length) {
    lines.push("");
    lines.push(`## Migrating from ${product.productName}`);
    lines.push("");
    for (const benefit of product.migrationBenefits) {
      lines.push(`- ${benefit}`);
    }
  }

  if (product.faq && product.faq.length > 0) {
    lines.push("");
    lines.push("## FAQ");
    for (const faq of product.faq) {
      lines.push("");
      lines.push(`### ${faq.question}`);
      lines.push("");
      lines.push(faq.answer);
    }
  }

  lines.push("");
  lines.push("## Learn More");
  lines.push("");
  lines.push(`- [Deployment options](${baseUrl}/enterprise/overview.md)`);
  lines.push(`- [All comparisons](${baseUrl}/data/compare.json)`);
  lines.push(`- [Sign up](${baseUrl}/accounts/register)`);
  lines.push("");

  return lines.join("\n");
}

// Manifest served at /.well-known/mcp.json for MCP client discovery.
export function generateMcpManifest(homeUrl: string): JSONObject {
  const baseUrl: string = normalizeBaseUrl(homeUrl);
  return {
    name: "Cast Operations MCP Server",
    description:
      "Model Context Protocol server for Cast Operations. Lets AI agents query and manage incidents, monitors, alerts, on-call schedules, status pages, logs, metrics and traces.",
    endpoint: `${baseUrl}/mcp`,
    transport: ["streamable-http"],
    authentication: {
      type: "apiKey",
      headers: ["x-api-key", "Authorization: Bearer <api-key>"],
      instructions: `Create an API key in your Cast Operations project settings. Public status page tools and help tools work without authentication. See ${baseUrl}/docs/ai/mcp-server`,
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
    documentation: `${baseUrl}/docs/ai/mcp-server`,
    website: `${baseUrl}/tool/mcp-server`,
    openapi: `${baseUrl}/api/openapi/spec`,
    packages: [
      {
        registry: "npm",
        name: "@cast-operations/mcp-server",
      },
    ],
  };
}

export function generateProductsJson(homeUrl: string): JSONObject {
  const baseUrl: string = normalizeBaseUrl(homeUrl);
  return {
    products: getPagesByType("product").map((seo: PageSEOData) => {
      return {
        name: shortTitle(seo),
        description: seo.description,
        url: `${baseUrl}${seo.canonicalPath}`,
        markdownUrl: `${baseUrl}${seo.canonicalPath}.md`,
        features: seo.softwareApplication?.features || [],
      };
    }),
  };
}

export function generateCompareIndexJson(homeUrl: string): JSONObject {
  const baseUrl: string = normalizeBaseUrl(homeUrl);
  return {
    comparisons: getProductCompareSlugs().map((slug: string) => {
      const product: Product = ProductCompare(slug);
      return {
        slug,
        productName: product.productName,
        tagline: product.tagline,
        url: `${baseUrl}/compare/${slug}`,
        markdownUrl: `${baseUrl}/compare/${slug}.md`,
        jsonUrl: `${baseUrl}/data/compare/${slug}`,
      };
    }),
  };
}
