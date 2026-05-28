# Plan - Upgrading the Client Widget for the Configurator

## Approach
The recent Interactive Preview upgrade replaced the static mock HTML with the actual embedded client widget (`telewidget.iife.js`). However, this revealed a major gap:
1. The client widget was never updated to support the advanced styling features we added to the configurator mock (glassmorphism, typography, effects, border radius, position).
2. Because the preview hot-reloads the widget on every setting change, the widget loses its state and collapses back to the "closed" bubble, making it impossible to style the open panel properly.

We need to update the source code of the **actual client widget** (`telewidget/client`) so that it:
1. Uses a `_devModeOpen` or `_forceOpen` flag to initialize `isOpen` to `true` inside the Configurator.
2. Reads the advanced `TeleWidgetConfig` (glassmorphism, typography, borderRadius, position) and applies the correct dynamic CSS inside its Shadow DOM.
3. Rebuilds `telewidget.iife.js` and copies it over to the Configurator.

## Scope
- In: `telewidget/client/src/components/CommunicationWidget.tsx`, `telewidget/client/src/types/index.ts`, `telewidget/client/src/main.tsx`.
- Out: Anything outside the actual client widget.

## Action Items
[ ] Update `telewidget/client/src/types/index.ts` to include the full `WidgetConfig` definition used by the Configurator (including `channels`, `glassmorphism`, `effects`, `typography`, `position`, `borderRadius`, `themeMode`, and an internal `_devModeOpen` boolean).
[ ] Update `telewidget/client/src/components/CommunicationWidget.tsx` so `useState` for `isOpen` is initialized via `config._devModeOpen`.
[ ] Update `telewidget/client/src/components/CommunicationWidget.tsx` to generate and apply dynamic inline styles for glassmorphism, fonts, and shadows based on the `config` object, mirroring the logic previously held in the static mock.
[ ] Ensure the widget respects the `position: "bottom-left"` or `"bottom-right"` setting.
[ ] Build the client widget (`npm run build`) and automatically copy the updated `telewidget.iife.js` to `config-telewidget-web/public/`.

## Validation
- Modifying styles in the Configurator will seamlessly hot-reload the actual client widget in the iframe.
- The widget will remain OPEN if `_devModeOpen` is true.
- Advanced styling (glassmorphism, fonts) will correctly render inside the iframe's Shadow DOM.