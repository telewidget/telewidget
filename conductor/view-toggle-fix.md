# Plan - View Toggle Layout Fix & Restore Channels

This plan addresses the user's feedback regarding the "focused" view layout and restores accidentally removed channel buttons.

## Approach
- Update `WidgetPreview.tsx` to restore the `phone` and `email` channel simulations.
- Refactor the "focused" view layout in `WidgetPreview.tsx` to use a relative container that stacks the trigger bubble and widget panel based on the selected `config.position` (bottom-right or bottom-left), matching real-world behavior.
- Ensure all 4 channels (Telegram, WhatsApp, Phone, Email) are rendered in both "canvas" and "focused" views.

## Scope
- In: `WidgetPreview.tsx` layout and channel list.
- Out: Any changes to backend or configuration types.

## Action Items
[ ] Restore `phone` and `email` imports and rendering logic in `WidgetPreview.tsx`.
[ ] Update `WidgetPreview.tsx` focused view to use `items-end` or `items-start` based on `config.position`.
[ ] Verify the layout in the browser.

## Validation
- Check "focused" view: Bubble should be at the bottom right/left of the widget panel.
- Check widget simulation: All 4 channels should appear if enabled.
