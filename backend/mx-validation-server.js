const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 4000;

// Promisify DNS functions for async/await usage
const resolveMx = promisify(dns.resolveMx);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Input validation middleware
const validateEmailDomain = (req, res, next) => {
  const { domain } = req.body;
  
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({
      valid: false,
      error: 'Domain is required and must be a string'
    });
  }
  
  // Basic domain format validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({
      valid: false,
      error: 'Invalid domain format'
    });
  }
  
  // Check domain length (RFC 1035)
  if (domain.length > 253) {
    return res.status(400).json({
      valid: false,
      error: 'Domain name too long'
    });
  }
  
  next();
};

// Rate limiting (simple in-memory store)
const requestCounts = new Map();
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

const rateLimit = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;
  
  // Clean old entries
  for (const [ip, requests] of requestCounts.entries()) {
    const filteredRequests = requests.filter(timestamp => timestamp > windowStart);
    if (filteredRequests.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, filteredRequests);
    }
  }
  
  // Check current client
  const clientRequests = requestCounts.get(clientIp) || [];
  const recentRequests = clientRequests.filter(timestamp => timestamp > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return res.status(429).json({
      valid: false,
      error: 'Rate limit exceeded. Please try again later.'
    });
  }
  
  // Add current request
  recentRequests.push(now);
  requestCounts.set(clientIp, recentRequests);
  
  next();
};

// MX record validation endpoint
app.post('/api/validate-email-mx', rateLimit, validateEmailDomain, async (req, res) => {
  const { domain } = req.body;
  
  try {
    console.log(`Validating MX records for domain: ${domain}`);
    
    // Check for suspicious or invalid domains
    const suspiciousDomains = [
      'test.com', 'example.com', 'example.org', 'example.net', 'localhost',
      'invalid.com', 'fake.com', 'temp.com', 'throw-away.email'
    ];
    
    if (suspiciousDomains.includes(domain.toLowerCase())) {
      return res.status(400).json({
        valid: false,
        error: 'Please use a valid business or personal email domain'
      });
    }
    
    // Resolve MX records
    const mxRecords = await resolveMx(domain);
    
    if (!mxRecords || mxRecords.length === 0) {
      return res.status(400).json({
        valid: false,
        error: 'No mail servers found for this domain. Please check the email address.'
      });
    }
    
    // Sort MX records by priority (lower number = higher priority)
    mxRecords.sort((a, b) => a.priority - b.priority);
    
    console.log(`Found ${mxRecords.length} MX record(s) for ${domain}:`, mxRecords);
    
    res.json({
      valid: true,
      mxRecords: mxRecords.map(record => ({
        exchange: record.exchange,
        priority: record.priority
      }))
    });
    
  } catch (error) {
    console.error(`MX validation error for ${domain}:`, error.message);
    
    // Handle different types of DNS errors
    if (error.code === 'ENOTFOUND') {
      return res.status(400).json({
        valid: false,
        error: 'Domain not found. Please check the email address.'
      });
    } else if (error.code === 'ENODATA') {
      return res.status(400).json({
        valid: false,
        error: 'No mail servers configured for this domain.'
      });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(408).json({
        valid: false,
        error: 'DNS lookup timed out. Please try again.'
      });
    } else {
      return res.status(500).json({
        valid: false,
        error: 'Unable to validate email domain. Please try again.'
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    valid: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MX Validation Server running on port ${PORT}`);
  console.log(`📧 Email validation endpoint: http://localhost:${PORT}/api/validate-email-mx`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MX validation server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MX validation server...');
  process.exit(0);
});