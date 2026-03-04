import {
  NSSplitViewController,
  NSSplitViewItem,
  NSTitlebarSeparatorStyle,
} from "objcjs-types/AppKit";
import { defineSubclass, callSuper } from "objcjs-types/subclass";
import { SidebarViewController } from "./SidebarViewController";
import { ContentViewController } from "./ContentViewController";

export const RootSplitViewController = defineSubclass(NSSplitViewController, {
  name: "RootSplitViewController",
  methods: {
    viewDidLoad: {
      types: "v@:",
      implementation(self) {
        callSuper(self, "viewDidLoad");

        // Create the sidebar view controller and wrap in a sidebar split view item
        const sidebarVC = SidebarViewController.alloc().init();
        const sidebarItem =
          NSSplitViewItem.sidebarWithViewController$(sidebarVC);
        sidebarItem.setMinimumThickness$(180);
        sidebarItem.setMaximumThickness$(300);
        sidebarItem.setTitlebarSeparatorStyle$(
          NSTitlebarSeparatorStyle.Automatic
        );

        // Create the content view controller and wrap in a content list split view item
        const contentVC = ContentViewController.alloc().init();
        const contentItem =
          NSSplitViewItem.contentListWithViewController$(contentVC);

        // Add both items to the split view controller
        self.addSplitViewItem$(sidebarItem);
        self.addSplitViewItem$(contentItem);
      },
    },
  },
});
