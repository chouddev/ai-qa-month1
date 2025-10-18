const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for your application
    baseUrl: 'https://www.virgohealthcare.in',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test timeout settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Video and screenshot settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    // Retry settings
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Spec pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.js',
    
    // Fixtures folder
    fixturesFolder: 'cypress/fixtures',
    
    // Screenshots folder
    screenshotsFolder: 'cypress/screenshots',
    
    // Videos folder
    videosFolder: 'cypress/videos',
    
    // Downloads folder
    downloadsFolder: 'cypress/downloads',
    
    // Setup node events
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      
      // Reporter configuration
      on('before:run', (details) => {
        console.log('Starting test run with %d specs', details.specs.length);
      });
      
      on('after:run', (results) => {
        console.log('Test run completed with %d passing tests', results.totalPassed);
      });
      
      return config;
    },
    
    // Environment variables
    env: {
      // API configuration
      apiUrl: 'https://api.virgohealthcare.com',
      
      // Test data
      testUser: {
        email: 'test@virgohealthcare.com',
        password: 'TestPassword123!'
      },
      
      // Feature flags
      enableNewFeatures: false,
      
      // Database configuration (for API testing)
      dbHost: 'localhost',
      dbPort: 5432,
      
      // Email configuration
      emailTestUser: 'test@example.com',
      
      // Mobile testing
      mobileViewport: 'iphone-x'
    },
    
    // Experimental features
    experimentalStudio: true,
    experimentalSessionAndOrigin: true,
    
    // Browser settings
    chromeWebSecurity: false,
    modifyObstructiveCode: false
  },
  
  // Component testing configuration (optional)
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
    indexHtmlFile: 'cypress/support/component-index.html'
  }
});

