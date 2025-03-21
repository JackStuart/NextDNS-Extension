// Save options to chrome.storage
function saveOptions() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const profileId = document.getElementById('profileId').value.trim();

  // Basic validation
  if (!apiKey || !profileId) {
    showStatus('Both API key and profile ID are required.', 'error');
    return;
  }

  chrome.storage.sync.set(
    { nextdnsApiKey: apiKey, nextdnsProfileId: profileId },
    () => {
      if (chrome.runtime.lastError) {
        showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('Settings saved successfully!', 'success');
      }
    }
  );
}

// Test connection to NextDNS API
async function testConnection() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const profileId = document.getElementById('profileId').value.trim();

  // Validate inputs
  if (!apiKey || !profileId) {
    showStatus('Both API key and profile ID are required.', 'error');
    return;
  }

  showStatus('Testing connection...', 'warning');

  try {
    // Call NextDNS API to verify credentials
    const apiUrl = `https://api.nextdns.io/profiles/${profileId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (response.ok) {
      showStatus('Connection successful! Your API key and profile ID are working.', 'success');
    } else {
      if (response.status === 401) {
        showStatus('Authentication failed. Please check your API key.', 'error');
      } else if (response.status === 404) {
        showStatus('Profile not found. Please check your profile ID.', 'error');
      } else {
        showStatus(`Connection failed: ${response.status} ${response.statusText}`, 'error');
      }
    }
  } catch (error) {
    showStatus('Connection test failed: ' + error.message, 'error');
  }
}

// Toggle password visibility
function togglePasswordVisibility() {
  const apiKeyInput = document.getElementById('apiKey');
  apiKeyInput.type = document.getElementById('showApiKey').checked ? 'text' : 'password';
}

// Restore options from chrome.storage
function restoreOptions() {
  chrome.storage.sync.get(
    { nextdnsApiKey: '', nextdnsProfileId: '' },
    (items) => {
      document.getElementById('apiKey').value = items.nextdnsApiKey;
      document.getElementById('profileId').value = items.nextdnsProfileId;
    }
  );
}

// Show status message
function showStatus(message, type) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = type;
  statusElement.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);
document.getElementById('testConnectionButton').addEventListener('click', testConnection);
document.getElementById('showApiKey').addEventListener('change', togglePasswordVisibility);