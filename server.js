const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = 8086;

// Apply Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
      },
    },
  })
);

// Apply additional security headers individually
app.use(helmet.noSniff()); // Prevent MIME-type sniffing
app.use(helmet.frameguard({ action: 'sameorigin' })); // Prevent clickjacking

// Serve frontend files statically
app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(PORT, () => {
  console.log(`🚀 Secure server running at http://localhost:${PORT}`);
});