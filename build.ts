#!/usr/bin/env bun
/**
 * Build script: creates a standalone macOS .app bundle
 *
 * Strategy:
 * 1. Bundle TS→JS with `bun build`, keeping `objc-js` external
 * 2. Create .app directory structure
 * 3. Copy bun runtime, bundled JS, and objc-js (with native addon) into bundle
 * 4. Create a shell launcher that runs `bun app.js` from inside the bundle
 * 5. Write Info.plist
 *
 * The key trick: node-gyp-build looks for `prebuilds/` next to `process.execPath`.
 * We place prebuilds/ in Contents/MacOS/ alongside the bun binary, and it works.
 */

import { $ } from "bun";
import { join, dirname } from "path";
import { mkdirSync, cpSync, chmodSync, writeFileSync, existsSync, rmSync } from "fs";

const APP_NAME = "BoilerplateSidebarApp";
const BUNDLE_ID = "com.example.boilerplate-sidebar-app";
const APP_VERSION = "1.0.0";

const projectRoot = import.meta.dir;
const distDir = join(projectRoot, "dist");
const appBundle = join(distDir, `${APP_NAME}.app`);
const contents = join(appBundle, "Contents");
const macOS = join(contents, "MacOS");
const resources = join(contents, "Resources");

// Clean previous bundle
if (existsSync(appBundle)) {
  console.log("Cleaning previous bundle...");
  rmSync(appBundle, { recursive: true });
}

// Step 1: Bundle TS→JS
console.log("Step 1: Bundling TypeScript → JavaScript...");
const bundleResult = await $`bun build src/index.ts --outfile=${join(macOS, "app.js")} --target=bun --external objc-js`.quiet();
if (bundleResult.exitCode !== 0) {
  console.error("Bundle failed:", bundleResult.stderr.toString());
  process.exit(1);
}
console.log("  → Bundled to app.js");

// Step 2: Create .app directory structure
console.log("Step 2: Creating .app directory structure...");
mkdirSync(macOS, { recursive: true });
mkdirSync(resources, { recursive: true });

// Step 3: Copy bun runtime
console.log("Step 3: Copying bun runtime...");
const bunPath = Bun.which("bun");
if (!bunPath) {
  console.error("Could not find bun executable");
  process.exit(1);
}
const bunDest = join(macOS, "bun");
cpSync(bunPath, bunDest);
chmodSync(bunDest, 0o755);
console.log(`  → Copied bun from ${bunPath}`);

// Stamp the bun binary with macOS 26.0 SDK version so Liquid Glass is enabled.
// Without this, macOS gates new UI features behind the SDK version in the Mach-O header.
console.log("  → Setting SDK build version to macOS 26.0 (Liquid Glass)...");
const vtoolResult = await $`vtool -set-build-version macos 11.0 26.0 ${bunDest} -output ${bunDest}`.quiet();
if (vtoolResult.exitCode !== 0) {
  console.error("vtool failed:", vtoolResult.stderr.toString());
  process.exit(1);
}
// Re-sign with ad-hoc signature since vtool invalidates the code signature
const codesignResult = await $`codesign --force --sign - ${bunDest}`.quiet();
if (codesignResult.exitCode !== 0) {
  console.error("codesign failed:", codesignResult.stderr.toString());
  process.exit(1);
}
console.log("  → Re-signed bun binary");

// Step 4: Copy objc-js and node-gyp-build into the bundle's node_modules
console.log("Step 4: Copying objc-js and node-gyp-build...");
const bundleNodeModules = join(macOS, "node_modules");

// Copy objc-js (JS + prebuilds)
cpSync(
  join(projectRoot, "node_modules/objc-js"),
  join(bundleNodeModules, "objc-js"),
  { recursive: true }
);

// Copy node-gyp-build (required by objc-js)
cpSync(
  join(projectRoot, "node_modules/node-gyp-build"),
  join(bundleNodeModules, "node-gyp-build"),
  { recursive: true }
);

// Also copy prebuilds next to the bun executable for the fallback path resolution
cpSync(
  join(projectRoot, "node_modules/objc-js/prebuilds"),
  join(macOS, "prebuilds"),
  { recursive: true }
);
console.log("  → Copied objc-js, node-gyp-build, and prebuilds");

// Step 5: Create launcher script
console.log("Step 5: Creating launcher script...");
const launcher = `#!/bin/bash
# Launcher for ${APP_NAME}
# Runs the bundled JS using the embedded bun runtime

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec "\${SCRIPT_DIR}/bun" "\${SCRIPT_DIR}/app.js"
`;
writeFileSync(join(macOS, APP_NAME), launcher);
chmodSync(join(macOS, APP_NAME), 0o755);
console.log(`  → Created ${APP_NAME} launcher`);

// Step 6: Write Info.plist
console.log("Step 6: Writing Info.plist...");
const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<string>${APP_NAME}</string>
	<key>CFBundleDisplayName</key>
	<string>Boilerplate Sidebar App</string>
	<key>CFBundleIdentifier</key>
	<string>${BUNDLE_ID}</string>
	<key>CFBundleVersion</key>
	<string>${APP_VERSION}</string>
	<key>CFBundleShortVersionString</key>
	<string>${APP_VERSION}</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleExecutable</key>
	<string>${APP_NAME}</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>LSMinimumSystemVersion</key>
	<string>14.0</string>
	<key>NSHighResolutionCapable</key>
	<true/>
	<key>NSSupportsAutomaticGraphicsSwitching</key>
	<true/>
	<key>LSApplicationCategoryType</key>
	<string>public.app-category.developer-tools</string>
</dict>
</plist>
`;
writeFileSync(join(contents, "Info.plist"), infoPlist);
console.log("  → Wrote Info.plist");

// Done!
console.log("");
console.log(`✓ Built ${APP_NAME}.app at:`);
console.log(`  ${appBundle}`);

// Show bundle size
const sizeResult = await $`du -sh ${appBundle}`.quiet();
console.log(`  Size: ${sizeResult.stdout.toString().split("\t")[0]?.trim() ?? "unknown"}`);
