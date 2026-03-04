import { NSApplication } from "objcjs-types/AppKit";
import { createAppDelegate } from "./AppDelegate";

function main() {
  const app = NSApplication.sharedApplication();
  const appDelegate = createAppDelegate();
  app.setDelegate$(appDelegate);
  app.run();
}

main();
