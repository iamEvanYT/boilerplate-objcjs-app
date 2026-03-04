import { NSRect } from "objcjs-types";
import {
  NSBackingStoreType,
  NSWindow,
  NSWindowController,
  NSWindowStyleMask,
  type _NSWindowController,
} from "objcjs-types/AppKit";
import { NSApplicationMain } from "objcjs-types/AppKit/functions";
import { NSStringFromString, options } from "objcjs-types/helpers";

export class MainWindowController {
  public readonly windowController: _NSWindowController;

  constructor() {
    const frame = NSRect(0, 0, 900, 600);
    const styleMask = options(
      NSWindowStyleMask.Titled,
      NSWindowStyleMask.Closable,
      NSWindowStyleMask.Miniaturizable,
      NSWindowStyleMask.Resizable
    );
    const backingStoreType = NSBackingStoreType.NSBackingStoreBuffered;
    const defer = false;

    const window =
      NSWindow.alloc().initWithContentRect$styleMask$backing$defer$(
        frame,
        styleMask,
        backingStoreType,
        defer
      );
    this.windowController = NSWindowController.alloc().initWithWindow$(window);

    window.setTitle$(NSStringFromString("Boilerplate Sidebar App"));
    // window.contentViewController = RootSplitViewController();
    window.center();
  }
}
