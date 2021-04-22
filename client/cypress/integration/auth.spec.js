describe('User Sign up and Sign in', () => {
  beforeEach(() => {
    cy.task('db:seed');

    cy.intercept('POST', '/api/auth/register').as('signup');
  });

  it('should allow a user to sign up, login, and logout', () => {
    const userInfo = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      username: 'johndoe',
      password: 'password123',
    };

    cy.visit('/');

    cy.get('[data-cy=nav-signup-link]').click();

    cy.get('[data-cy=signup-title]')
      .should('be.visible')
      .and('contain', 'Sign Up');

    cy.get('[data-cy=signup-name-input]')
      .type(userInfo.name)
      .should('have.value', userInfo.name);
    cy.get('[data-cy=signup-email-input]')
      .type(userInfo.email)
      .should('have.value', userInfo.email);
    cy.get('[data-cy=signup-username-input]')
      .type(userInfo.username)
      .should('have.value', userInfo.username);
    cy.get('[data-cy=signup-password-input]')
      .type(userInfo.password)
      .should('have.value', userInfo.password);
    cy.get('[data-cy=signup-password2-input]')
      .type(userInfo.password)
      .should('have.value', userInfo.password);
    cy.get('[data-cy=signup-submit]').click();
    cy.wait('@signup');

    cy.location('pathname').should('equal', '/');
  });
});
