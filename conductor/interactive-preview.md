# Plan - Fully Interactive Widget Preview via iframe Integration

## Approach
To make the configurator's widget preview fully interactable (navigatable, capable of sending messages, etc.) without duplicating the entire complex Preact application logic into Next.js, we will switch from rendering a static HTML mockup to embedding the **actual built widget script (`telewidget.iife.js`)** inside an iframe. 
When the user modifies styles, colors, or channels, the Configurator will send a `postMessage` with the new config to the iframe, seamlessly hot-reloading the real widget.

## Scope
- In: `WidgetPreview.tsx` (to render `iframe` and dispatch `postMessage`), `public/preview-frame.html` (the sandbox page).
- Out: Modifying the client widget source code (`telewidget/client`).

## Action Items
[ ] Write `preview-frame.html` into `config-telewidget-web/public/`. It contains a script to listen for `RENDER_WIDGET` messages and initialize the actual widget script.
[ ] Update `WidgetPreview.tsx` to replace the static HTML mockups with the new `<iframe src="/preview-frame.html" />`.
[ ] Send config, theme, and viewMode data continuously to the iframe when the user changes settings.
[ ] Automatically manage Shadow DOM cleanup and re-initialization inside the iframe on config changes.

## Validation
- The widget in the preview pane should look identical to the real widget.
- Clicking the trigger bubble should open the widget.
- You can navigate into the "Live Chat" panel or "Email" panel.
- Modifying a color in the sidebar updates the widget in real-time.