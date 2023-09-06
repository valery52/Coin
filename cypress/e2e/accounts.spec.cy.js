/// <reference types="cypress" />

describe('Просмотр счетов', () => {
  it('На странице есть хотябы один счет', () => {
    cy.visit('http://localhost:8080');
    cy.get('#log-form__login').type('developer');
    cy.get('#log-form__password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Ваши счета').should('be.visible');
    cy.get('div.accounts__card-wrap').should('be.visible');
    cy.contains('74213041477477406320783754').should('be.visible');
  });
});
