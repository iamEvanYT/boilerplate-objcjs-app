# Boilerplate Sidebar App

A native macOS sidebar app built with TypeScript and [objcjs-types](https://github.com/iamEvanYT/objcjs-types), running on [Bun](https://bun.sh). Features Liquid Glass styling (macOS 26 Tahoe) and Apple's native split view sidebar.

## Prerequisites

- macOS 26 (Tahoe) or later
- [Bun](https://bun.sh) v1.3+

## Setup

```bash
bun install
```

## Development

```bash
bun run start
```

## Build .app Bundle

```bash
bun run build
```

This produces `dist/BoilerplateSidebarApp.app` (~61MB), a standalone `.app` bundle that includes the Bun runtime, bundled JS, and the native `objc-js` addon. The build script uses `vtool` to stamp the binary with the macOS 26.0 SDK version, enabling Liquid Glass.

## Project Structure

```
src/
  index.ts                  # Entry point — creates NSApplication and runs the event loop
  AppDelegate.ts            # NSApplicationDelegate — creates the main window on launch
  MainWindowController.ts   # Window with NSToolbar (Liquid Glass, sidebar toggle, tracking separator)
  RootSplitViewController.ts # NSSplitViewController with sidebar + content items
  SidebarViewController.ts  # NSOutlineView with SourceList style and transparent scroll view
  ContentViewController.ts  # Placeholder content area with centered label
build.ts                    # Build script — bundles into a standalone .app
```
