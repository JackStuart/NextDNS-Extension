// Import domain validation utilities
import { isValidDomain, sanitizeDomain } from './utils.js';

// Get current tab's domain and update UI
function getCurrentTabDomain() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;

        // Display domain and enable button if valid
        document.getElementById('currentDomain').textContent = domain;
        document.getElementById('addToAllowlistButton').disabled = false;
      } catch (error) {
        document.getElementById('currentDomain').textContent = 'Invalid URL';
        document.getElementById('addToAllowlistButton').disabled = true;
      }
    } else {
      document.getElementById('currentDomain').textContent = 'Unable to get domain';
      document.getElementById('addToAllowlistButton').disabled = true;
    }
  });
}

// Add current domain to NextDNS allowlist
function addToAllowlist() {
  // Get current domain
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;

        // Sanitize the domain
        const cleanDomain = sanitizeDomain(domain);

        if (!cleanDomain) {
          showStatus('Invalid domain format', 'error');
          return;
        }

        // Disable button to prevent multiple clicks
        const addButton = document.getElementById('addToAllowlistButton');
        addButton.disabled = true;
        addButton.textContent = 'Adding...';

        // Send message to background script to handle API call
        chrome.runtime.sendMessage(
          {
            action: 'addToAllowlist',
            domain: cleanDomain
          },
          (response) => {
            if (response && response.success) {
              showStatus(`Added ${cleanDomain} to allowlist`, 'success');
              addButton.textContent = 'Added Successfully';
            } else {
              const errorMsg = response ? response.error : 'Unknown error';
              showStatus(`Error: ${errorMsg}`, 'error');
              addButton.textContent = 'Add to NextDNS Allowlist';
              addButton.disabled = false;
            }
          }
        );
      } catch (error) {
        showStatus('Invalid URL', 'error');
      }
    } else {
      showStatus('Unable to get domain from current tab', 'error');
    }
  });
}

// Show status message
function showStatus(message, type) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = 'status ' + type;
  statusElement.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      window.close(); // Close popup after success
    }, 1500);
  } else if (type === 'error') {
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
}

// Open options page
function openSettings(e) {
  e.preventDefault(); // Prevent default link behavior
  chrome.runtime.openOptionsPage();
}

// Initialize popup
function initPopup() {
  // Check if API key and profile ID are set
  chrome.storage.sync.get(
    { nextdnsApiKey: '', nextdnsProfileId: '' },
    (items) => {
      if (!items.nextdnsApiKey || !items.nextdnsProfileId) {
        // Settings not configured
        document.getElementById('setupRequired').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
      } else {
        // Settings configured, show main content
        document.getElementById('setupRequired').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        getCurrentTabDomain();
      }
    }
  );
}

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the popup
  initPopup();

  // Add event listeners to buttons
  document.getElementById('addToAllowlistButton').addEventListener('click', addToAllowlist);
  document.getElementById('openSettingsButton').addEventListener('click', openSettings);
  document.getElementById('settingsLink').addEventListener('click', openSettings);
});