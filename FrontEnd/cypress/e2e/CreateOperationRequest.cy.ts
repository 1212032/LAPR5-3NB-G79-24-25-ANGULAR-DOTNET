describe('Create Operation Request', () => {
  beforeEach(() => {
    

  });
  it('should log in ', () => {
    cy.visit('/login');

    cy.get('button[type="submit"]').click();
    cy.origin('https://login.microsoftonline.com', () => {
      cy.get('input[type="email"]').type('sem5pi_g79_doctor@hotmail.com', {
        log: false,
      });
      cy.get('input[type="submit"]').click();

    });

    cy.origin('https://login.live.com', () => {
      cy.get('input[type="password"]').type('Panados123!', {
        log: false,
      });
      cy.get('input[type="submit"]').click();
    });



  });
  it('should create a new operation request', () => {

    cy.visit('/doctor/operationrequest/create')

    cy.get('#deadlineDate').type('2023-12-31');
    cy.get('#priority').type('High');
    cy.get('#operationType').type('Surgery');
    cy.get('#patientMedicalRecordNumber').type('12345');
    cy.get('button[type="submit"]').click();
    cy.get('.toast-success').should('contain', 'Operation request created successfully');
  });

  it('should display validation errors', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('contain', 'Deadline Date is required');
    cy.get('.error-message').should('contain', 'Priority is required');
    cy.get('.error-message').should('contain', 'Operation Type is required');
    cy.get('.error-message').should('contain', 'Patient Medical Record Number is required');
  });
});
