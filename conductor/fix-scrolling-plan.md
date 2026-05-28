# Plan - Fix Scrolling Issue in Configurator Sidebar

The user reported that scrolling is not working in the configurator. I will replace the manual `overflow-y-auto` implementation with Shadcn/UI's `ScrollArea` and ensure proper flexbox constraints are applied to allow scrolling.

## Scope

- In: `ConfiguratorMain.tsx`
- Out: Other components unless layout-related.

## Action Items

- [ ] Import `ScrollArea` in `ConfiguratorMain.tsx`.
- [ ] Replace the `div` containing `TabsContent` with `ScrollArea`.
- [ ] Apply `flex-1` and `min-h-0` to the `ScrollArea` container.
- [ ] Ensure `TabsContent` components are correctly nested within the `ScrollArea`.
- [ ] Verify scrolling functionality by switching to the "Channels" tab (which is typically long).

## Validation

- [ ] Open the configurator in the browser.
- [ ] Switch to the "Channels" tab.
- [ ] Verify that a scrollbar appears and content can be scrolled.
