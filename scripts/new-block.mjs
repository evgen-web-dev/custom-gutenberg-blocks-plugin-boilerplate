import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { cwd, env } from "node:process";
import path from "node:path";

// util helper to stop process
function die(msg, code = 1) { console.error(`✖ ${msg}`); process.exit(code); }

const [NS, SLUG, ...rest] = process.argv.slice(2);
if (!NS || !SLUG) {
    console.log("Usage: npm run new:block -- <namespace> <slug>");
    process.exit(0);
}

// input validation
const rxNs = /^[a-z][a-z0-9-]*$/;      // WP-style namespace
const rxSlug = /^[a-z0-9-]+$/;           // block slug
if (!rxNs.test(NS)) die(`Invalid namespace "${NS}". Use lowercase letters, digits, dashes (start with a letter).`);
if (!rxSlug.test(SLUG)) die(`Invalid slug "${SLUG}". Use lowercase letters, digits, dashes.`);


// project root checks
const root = cwd();
const pkgJson = path.join(root, "package.json");

if (!existsSync(pkgJson)) die("Run from your plugin/theme root (package.json is missing).");


// target path (prevent traversal)
const srcDir = path.resolve(root, "src");
const targetDir = path.resolve(srcDir, SLUG);

if (!existsSync(srcDir)) {
    try { mkdirSync(srcDir, { recursive: true }); } 
    catch (e) { die(`Cannot create ${srcDir}: ${e.message}`); }
}

// prevent creation of new block with name that is already taken
if (existsSync(targetDir)) {
    try { if (statSync(targetDir).isDirectory()) die(`Target ./src/${SLUG} already exists.`); } catch { }
}

// ensure targetDir is inside srcDir
if (!targetDir.startsWith(srcDir + path.sep)) die("Resolved target is outside ./src. Aborting.");


// helper to run commands
function run(cmd, args, opts = {}) {
    const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
    if (r.error) die(r.error.message);
    if (r.status !== 0) process.exit(r.status);
}


const CREATE_BLOCK = "@wordpress/create-block@4.76.0";

console.log(`▶ Scaffolding ${NS}/${SLUG} …`);
const createArgs = [
    CREATE_BLOCK, SLUG,
    `--namespace=${NS}`,
    "--no-plugin",
    "--no-wp-scripts",
    `--target-dir=${path.relative(root, targetDir)}`,
];

// npm_config_yes: "true" -> auto-yes to npx prompt in non-interactive shells
run("npx", ["-y", ...createArgs], { env: { ...env, npm_config_yes: "true" } });
