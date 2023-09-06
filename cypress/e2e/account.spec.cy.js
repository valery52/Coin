/// <reference types="cypress" />

describe('Авторизация', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('#log-form__login').type('developer');
    cy.get('#log-form__password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Ваши счета').should('be.visible');
    cy.contains('74213041477477406320783754')
      .parent()
      .parent()
      .contains('Открыть')
      .click();
  });
  it('Не указан счёт зачисления, или этого счёта не существует', () => {
    cy.get('#autoComplete').type('11111');
    cy.get('#account-mid__form-amount').type('10');
    cy.contains('Отправить').click();
    cy.contains(
      'Не указан счёт зачисления, или этого счёта не существует'
    ).should('be.visible');
  });
  it('Не указана сумма перевода, или она отрицательная', () => {
    cy.get('#autoComplete').type('61253747452820828268825011');
    cy.get('#account-mid__form-amount').type('-10');
    cy.contains('Отправить').click();
    cy.contains('Не указан номер счета зачисления или сумма перевода').should(
      'be.visible'
    );
  });
  it('мы попытались перевести больше денег, чем доступно на счёте списания', () => {
    cy.get('#autoComplete').type('61253747452820828268825011');
    cy.get('#account-mid__form-amount').type('999999999999999999999999999999');
    cy.contains('Отправить').click();
    cy.contains(
      'мы попытались перевести больше денег, чем доступно на счёте списания'
    ).should('be.visible');
  });
  it('Успешный перевод платежа', () => {
    cy.get('#autoComplete').type('61253747452820828268825011');
    cy.get('#account-mid__form-amount').type('10');
    cy.contains('Отправить').click();
    cy.get('div.account-mid__form-error-msg').should('be.empty');
  });
});
