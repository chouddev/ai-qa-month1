describe('Smoke Tests', { tags: '@smoke' }, () => {
  describe('Website Accessibility', () => {
    it('should open VirgoHealthcare website', () => {
      cy.visit('https://www.virgohealthcare.in');
      cy.get('body').should('be.visible');
      cy.title().should('not.be.empty');
      cy.url().should('include', 'virgohealthcare.in');
    });
  });
});

