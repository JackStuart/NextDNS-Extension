# NextDNS Allowlist Manager

A browser extension that allows you to quickly add websites to your NextDNS allowlist with a single click.

## Features

- Add the current website to your NextDNS allowlist with one click
- Automatically removes "www." prefix for consistent domain management
- Secure storage of your NextDNS API credentials
- Simple, user-friendly interface

## Installation

### From Source

1. Clone or download this repository
2. Open your browser's extension management page:
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" (Chrome/Edge)
5. Select the extension directory

## Setup

1. After installing the extension, click on the extension icon in your browser toolbar
2. Click "Open Settings" to configure the extension
3. Enter your NextDNS API key and profile ID
4. Click "Save Settings"

### Where to find your NextDNS information

- **API Key**: Log in to your NextDNS account, go to Account Settings, and find your API key under the API section
- **Profile ID**: This is the alphanumeric ID in the URL when viewing your NextDNS profile settings (e.g., `https://my.nextdns.io/xxxxxx/setup`)

## Usage

1. Navigate to a website you want to add to your NextDNS allowlist
2. Click the NextDNS Allowlist Manager icon in your browser toolbar
3. Click the "Add to NextDNS Allowlist" button
4. You'll see a success message if the domain was added successfully

## Permissions Explained

This extension requires:
- `storage`: To store your API key and profile ID
- `activeTab`: To access the URL of your current tab
- Access to `https://api.nextdns.io/`: To communicate with the NextDNS API

## Troubleshooting

### "API Error" message
- Verify your API key and profile ID are correct
- Check that you have proper permissions in your NextDNS account
- Make sure your NextDNS subscription is active

### Extension not showing the current domain
- Refresh the page you're on
- Make sure you're on a standard HTTP/HTTPS website
- Check that the extension has the correct permissions

## Privacy

This extension:
- Only collects information needed to function (current domain, API credentials)
- Does not track your browsing history
- Does not share any data with third parties
- All data remains stored locally in your browser

---

*This extension is not affiliated with or endorsed by NextDNS.*
