import { render } from 'preact';
import CommunicationWidget from './components/CommunicationWidget';
import widgetStyles from './index.css?inline';
import type { TeleWidgetConfig } from './types';

function init(config: TeleWidgetConfig = {}) {
  console.log('[TeleWidget] Initializing with config:', config);
  window.TeleWidgetConfig = config;

  // Create a container for the Shadow DOM if it doesn't exist
  let host = document.getElementById(config.containerId || 'tele-widget-host');
  if (!host) {
    host = document.createElement('div');
    host.id = config.containerId || 'tele-widget-host';
    document.body.appendChild(host);
  }

  const shadowRoot = host.attachShadow({ mode: 'open' });
  const mountPoint = document.createElement('div');
  mountPoint.className = 'tele-widget-mount';
  
  // Inject Tailwind and custom styles
  const styleTag = document.createElement('style');
  styleTag.textContent = widgetStyles;
  
  shadowRoot.appendChild(styleTag);
  shadowRoot.appendChild(mountPoint);

  // Apply custom accent color if provided
  if (config.accentColor) {
    mountPoint.style.setProperty('--tw-accent', config.accentColor);
  }

  render(<CommunicationWidget />, mountPoint);
}

// Auto-init if config is already present
if (window.TeleWidgetConfig) {
  init(window.TeleWidgetConfig);
}

// Expose global API
window.TeleWidget = {
  init
};
