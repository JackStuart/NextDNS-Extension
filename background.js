// Import domain validation utilities
import { isValidDomain, sanitizeDomain } from './utils.js';

// Rate limiter to prevent API abuse
const rateLimiter = {
  lastRequest: 0,
  minTimeBetweenRequests: 1000, // 1 second
  
  canMakeRequest() {
    const now = Date.now();
    if (now - this.lastRequest < this.minTimeBetweenRequests) {
      return false;
    }
    this.lastRequest = now;
    return true;
  }
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addToAllowlist') {
    // Validate domain again on the background side
    const cleanDomain = sanitizeDomain(message.domain);
    
    if (!cleanDomain) {
      sendResponse({
        success: false,
        error: 'Invalid domain format'
      });
      return false;
    }
    
    // Check rate limiting
    if (!rateLimiter.canMakeRequest()) {
      sendResponse({
        success: false,
        error: 'Please wait a moment before trying again'
      });
      return false;
    }
    
    // Proceed with API call
    addDomainToAllowlist(cleanDomain, sendResponse);
    return true; // Keep the message channel open for the async response
  }
});

// Add domain to NextDNS allowlist
async function addDomainToAllowlist(domain, sendResponse) {
  try {
    // Get API key and profile ID from storage
    const { nextdnsApiKey, nextdnsProfileId } = await getStorageData({
      nextdnsApiKey: '',
      nextdnsProfileId: ''
    });

    // Validate credentials
    if (!nextdnsApiKey || !nextdnsProfileId) {
      sendResponse({
        success: false,
        error: 'API key or profile ID not configured. Please check settings.'
      });
      return;
    }

    // Call NextDNS API
    const apiUrl = `https://api.nextdns.io/profiles/${nextdnsProfileId}/allowlist`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': nextdnsApiKey
      },
      body: JSON.stringify({ id: domain, active: true })
    });

    // Handle API response
    if (response.ok) {
      // Try to parse JSON, but don't fail if there isn't any
      try {
        const data = await response.json();
        sendResponse({ success: true, data });
      } catch (e) {
        // If JSON parsing fails, still report success
        sendResponse({ success: true });
      }
    } else {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If there's no JSON in the error, use the status text
        errorMessage = `API Error: ${response.status} ${response.statusText}`;
      }
      
      sendResponse({ success: false, error: errorMessage });
    }
  } catch (error) {
    sendResponse({
      success: false,
      error: 'Failed to communicate with NextDNS API: ' + error.message
    });
  }
}

// Helper function to get data from chrome.storage.sync
function getStorageData(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (result) => {
      resolve(result);
    });
  });
}