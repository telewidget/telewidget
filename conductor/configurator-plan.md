# Implementation Plan: TeleWidget Configurator

Build a web-based configurator for TeleWidget using Next.js, allowing users to customize, manage, and download their widget setup.

## Objective
Create a professional, user-friendly tool to:
- Visually edit widget design and content.
- Preview changes in real-time.
- Manage multiple configurations via LocalStorage.
- Export/Import JSON configurations.
- Download a self-hosted bundle for installation.

## Key Files & Context
- **Source Project:** `C:\Users\DIKKA\Documents\01-Projects\22-TeleWidget\telewidget` (contains the widget core).
- **Target Project:** `C:\Users\DIKKA\Documents\01-Projects\22-TeleWidget\config-telewidget-web` (Next.js app).
- **Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide Icons, Shadcn/UI (for rapid, professional UI).

## Phase 1: Foundation & State Management
- [ ] Initialize Shadcn/UI and essential components (Tabs, Forms, Dialogs).
- [ ] Implement `useConfigs` hook to manage LocalStorage persistence.
- [ ] Define the `WidgetConfig` TypeScript interface.
- [ ] Create basic layout with Sidebar (Editor) and Main (Preview).

## Phase 2: Editor Interface
- [ ] **Appearance Tab:** Color pickers (Accent, Background), Border Radius, Positioning.
- [ ] **Content Tab:** Widget title, Welcome message, Button labels.
- [ ] **Channels Tab:** Setup for Phone, Email, WhatsApp, and Telegram integration.
- [ ] **Manage Tab:** Rename, delete, and switch between saved configs.

## Phase 3: Real-time Preview
- [ ] Implement a `WidgetPreview` component that reflects state changes instantly.
- [ ] *Optional:* Use an iframe to load the actual widget for highest fidelity, passing config via `postMessage`.

## Phase 4: Export & Bundle Generation
- [ ] Implement JSON Export/Import functionality.
- [ ] Create a "Download Bundle" feature:
    - Copy `telewidget.iife.js` from the core project.
    - Generate an `index.html` with the correctly initialized snippet.
    - Package into a ZIP file using `jszip`.

## Phase 5: Verification & Polishing
- [ ] Verify that exported bundles work correctly on a generic static server.
- [ ] Apply UI/UX Pro Max refinements (Focus states, animations, responsive checks).
- [ ] Add a "Quick Start" guide in the UI.

## Verification
- [ ] Create a config, save it, and verify it persists after reload.
- [ ] Export JSON and re-import it to a new config.
- [ ] Download bundle and run locally to see the custom widget.
