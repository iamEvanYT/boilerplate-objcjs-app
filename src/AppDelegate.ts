import type {
  _NSApplication,
  _NSApplicationDelegate,
} from "objcjs-types/AppKit";
import type { _NSNotification } from "objcjs-types/Foundation";
import { MainWindowController } from "./MainWindowController";
import { createDelegate } from "objcjs-types";

export function createAppDelegate() {
  return createDelegate("NSApplicationDelegate", {
    applicationDidFinishLaunching$: (notification: _NSNotification) => {
      const windowController = new MainWindowController();
      windowController.windowController.showWindow$(null);
    },
    applicationShouldTerminateAfterLastWindowClosed$: (
      sender: _NSApplication
    ) => {
      return true;
    },
  });
}
