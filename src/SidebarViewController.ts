import { NSRect } from "objcjs-types";
import {
  NSOutlineView,
  NSScrollView,
  NSTableCellView,
  NSTableColumn,
  NSTableViewStyle,
  NSTextField,
  NSViewController,
} from "objcjs-types/AppKit";
import { defineSubclass, callSuper } from "objcjs-types/subclass";
import { NSStringFromString } from "objcjs-types/helpers";
import type { _NSString } from "objcjs-types/Foundation";

// Module-level sidebar items (NSString objects)
const sidebarItems: _NSString[] = [
  NSStringFromString("Home"),
  NSStringFromString("Projects"),
  NSStringFromString("Settings"),
];

export const SidebarViewController = defineSubclass(NSViewController, {
  name: "SidebarViewController",
  protocols: ["NSOutlineViewDataSource", "NSOutlineViewDelegate"],
  methods: {
    loadView: {
      types: "v@:",
      implementation(self) {
        const frame = NSRect(0, 0, 200, 600);

        // Create outline view
        const outlineView = NSOutlineView.alloc().initWithFrame$(frame);

        // Create and add a table column
        const column = NSTableColumn.alloc().initWithIdentifier$(
          NSStringFromString("SidebarColumn")
        );
        outlineView.addTableColumn$(column);
        outlineView.setOutlineTableColumn$(column);

        // Use native source list style for proper sidebar appearance
        outlineView.setStyle$(NSTableViewStyle.SourceList);

        // Remove header view
        outlineView.setHeaderView$(null);

        // Set self as delegate and data source
        outlineView.setDelegate$(self as any);
        outlineView.setDataSource$(self as any);

        // Create scroll view as the VC's view directly — no wrapper
        const scrollView = NSScrollView.alloc().initWithFrame$(frame);
        scrollView.setDocumentView$(outlineView);
        scrollView.setHasVerticalScroller$(true);
        scrollView.setDrawsBackground$(false); // Transparent for Liquid Glass

        // The scroll view IS the view — NSSplitViewController manages its frame
        self.setView$(scrollView);
      },
    },

    // MARK: - NSOutlineViewDataSource

    outlineView$numberOfChildrenOfItem$: {
      types: "q@:@@",
      implementation(_self, _outlineView, item) {
        if (item === null || item === undefined) {
          return sidebarItems.length;
        }
        return 0;
      },
    },

    outlineView$child$ofItem$: {
      types: "@@:@q@",
      implementation(_self, _outlineView, index, _item) {
        return sidebarItems[index as number];
      },
    },

    outlineView$isItemExpandable$: {
      types: "B@:@@",
      implementation(_self, _outlineView, _item) {
        return false;
      },
    },

    // MARK: - NSOutlineViewDelegate

    outlineView$viewForTableColumn$item$: {
      types: "@@:@@@",
      implementation(_self, _outlineView, _tableColumn, item) {
        const cellView = NSTableCellView.alloc().initWithFrame$(
          NSRect(0, 0, 200, 24)
        );

        const textField = NSTextField.labelWithString$(
          item as unknown as _NSString
        );
        textField.setTranslatesAutoresizingMaskIntoConstraints$(false);

        cellView.setTextField$(textField);
        cellView.addSubview$(textField);

        // Pin text field to cell view edges
        textField
          .leadingAnchor()
          .constraintEqualToAnchor$(cellView.leadingAnchor())
          .setActive$(true);
        textField
          .trailingAnchor()
          .constraintEqualToAnchor$(cellView.trailingAnchor())
          .setActive$(true);
        textField
          .centerYAnchor()
          .constraintEqualToAnchor$(cellView.centerYAnchor())
          .setActive$(true);

        return cellView;
      },
    },
  },
});
