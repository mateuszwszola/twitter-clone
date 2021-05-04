/// <reference types="cypress" />

describe('/Signin', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('contains h1 with Sign In', () => {
    cy.contains('h1', 'Sign In');
  });

  it('contains log in submit button', () => {
    cy.contains('Log In').should('have.attr', 'type', 'submit');
  });

  it('contains link which redirects to /signup', () => {
    cy.contains('Sign up now').should('have.attr', 'href', '/signup');
  });

  it('inputs contains proper placeholders', () => {
    cy.get('[data-cy=signin-username-input]').should(
      'have.attr',
      'placeholder',
      'Email or username'
    );

    cy.get('[data-cy=signin-password-input]').should(
      'have.attr',
      'placeholder',
      'Password'
    );
  });

  it('checks controlled inputs values after typing', () => {
    cy.get('[data-cy=signin-username-input]')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com');
    cy.get('[data-cy=signin-password-input]')
      .type('password')
      .should('have.value', 'password');
  });

  context('Form submission', () => {
    it('requires username and password', () => {
      cy.get('[data-cy=signin-form]').submit();
      cy.contains('username is required');
      cy.contains('password is required');
    });

    it('requires password', () => {
      cy.get('[data-cy=signin-username-input]').type('fake@email.com');
      cy.get('[data-cy=signin-form]').submit();
      cy.contains('password is required');
    });

    it('requires valid username and password', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 400,
        body: {
          message: 'Incorrect username and password combination',
        },
      }).as('login');

      cy.get('[data-cy=signin-username-input]').type('fake@email.com');
      cy.get('[data-cy=signin-password-input]').type('password');
      cy.get('[data-cy=signin-form]').submit();
      cy.wait('@login').its('response.statusCode').should('equal', 400);
      cy.contains('Incorrect username and password combination');
    });
  });
});
