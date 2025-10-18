# VirgoHealthcare Cypress Test Framework

A comprehensive Cypress automation framework for testing the VirgoHealthcare application. This framework provides end-to-end testing capabilities for web applications, API testing, and automated regression testing.

## 🚀 Features

- **End-to-End Testing**: Complete user journey testing
- **API Testing**: Comprehensive API endpoint testing
- **Cross-Browser Testing**: Chrome, Firefox, and Edge support
- **Mobile Testing**: Responsive design testing
- **CI/CD Integration**: GitHub Actions workflow
- **Test Reporting**: Mochawesome reports with screenshots and videos
- **Data-Driven Testing**: Fixture-based test data management
- **Custom Commands**: Reusable test commands
- **Environment Configuration**: Multiple environment support

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VirgoHealthcare_cypress
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Cypress**
   ```bash
   npx cypress install
   ```

4. **Verify installation**
   ```bash
   npm run cy:verify
   ```

## ⚙️ Configuration

### Environment Variables

Create a `cypress.env.json` file in the root directory:

```json
{
  "CYPRESS_BASE_URL": "https://virgohealthcare.com",
  "CYPRESS_API_URL": "https://api.virgohealthcare.com",
  "CYPRESS_ADMIN_EMAIL": "admin@virgohealthcare.com",
  "CYPRESS_ADMIN_PASSWORD": "AdminPassword123!",
  "CYPRESS_TEST_USER_EMAIL": "test@virgohealthcare.com",
  "CYPRESS_TEST_USER_PASSWORD": "TestPassword123!"
}
```

### Test Data

Test data is managed through fixtures in `cypress/fixtures/`:
- `users.json`: User credentials and profiles
- `testData.json`: Sample test data for patients, doctors, appointments

## 🧪 Running Tests

### Open Cypress Test Runner
```bash
npm run cy:open
```

### Run Tests in Headless Mode
```bash
# Run all tests
npm run cy:run

# Run specific browser
npm run cy:run:chrome
npm run cy:run:firefox
npm run cy:run:edge

# Run with headed mode (visible browser)
npm run cy:run:headed
```

### Run Specific Test Suites
```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression

# E2E tests
npm run test:e2e

# Run specific test file
npm run cy:run:spec cypress/e2e/authentication/login.cy.js
```

### Test Filtering with Tags
```bash
# Run tests with specific tags
npx cypress run --env grepTags="@smoke"
npx cypress run --env grepTags="@regression"
```

## 📁 Project Structure

```
VirgoHealthcare_cypress/
├── cypress/
│   ├── e2e/                          # Test files
│   │   ├── authentication/           # Login/logout tests
│   │   ├── patient-management/       # Patient CRUD tests
│   │   ├── appointments/             # Appointment scheduling tests
│   │   └── api/                      # API tests
│   ├── fixtures/                     # Test data files
│   │   ├── users.json               # User credentials
│   │   └── testData.json            # Sample test data
│   ├── support/                      # Support files
│   │   ├── commands.js              # Custom commands
│   │   └── e2e.js                   # Global configuration
│   ├── downloads/                    # Downloaded files
│   ├── screenshots/                  # Test screenshots
│   └── videos/                       # Test videos
├── .github/workflows/                # CI/CD workflows
├── cypress.config.js                 # Cypress configuration
├── cypress.env.json                  # Environment variables
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## 🔧 Custom Commands

The framework includes custom commands for common operations:

### Authentication
```javascript
cy.login('admin');    // Login as admin
cy.login('doctor');   // Login as doctor
cy.login('patient');  // Login as patient
cy.login('test');     // Login as test user
cy.logout();          // Logout
```

### Navigation
```javascript
cy.navigateTo('dashboard');
cy.navigateTo('patients');
cy.navigateTo('appointments');
```

### Form Operations
```javascript
cy.fillForm('[data-cy="form"]', {
  'field-name': 'value',
  'another-field': 'another-value'
});

cy.selectDropdownOption('[data-cy="dropdown"]', 'option-value');
cy.clearAllInputs('[data-cy="container"]');
```

### API Testing
```javascript
cy.apiRequest('GET', '/api/patients', null, 200);
cy.apiRequest('POST', '/api/patients', data, 201);
```

### Viewport Management
```javascript
cy.setMobileViewport();
cy.setTabletViewport();
cy.setDesktopViewport();
```

## 🏷️ Test Tags

Tests are organized using tags for easy filtering:

- `@smoke`: Critical functionality tests
- `@regression`: Full regression test suite
- `@e2e`: End-to-end user journey tests
- `@api`: API-only tests
- `@ui`: User interface tests

## 📊 Test Reports

Test reports are generated automatically and include:

- **Mochawesome Reports**: HTML reports with detailed test results
- **Screenshots**: Captured on test failures
- **Videos**: Recorded test execution
- **Console Logs**: Browser console output

Reports are saved in:
- `cypress/reports/` - HTML reports
- `cypress/screenshots/` - Failure screenshots
- `cypress/videos/` - Test execution videos

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes GitHub Actions workflows for:

- **Pull Request Testing**: Runs smoke tests on PRs
- **Main Branch Testing**: Full regression suite on main branch
- **Scheduled Testing**: Daily automated testing
- **Cross-Browser Testing**: Chrome, Firefox, and Edge

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Daily scheduled runs at 2 AM UTC
- Manual workflow dispatch

## 🐛 Debugging

### Debug Mode
```bash
DEBUG=cypress:* npm run cy:open
```

### Debug Specific Tests
Add `cy.debug()` or `cy.pause()` in your tests:
```javascript
it('should debug this test', () => {
  cy.visit('/login');
  cy.debug(); // Pauses execution here
  cy.get('[data-cy="email"]').type('test@email.com');
});
```

### View Network Requests
```javascript
cy.intercept('GET', '/api/patients').as('getPatients');
cy.visit('/patients');
cy.wait('@getPatients');
```

## 📝 Writing Tests

### Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.login('admin');
    cy.navigateTo('feature-page');
  });

  it('should perform specific action', () => {
    // Test implementation
  });
});
```

### Best Practices

1. **Use data-cy attributes** for element selection
2. **Implement page object pattern** for complex pages
3. **Use fixtures** for test data
4. **Add proper assertions** for all test steps
5. **Handle async operations** with proper waits
6. **Clean up test data** after tests

### Example Test
```javascript
describe('Patient Management', () => {
  it('should create a new patient', () => {
    cy.login('admin');
    cy.navigateTo('patients');
    
    cy.get('[data-cy="add-patient-button"]').click();
    
    cy.generateTestData('patient').then((patientData) => {
      cy.fillForm('[data-cy="patient-form"]', {
        'first-name': patientData.firstName,
        'last-name': patientData.lastName,
        'email': patientData.email
      });
      
      cy.get('[data-cy="save-button"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Element not found**
   - Check if element has `data-cy` attribute
   - Verify element is visible and not hidden
   - Add appropriate waits for dynamic content

2. **Test timeouts**
   - Increase timeout in `cypress.config.js`
   - Add explicit waits for network requests
   - Check for infinite loading states

3. **Authentication issues**
   - Verify credentials in `cypress.env.json`
   - Check if session is properly maintained
   - Clear cookies/localStorage if needed

### Getting Help

- Check Cypress documentation: https://docs.cypress.io/
- Review test logs and screenshots
- Use browser developer tools for debugging
- Contact the QA team for framework-specific issues

## 📈 Performance Optimization

### Parallel Execution
Tests can be run in parallel using:
```bash
npx cypress run --parallel --record --key <record-key>
```

### Test Optimization Tips

1. **Use `cy.session()`** for login state management
2. **Implement test data cleanup** to avoid conflicts
3. **Use `cy.intercept()`** to mock slow API calls
4. **Optimize selectors** for better performance
5. **Split large test suites** into smaller files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests following the established patterns
4. Run the test suite locally
5. Submit a pull request with test results

### Code Standards

- Follow ESLint configuration
- Use meaningful test descriptions
- Add comments for complex test logic
- Maintain consistent naming conventions
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **QA Lead**: Framework architecture and maintenance
- **QA Engineers**: Test development and execution
- **DevOps**: CI/CD pipeline management
- **Developers**: Application testing support

---

For questions or support, please contact the QA team or create an issue in the repository.

