/// <reference types="cypress" />

describe('Авторизация', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('#log-form__login').type('developer');
    cy.get('#log-form__password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Ваши счета').should('be.visible');
  });
  it('Перевод платежа с нового счета', () => {
    cy.contains('Создать новый счёт').click();
    cy.get('.accounts__card-wrap').last().contains('Открыть').click();
    cy.get('#autoComplete').type('61253747452820828268825011');
    cy.get('#account-mid__form-amount').type('1');
    cy.contains('Отправить').click();
    cy.contains(
      'мы попытались перевести больше денег, чем доступно на счёте списания'
    ).should('be.visible');
  });
});
