import { NSRect } from "objcjs-types";
import {
  NSBackingStoreType,
  NSToolbar,
  NSToolbarItemIdentifier,
  NSTrackingSeparatorToolbarItem,
  NSWindow,
  NSWindowController,
  NSWindowStyleMask,
  NSWindowToolbarStyle,
  type _NSWindowController,
} from "objcjs-types/AppKit";
import {
  NSArrayFromObjects,
  NSStringFromString,
  options,
} from "objcjs-types/helpers";
import { RootSplitViewController } from "./RootSplitViewController";

export class MainWindowController {
  public readonly windowController: _NSWindowController;

  constructor() {
    const frame = NSRect(0, 0, 900, 600);
    const styleMask = options(
      NSWindowStyleMask.Titled,
      NSWindowStyleMask.Closable,
      NSWindowStyleMask.Miniaturizable,
      NSWindowStyleMask.Resizable,
      NSWindowStyleMask.FullSizeContentView
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

    // Set up the root split view controller as the content
    const rootSplitVC = RootSplitViewController.alloc().init();
    window.setContentViewController$(rootSplitVC);

    // Create a toolbar for Liquid Glass integration
    const toolbar = NSToolbar.alloc().initWithIdentifier$(
      NSStringFromString("MainToolbar")
    );
    toolbar.setDisplayMode$(2); // NSToolbarDisplayModeIconOnly

    // Create a tracking separator that follows the sidebar divider
    const trackingSeparator =
      NSTrackingSeparatorToolbarItem.trackingSeparatorToolbarItemWithIdentifier$splitView$dividerIndex$(
        NSStringFromString(
          NSToolbarItemIdentifier.NSToolbarSidebarTrackingSeparatorItemIdentifier
        ),
        rootSplitVC.splitView(),
        0
      );

    // Set toolbar items: sidebar toggle, tracking separator, flexible space
    toolbar.setItemIdentifiers$(
      NSArrayFromObjects([
        NSStringFromString(
          NSToolbarItemIdentifier.NSToolbarToggleSidebarItemIdentifier
        ),
        NSStringFromString(
          NSToolbarItemIdentifier.NSToolbarSidebarTrackingSeparatorItemIdentifier
        ),
      ])
    );

    window.setToolbar$(toolbar);
    window.setToolbarStyle$(NSWindowToolbarStyle.Unified);

    window.center();
  }
}
