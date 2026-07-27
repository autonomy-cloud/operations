Please read AGENTS.md in root of the project file for more information.

`AGENTS.md` covers local development, migrations, and lint — it is inherited
from upstream OneUptime and says nothing about how this fork is delivered. The
rest of this file is the autonomy-cloud part.

## Branch flow

Code flows `feature -> develop -> stage -> release`.
`.github/workflows/promotion-source.yaml` enforces it on pull requests into
`stage` and `release`: the head must be the preceding branch and must live in
this repository, not a fork. Rebase merging is disabled at the repository level.

Use a **merge commit** for `develop -> stage` and `stage -> release`, and squash
only below `develop`. A squashed promotion creates a commit on the target that
the source has never seen, so the branches diverge immediately and the next
promotion conflicts on any file both sides touched. Note that this repository
has **no `promotion-integrity.yaml`** — unlike `cast`, nothing here fails the
build when a promotion lands as a squash.

## Delivery

Rancher Fleet and `autonomy-cloud/deploy` are retired and are not this repo's
path — nothing here references either. Desired state lives in
`autonomy-cloud/lrai@main`, under `tenants/operations/applications/oneuptime/`
(the directory kept its upstream name). Flux on each Talos/Cozystack cell tracks
`lrai@main` on a one-minute interval.

`.github/workflows/release.yml` builds and publishes
`ghcr.io/autonomy-cloud/operations/app` and the chart to
`oci://ghcr.io/autonomy-cloud/charts`, then its `promote-lrai` job opens an
auto-merging pull request against `lrai` `main`, limited to
`tenants/operations/applications/oneuptime/base/{release,repository}.yaml` and
`scripts/verify-operations-gitops.sh`.

> ### ⚠️ Promotion is currently broken — verify before relying on it
>
> `promote-lrai` opens with a "Require LRAI promotion token" guard over
> `secrets.LRAI_GITOPS_TOKEN`. **That secret was revoked on 2026-07-28 and
> exists in no repository or organization scope**, so the job fails that guard
> rather than promoting. Check for yourself:
>
> ```sh
> gh secret list --repo autonomy-cloud/operations
> gh api /orgs/autonomy-cloud/actions/secrets --jq '.secrets[].name'
> ```
>
> Every other component (`cast`, `workers`, `stack`) mints a short-lived token
> from the **Visca GitHub App** instead — `vars.VISCA_APP_ID` plus
> `secrets.LRAI_APP_PRIVATE_KEY`, narrowed to `repositories: lrai`. Moving this
> workflow to the App is the fix, but it is a workflow change and is out of
> scope for the documentation pass that recorded this. Until it lands, treat
> `tenants/operations/` in lrai as **operator-written**.

Two further differences from the other components, both real and neither
accidental to document:

- `promote-lrai` runs only on a push to `release`. There is no stage-then-release
  split here; it writes lrai `main` directly.
- Consequently there is no build-once digest handoff of the kind `cast` and
  `workers` enforce between their `stage` and `release` overlays.

Do not reintroduce `DEPLOY_BUMP_TOKEN` or `LRAI_GITOPS_TOKEN` (both revoked
2026-07-28) or `LRAI_BUMP_TOKEN` (which never existed in any scope, despite
having been referenced by workflow code).

## Secrets

The cluster reads the cell's own **Azure Key Vault** through External Secrets
(`SecretStore/lrai-operations` in the operations tenant): `lrai-stage-cus-kv` for
stage, `lrai-release-cus-kv` for release. The vault item is `operations-core`,
with properties `oneuptimeSecret`, `encryptionSecret`, `redisPassword`, and
`registerProbeKey`. The environment is deliberately absent from the item name
because the vault name already carries it.

1Password is no longer on the cluster's hot path; it remains the operator source
of truth. See `docs/onepassword-secrets.md` in `autonomy-cloud/lrai`.
