// Sync VERSION into every internal package.json, its package-lock root
// metadata, and each published Helm chart.
// VERSION is the Operations release version; npm packages, OCI images, and Helm
// artifacts must not advertise independent versions for the same release.
//
// Usage:
//   node Scripts/Install/SyncPackageVersions.js          # sync all package.json to VERSION
//   node Scripts/Install/SyncPackageVersions.js --check  # exit non-zero if any drift

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const VERSION_FILE = path.join(REPO_ROOT, "VERSION");
const RELEASE_CHARTS = [
  path.join(
    REPO_ROOT,
    "HelmChart",
    "Public",
    "cast-operations",
    "Chart.yaml",
  ),
  path.join(
    REPO_ROOT,
    "HelmChart",
    "Public",
    "kubernetes-agent",
    "Chart.yaml",
  ),
];

const IGNORED_DIRS = new Set([
  "node_modules",
  "build",
  "dist",
  ".git",
  "Backups",
  "coverage",
  ".next",
  ".cache",
]);

function readTargetVersion() {
  const raw = fs.readFileSync(VERSION_FILE, "utf8").trim();
  if (!raw) {
    console.error("VERSION file is empty");
    process.exit(1);
  }
  return raw;
}

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return out;
  }
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name === "package.json") {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function syncFile(file, version, checkOnly) {
  const raw = fs.readFileSync(file, "utf8");
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch (err) {
    return { skipped: true };
  }
  if (typeof pkg.version !== "string") return { skipped: true };
  if (pkg.version === version) return { changed: false, prev: pkg.version };
  if (!checkOnly) {
    // Replace only the first "version": "..." occurrence. package.json schema
    // forbids a duplicate top-level "version" field, and dependency entries use
    // package names as keys (never the literal "version"), so this regex is safe.
    const updated = raw.replace(
      /("version"\s*:\s*")[^"]*(")/,
      `$1${version}$2`,
    );
    fs.writeFileSync(file, updated);
  }
  return { changed: true, prev: pkg.version };
}

function syncLockFile(file, version, checkOnly) {
  const raw = fs.readFileSync(file, "utf8");
  const lock = JSON.parse(raw);
  const rootPackage = lock.packages && lock.packages[""];
  const drifted = [];
  const internalPackagePattern =
    /("name"\s*:\s*"@cast-operations\/[^"]+"\s*,\s*"version"\s*:\s*")[^"]+(")/g;

  if (typeof lock.version === "string" && lock.version !== version) {
    drifted.push({ field: "version", prev: lock.version });
  }
  if (
    rootPackage &&
    typeof rootPackage.version === "string" &&
    rootPackage.version !== version
  ) {
    drifted.push({ field: 'packages[""].version', prev: rootPackage.version });
  }

  for (const match of raw.matchAll(internalPackagePattern)) {
    const currentVersion = match[0].match(/"version"\s*:\s*"([^"]+)"/)?.[1];
    if (currentVersion && currentVersion !== version) {
      drifted.push({
        field: "linked @cast-operations package version",
        prev: currentVersion,
      });
    }
  }

  if (!checkOnly && drifted.length > 0) {
    let updated = raw.replace(
      /("version"\s*:\s*")[^"]*(")/,
      `$1${version}$2`,
    );
    updated = updated.replace(
      /("packages"\s*:\s*\{\s*""\s*:\s*\{[\s\S]*?"version"\s*:\s*")[^"]*(")/,
      `$1${version}$2`,
    );
    updated = updated.replace(
      internalPackagePattern,
      `$1${version}$2`,
    );
    fs.writeFileSync(file, updated);
  }

  return drifted;
}

function syncChart(file, version, checkOnly) {
  const raw = fs.readFileSync(file, "utf8");
  const fields = ["version", "appVersion"];
  let updated = raw;
  const drifted = [];

  for (const field of fields) {
    const pattern = new RegExp(
      `^(${field}:[ \\t]*)["']?([^"' \\t]+)["']?[ \\t]*$`,
      "m",
    );
    const match = updated.match(pattern);
    if (!match) {
      throw new Error(`${path.relative(REPO_ROOT, file)} is missing ${field}`);
    }
    if (match[2] === version) continue;
    drifted.push({ field, prev: match[2] });
    if (!checkOnly) {
      updated = updated.replace(pattern, `$1"${version}"`);
    }
  }

  if (!checkOnly && drifted.length > 0) {
    fs.writeFileSync(file, updated);
  }
  return drifted;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has("--check");
  const targetVersion = readTargetVersion();
  const files = walk(REPO_ROOT, []);
  const lockFiles = [
    ...new Set(
      files
        .map((file) => path.join(path.dirname(file), "package-lock.json"))
        .filter((file) => fs.existsSync(file)),
    ),
  ];

  const drifted = [];
  let skipped = 0;
  for (const file of files) {
    const result = syncFile(file, targetVersion, checkOnly);
    if (result.skipped) {
      skipped++;
      continue;
    }
    if (result.changed) {
      drifted.push({ file: path.relative(REPO_ROOT, file), prev: result.prev });
    }
  }

  const driftedLocks = [];
  for (const file of lockFiles) {
    for (const drift of syncLockFile(file, targetVersion, checkOnly)) {
      driftedLocks.push({
        file: path.relative(REPO_ROOT, file),
        ...drift,
      });
    }
  }

  const driftedCharts = [];
  for (const file of RELEASE_CHARTS) {
    for (const drift of syncChart(file, targetVersion, checkOnly)) {
      driftedCharts.push({
        file: path.relative(REPO_ROOT, file),
        ...drift,
      });
    }
  }

  if (
    drifted.length === 0 &&
    driftedLocks.length === 0 &&
    driftedCharts.length === 0
  ) {
    console.log(
      `All ${files.length - skipped} package.json file(s), ${lockFiles.length} package-lock root(s), and ${RELEASE_CHARTS.length} Helm chart(s) already at ${targetVersion}.`,
    );
    return;
  }

  for (const { file, prev } of drifted) {
    console.log(
      `${checkOnly ? "drift" : "sync"}: ${file} (${prev} -> ${targetVersion})`,
    );
  }
  for (const { file, field, prev } of driftedLocks) {
    console.log(
      `${checkOnly ? "drift" : "sync"}: ${file} ${field} (${prev} -> ${targetVersion})`,
    );
  }
  for (const { file, field, prev } of driftedCharts) {
    console.log(
      `${checkOnly ? "drift" : "sync"}: ${file} ${field} (${prev} -> ${targetVersion})`,
    );
  }

  if (checkOnly) {
    console.error(
      `\n${drifted.length} package.json field(s), ${driftedLocks.length} package-lock field(s), and ${driftedCharts.length} Helm chart field(s) out of sync with VERSION (${targetVersion}).`,
    );
    console.error(
      "Run 'npm run sync-package-versions' from the repo root and commit the release metadata changes.",
    );
    process.exit(1);
  }

  console.log(
    `\nSynced ${drifted.length} package.json file(s), ${driftedLocks.length} package-lock field(s), and ${driftedCharts.length} Helm chart field(s) to ${targetVersion}.`,
  );
}

main();
