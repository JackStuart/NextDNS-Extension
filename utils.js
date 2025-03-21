// Domain validation utility functions

/**
 * Validates a domain string against RFC 1035 compliant pattern
 * @param {string} domain - The domain to validate
 * @returns {boolean} - Whether the domain is valid
 */
export function isValidDomain(domain) {
    if (!domain || typeof domain !== 'string') {
      return false;
    }
    
    // Remove leading www. if present
    const cleanDomain = domain.startsWith('www.') ? domain.substring(4) : domain;
    
    // RFC 1035 compliant domain validation
    // - Labels must start and end with alphanumeric characters
    // - Labels can contain hyphens but not at the start or end
    // - Labels are max 63 characters
    // - Domain must have at least one dot (at least two labels)
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(cleanDomain);
  }
  
  /**
   * Sanitizes a domain by removing www. prefix and validating format
   * @param {string} domain - The domain to sanitize
   * @returns {string|null} - The sanitized domain or null if invalid
   */
  export function sanitizeDomain(domain) {
    if (!domain || typeof domain !== 'string') {
      return null;
    }
    
    // Remove leading www. if present
    const cleanDomain = domain.startsWith('www.') ? domain.substring(4) : domain;
    
    // Validate the domain
    if (!isValidDomain(cleanDomain)) {
      return null;
    }
    
    return cleanDomain;
  }