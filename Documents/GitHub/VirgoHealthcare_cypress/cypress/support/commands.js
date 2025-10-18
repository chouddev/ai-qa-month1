// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for VirgoHealthcare application

/**
 * Login command for different user types
 * @param {string} userType - Type of user (admin, doctor, patient, test)
 */
Cypress.Commands.add('login', (userType = 'test') => {
  const userCredentials = {
    admin: {
      email: Cypress.env('adminEmail') || 'admin@virgohealthcare.com',
      password: Cypress.env('adminPassword') || 'AdminPassword123!'
    },
    doctor: {
      email: Cypress.env('doctorEmail') || 'doctor@virgohealthcare.com',
      password: Cypress.env('doctorPassword') || 'DoctorPassword123!'
    },
    patient: {
      email: Cypress.env('patientEmail') || 'patient@virgohealthcare.com',
      password: Cypress.env('patientPassword') || 'PatientPassword123!'
    },
    test: {
      email: Cypress.env('testUserEmail') || 'test@virgohealthcare.com',
      password: Cypress.env('testUserPassword') || 'TestPassword123!'
    }
  };

  const credentials = userCredentials[userType];
  
  cy.session([userType, credentials.email], () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(credentials.email);
    cy.get('[data-cy="password-input"]').type(credentials.password);
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('not.include', '/login');
    cy.get('[data-cy="user-menu"]').should('be.visible');
  });
});

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click();
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should('include', '/login');
});

/**
 * Navigate to a specific page
 * @param {string} page - Page to navigate to
 */
Cypress.Commands.add('navigateTo', (page) => {
  const routes = {
    dashboard: '/dashboard',
    patients: '/patients',
    appointments: '/appointments',
    doctors: '/doctors',
    profile: '/profile',
    settings: '/settings',
    reports: '/reports'
  };

  cy.visit(routes[page] || page);
});

/**
 * Wait for page to load completely
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.get('[data-cy="loading-spinner"]').should('not.exist');
});

/**
 * Fill form fields
 * @param {string} formSelector - Form selector
 * @param {object} formData - Form data object
 */
Cypress.Commands.add('fillForm', (formSelector, formData) => {
  Object.keys(formData).forEach(field => {
    cy.get(`${formSelector} [data-cy="${field}"]`)
      .clear()
      .type(formData[field]);
  });
});

/**
 * Select dropdown option
 * @param {string} dropdownSelector - Dropdown selector
 * @param {string} option - Option to select
 */
Cypress.Commands.add('selectDropdownOption', (dropdownSelector, option) => {
  cy.get(dropdownSelector).click();
  cy.get(`[data-cy="${option}"]`).click();
});

/**
 * Upload file
 * @param {string} fileInputSelector - File input selector
 * @param {string} fileName - Name of the file to upload
 */
Cypress.Commands.add('uploadFile', (fileInputSelector, fileName) => {
  cy.fixture(fileName).then(fileContent => {
    cy.get(fileInputSelector).attachFile({
      fileContent: fileContent.toString(),
      fileName: fileName,
      mimeType: 'application/pdf'
    });
  });
});

/**
 * Check API response
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 * @param {object} body - Request body
 * @param {number} expectedStatus - Expected status code
 */
Cypress.Commands.add('apiRequest', (method, url, body = null, expectedStatus = 200) => {
  const options = {
    method,
    url,
    failOnStatusCode: false
  };

  if (body) {
    options.body = body;
  }

  cy.request(options).then(response => {
    expect(response.status).to.eq(expectedStatus);
    return cy.wrap(response);
  });
});

/**
 * Generate test data
 * @param {string} type - Type of data to generate
 */
Cypress.Commands.add('generateTestData', (type) => {
  const timestamp = Date.now();
  
  const testData = {
    patient: {
      firstName: `TestPatient${timestamp}`,
      lastName: `LastName${timestamp}`,
      email: `patient${timestamp}@test.com`,
      phone: `555-${timestamp.toString().slice(-7)}`,
      dateOfBirth: '1990-01-01',
      address: '123 Test Street, Test City, TC 12345'
    },
    doctor: {
      firstName: `TestDoctor${timestamp}`,
      lastName: `LastName${timestamp}`,
      email: `doctor${timestamp}@test.com`,
      phone: `555-${timestamp.toString().slice(-7)}`,
      specialization: 'General Medicine',
      licenseNumber: `LIC${timestamp}`
    },
    appointment: {
      patientId: `patient-${timestamp}`,
      doctorId: `doctor-${timestamp}`,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '10:00',
      reason: 'Regular checkup'
    }
  };

  return cy.wrap(testData[type]);
});

/**
 * Take screenshot with custom name
 * @param {string} name - Screenshot name
 */
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});

/**
 * Wait for element to be visible and clickable
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
Cypress.Commands.add('waitAndClick', (selector, timeout = 10000) => {
  cy.get(selector, { timeout })
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

/**
 * Clear all form inputs in a container
 * @param {string} containerSelector - Container selector
 */
Cypress.Commands.add('clearAllInputs', (containerSelector) => {
  cy.get(containerSelector).within(() => {
    cy.get('input[type="text"], input[type="email"], input[type="password"], input[type="number"], textarea')
      .clear();
  });
});

/**
 * Check if element exists without failing the test
 * @param {string} selector - Element selector
 */
Cypress.Commands.add('elementExists', (selector) => {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0;
  });
});

// Custom viewport sizes for responsive testing
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport('iphone-x');
});

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport('ipad-2');
});

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});