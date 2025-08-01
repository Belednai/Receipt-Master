// Email validation service with MX record checking
// Professional implementation with proper error handling and security

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  details?: {
    format: boolean;
    mx: boolean;
    domain: string;
  };
}

export class EmailValidationService {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  /**
   * Validate email format using RFC 5322 compliant regex
   */
  private static validateFormat(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false; // RFC 5321 limit
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    if (localPart.length > 64) return false; // RFC 5321 limit
    if (domain.length > 253) return false; // RFC 1035 limit
    
    return this.EMAIL_REGEX.test(email);
  }

  /**
   * Sanitize email input to prevent injection attacks
   */
  private static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim().replace(/[<>]/g, '');
  }

  /**
   * Check if domain has valid MX records
   */
  private static async checkMXRecords(domain: string): Promise<boolean> {
    try {
      // In development mode, simulate MX check for common domains
      if (process.env.NODE_ENV === 'development') {
        const commonDomains = [
          'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
          'icloud.com', 'protonmail.com', 'aol.com', 'live.com',
          'company.com', 'business.com', 'enterprise.com'
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Accept common domains and reject obviously fake ones
        if (commonDomains.includes(domain)) return true;
        if (domain.includes('fake') || domain.includes('test') || domain.includes('invalid')) return false;
        if (domain.split('.').length < 2) return false;
        
        // For other domains in dev, assume valid
        return true;
      }

      // Production MX check - would need backend service
      const response = await fetch('/api/validate-email-mx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ domain })
      });

      if (!response.ok) {
        throw new Error(`MX validation service unavailable: ${response.status}`);
      }

      const result = await response.json();
      return result.valid === true;
    } catch (error) {
      console.error('MX record check failed:', error);
      // In case of service failure, fall back to format validation only
      return true; // Don't block legitimate users if service is down
    }
  }

  /**
   * Comprehensive email validation with MX record checking
   */
  static async validateEmail(email: string): Promise<EmailValidationResult> {
    try {
      // Sanitize input
      const sanitizedEmail = this.sanitizeEmail(email);
      
      // Check format first
      const formatValid = this.validateFormat(sanitizedEmail);
      if (!formatValid) {
        return {
          valid: false,
          error: 'Please enter a valid email address format.',
          details: {
            format: false,
            mx: false,
            domain: sanitizedEmail.split('@')[1] || ''
          }
        };
      }

      const domain = sanitizedEmail.split('@')[1];
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /\.test$/i,
        /\.invalid$/i,
        /\.local$/i,
        /^(localhost|127\.0\.0\.1)/i,
        /example\.(com|org|net)$/i,
        /temp(mail|email)/i,
        /10minutemail/i,
        /guerrillamail/i
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(domain))) {
        return {
          valid: false,
          error: 'Please use a valid business or personal email address.',
          details: {
            format: true,
            mx: false,
            domain
          }
        };
      }

      // Check MX records
      const mxValid = await this.checkMXRecords(domain);
      if (!mxValid) {
        return {
          valid: false,
          error: 'The email domain does not appear to accept emails. Please check the email address.',
          details: {
            format: true,
            mx: false,
            domain
          }
        };
      }

      return {
        valid: true,
        details: {
          format: true,
          mx: true,
          domain
        }
      };
    } catch (error) {
      console.error('Email validation error:', error);
      return {
        valid: false,
        error: 'Unable to validate email address. Please try again.',
        details: {
          format: false,
          mx: false,
          domain: ''
        }
      };
    }
  }

  /**
   * Validate multiple emails in batch
   */
  static async validateEmails(emails: string[]): Promise<EmailValidationResult[]> {
    const validationPromises = emails.map(email => this.validateEmail(email));
    return Promise.all(validationPromises);
  }

  /**
   * Quick format-only validation for real-time feedback
   */
  static validateFormatOnly(email: string): boolean {
    const sanitized = this.sanitizeEmail(email);
    return this.validateFormat(sanitized);
  }
}