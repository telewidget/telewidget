# TeleWidget Implementation Plan

## Objective
Convert the existing Next.js `CommunicationWidget` into a standalone, embeddable package (similar to tawk.to). The widget will be built using Preact for a lightweight bundle, utilize Shadow DOM to prevent CSS conflicts, and include a backend template for easy API deployment.

## Phase 1: Project Environment Setup
1. **Frontend Tooling:** Initialize a Vite project configured for Preact and Library Mode.
2. **Styling:** Set up TailwindCSS (if utilized in the original widget) to compile into a single CSS file.
3. **Backend Template:** Create a `server/` directory and initialize a basic Node.js/Express application to host the chat API routes.

## Phase 2: Source Extraction & Porting
1. **Copy Assets:** Migrate `CommunicationWidget.tsx`, `LiveChatPanel.tsx`, chat hooks (`useChatHistory`, `useChatSession`), and utilities from the `electrotion-web` source project into the new workspace.
2. **Preact Refactor:** Update all React imports to use Preact (`preact` and `preact/hooks`).
3. **Next.js Decoupling:** Replace Next.js specific components (e.g., `next/image`, `next/link`) with standard HTML equivalents (`<img>`, `<a>`).
4. **Backend Porting:** Extract the Next.js API logic (`src/app/api/chat`) and rewrite it as Express route handlers in the `server/` template.

## Phase 3: Embeddable Wrapper & Shadow DOM
1. **Entry Point:** Create a `main.tsx` entry point that registers the widget onto the global `window` object (e.g., `window.TeleWidget`).
2. **Initialization Logic:** Allow the widget to accept configuration (like `apiBaseUrl` or `clientId`) via a setup function.
3. **Shadow DOM Encapsulation:** Create a host HTML element, attach a Shadow Root, inject the bundled CSS stylesheet, and mount the Preact application inside it to guarantee 100% style isolation.

## Phase 4: API Integration
1. **Dynamic Endpoints:** Update the frontend API fetch calls to use the dynamically configured `apiBaseUrl` rather than hardcoded or relative paths.
2. **CORS:** Configure the Express backend template to support CORS so it can receive requests from any domain embedding the widget.

## Phase 5: Build & Documentation
1. **Bundling:** Configure Vite to output a single IIFE/UMD `.js` file for direct `<script>` tag usage, along with standard ES modules for NPM publishing.
2. **Testing:** Create a vanilla `index.html` file to test the `<script>` tag embedding locally.
3. **Documentation:** Write a `README.md` detailing how to deploy the backend template, and how end-users can drop the `<script>` tag onto their websites.