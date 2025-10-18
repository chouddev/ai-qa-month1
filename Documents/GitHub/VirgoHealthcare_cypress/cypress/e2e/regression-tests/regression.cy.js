describe('Regression Test Suite', { tags: '@regression' }, () => {
  beforeEach(() => {
    cy.login('admin');
  });

  describe('Complete User Journeys', () => {
    it('should complete patient registration to appointment booking flow', () => {
      // Step 1: Create a new patient
      cy.navigateTo('patients');
      cy.get('[data-cy="add-patient-button"]').click();
      
      cy.generateTestData('patient').then((patientData) => {
        cy.fillForm('[data-cy="patient-form"]', {
          'first-name': patientData.firstName,
          'last-name': patientData.lastName,
          'email': patientData.email,
          'phone': patientData.phone,
          'date-of-birth': patientData.dateOfBirth,
          'address': patientData.address
        });
        
        cy.get('[data-cy="save-patient-button"]').click();
        cy.get('[data-cy="success-message"]').should('contain', 'Patient created successfully');
        
        // Step 2: Book an appointment for the patient
        cy.navigateTo('appointments');
        cy.get('[data-cy="schedule-appointment-button"]').click();
        
        cy.generateTestData('appointment').then((appointmentData) => {
          cy.selectDropdownOption('[data-cy="patient-select"]', patientData.firstName + ' ' + patientData.lastName);
          cy.selectDropdownOption('[data-cy="doctor-select"]', 'Dr. Sarah Wilson');
          
          cy.get('[data-cy="appointment-date"]').type(appointmentData.date);
          cy.get('[data-cy="appointment-time"]').type(appointmentData.time);
          cy.get('[data-cy="appointment-reason"]').type(appointmentData.reason);
          
          cy.get('[data-cy="save-appointment-button"]').click();
          cy.get('[data-cy="success-message"]').should('contain', 'Appointment scheduled successfully');
        });
      });
    });

    it('should complete doctor onboarding process', () => {
      // Step 1: Create doctor profile
      cy.navigateTo('doctors');
      cy.get('[data-cy="add-doctor-button"]').click();
      
      cy.generateTestData('doctor').then((doctorData) => {
        cy.fillForm('[data-cy="doctor-form"]', {
          'first-name': doctorData.firstName,
          'last-name': doctorData.lastName,
          'email': doctorData.email,
          'phone': doctorData.phone,
          'specialization': doctorData.specialization,
          'license-number': doctorData.licenseNumber
        });
        
        cy.get('[data-cy="save-doctor-button"]').click();
        cy.get('[data-cy="success-message"]').should('contain', 'Doctor created successfully');
        
        // Step 2: Assign to department
        cy.get('[data-cy="assign-department-button"]').click();
        cy.selectDropdownOption('[data-cy="department-select"]', 'Cardiology');
        cy.get('[data-cy="save-assignment-button"]').click();
        
        cy.get('[data-cy="success-message"]').should('contain', 'Department assignment successful');
      });
    });

    it('should complete appointment lifecycle management', () => {
      // Step 1: View existing appointment
      cy.navigateTo('appointments');
      cy.get('[data-cy="appointment-event"]').first().click();
      
      // Step 2: Update appointment notes
      cy.get('[data-cy="add-notes-button"]').click();
      cy.get('[data-cy="notes-textarea"]').type('Patient consultation completed');
      cy.get('[data-cy="save-notes-button"]').click();
      
      cy.get('[data-cy="success-message"]').should('contain', 'Notes added successfully');
      
      // Step 3: Mark appointment as completed
      cy.get('[data-cy="complete-appointment-button"]').click();
      cy.get('[data-cy="completion-notes"]').type('Treatment completed successfully');
      cy.get('[data-cy="confirm-complete-button"]').click();
      
      cy.get('[data-cy="success-message"]').should('contain', 'Appointment marked as completed');
    });
  });

  describe('Data Management', () => {
    it('should perform bulk operations on patients', () => {
      cy.navigateTo('patients');
      
      // Select multiple patients
      cy.get('[data-cy="patient-checkbox"]').first().check();
      cy.get('[data-cy="patient-checkbox"]').eq(1).check();
      
      // Perform bulk status update
      cy.get('[data-cy="bulk-actions"]').should('be.visible');
      cy.get('[data-cy="bulk-status-update"]').select('Active');
      cy.get('[data-cy="bulk-update-button"]').click();
      
      cy.get('[data-cy="success-message"]').should('contain', 'patients updated successfully');
    });

    it('should handle data export functionality', () => {
      cy.navigateTo('patients');
      
      // Export patients data
      cy.get('[data-cy="export-button"]').click();
      cy.get('[data-cy="export-format"]').select('CSV');
      cy.get('[data-cy="confirm-export-button"]').click();
      
      // Verify download
      cy.readFile('cypress/downloads/patients.csv').should('exist');
    });

    it('should handle data import functionality', () => {
      cy.navigateTo('patients');
      
      // Import patients data
      cy.get('[data-cy="import-button"]').click();
      cy.uploadFile('[data-cy="file-input"]', 'sample-patients.csv');
      cy.get('[data-cy="confirm-import-button"]').click();
      
      cy.get('[data-cy="success-message"]').should('contain', 'Import completed successfully');
    });
  });

  describe('User Role Permissions', () => {
    it('should respect admin permissions', () => {
      cy.login('admin');
      
      // Admin should have access to all sections
      cy.navigateTo('patients');
      cy.get('[data-cy="add-patient-button"]').should('be.visible');
      
      cy.navigateTo('doctors');
      cy.get('[data-cy="add-doctor-button"]').should('be.visible');
      
      cy.navigateTo('settings');
      cy.get('[data-cy="admin-settings"]').should('be.visible');
    });

    it('should respect doctor permissions', () => {
      cy.login('doctor');
      
      // Doctor should have limited access
      cy.navigateTo('patients');
      cy.get('[data-cy="view-patients"]').should('be.visible');
      cy.get('[data-cy="add-patient-button"]').should('not.exist');
      
      cy.navigateTo('appointments');
      cy.get('[data-cy="schedule-appointment-button"]').should('be.visible');
    });

    it('should respect patient permissions', () => {
      cy.login('patient');
      
      // Patient should have very limited access
      cy.navigateTo('profile');
      cy.get('[data-cy="edit-profile-button"]').should('be.visible');
      
      cy.visit('/patients');
      cy.url().should('not.include', '/patients');
      cy.get('[data-cy="access-denied"]').should('be.visible');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '/api/patients', { forceNetworkError: true }).as('networkError');
      
      cy.navigateTo('patients');
      cy.wait('@networkError');
      
      cy.get('[data-cy="error-message"]').should('contain', 'Network error');
      cy.get('[data-cy="retry-button"]').should('be.visible');
    });

    it('should handle invalid data gracefully', () => {
      cy.navigateTo('patients');
      cy.get('[data-cy="add-patient-button"]').click();
      
      // Submit form with invalid data
      cy.get('[data-cy="email"]').type('invalid-email');
      cy.get('[data-cy="phone"]').type('invalid-phone');
      cy.get('[data-cy="save-patient-button"]').click();
      
      cy.get('[data-cy="email-error"]').should('contain', 'Please enter a valid email');
      cy.get('[data-cy="phone-error"]').should('contain', 'Please enter a valid phone number');
    });

    it('should handle concurrent user actions', () => {
      // Simulate multiple rapid clicks
      cy.navigateTo('patients');
      cy.get('[data-cy="add-patient-button"]').click();
      
      // Rapid form submission
      cy.get('[data-cy="first-name"]').type('Test');
      cy.get('[data-cy="last-name"]').type('Patient');
      cy.get('[data-cy="email"]').type('test@email.com');
      cy.get('[data-cy="phone"]').type('555-123-4567');
      
      // Multiple rapid clicks on save
      cy.get('[data-cy="save-patient-button"]').click();
      cy.get('[data-cy="save-patient-button"]').click();
      cy.get('[data-cy="save-patient-button"]').click();
      
      // Should handle gracefully without creating duplicates
      cy.get('[data-cy="success-message"]').should('be.visible');
    });
  });

  describe('Performance Tests', () => {
    it('should load pages within acceptable time', () => {
      const startTime = Date.now();
      
      cy.navigateTo('patients');
      cy.waitForPageLoad();
      
      cy.then(() => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('should handle large datasets efficiently', () => {
      cy.navigateTo('patients');
      
      // Simulate large dataset
      cy.intercept('GET', '/api/patients', { fixture: 'largePatientDataset.json' }).as('largeDataset');
      cy.reload();
      cy.wait('@largeDataset');
      
      cy.get('[data-cy="patients-table"]').should('be.visible');
      cy.get('[data-cy="loading-spinner"]').should('not.exist');
    });
  });
});

