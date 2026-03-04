import { NSRect } from "objcjs-types";
import {
  NSFont,
  NSTextField,
  NSView,
  NSViewController,
} from "objcjs-types/AppKit";
import { defineSubclass, callSuper } from "objcjs-types/subclass";
import { NSStringFromString } from "objcjs-types/helpers";

export const ContentViewController = defineSubclass(NSViewController, {
  name: "ContentViewController",
  methods: {
    loadView: {
      types: "v@:",
      implementation(self) {
        const view = NSView.alloc().initWithFrame$(NSRect(0, 0, 600, 600));
        self.setView$(view);
      },
    },
    viewDidLoad: {
      types: "v@:",
      implementation(self) {
        callSuper(self, "viewDidLoad");

        const label = NSTextField.labelWithString$(
          NSStringFromString("Placeholder Content Area")
        );

        // NSFontWeightSemibold = ~0.3
        const font = NSFont.systemFontOfSize$weight$(28, 0.3);
        label.setFont$(font);

        // Use Auto Layout to center the label
        label.setTranslatesAutoresizingMaskIntoConstraints$(false);
        self.view().addSubview$(label);

        label
          .centerXAnchor()
          .constraintEqualToAnchor$(self.view().centerXAnchor())
          .setActive$(true);
        label
          .centerYAnchor()
          .constraintEqualToAnchor$(self.view().centerYAnchor())
          .setActive$(true);
      },
    },
  },
});
