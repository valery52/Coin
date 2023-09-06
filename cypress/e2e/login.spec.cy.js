/// <reference types="cypress" />

describe('Авторизация', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });
  it('Логин длинной менее 6 символов', () => {
    cy.get('#log-form__login').type('devel');
    cy.get('#log-form__password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains(
      'Логин и пароль должны содержать не менее шести символов и не содержать пробелов'
    ).should('be.visible');
  });
  it('Пароль длинной менее 6 символов', () => {
    cy.get('#log-form__login').type('developer');
    cy.get('#log-form__password').type('skil');
    cy.contains('Войти').click();
    cy.contains(
      'Логин и пароль должны содержать не менее шести символов и не содержать пробелов'
    ).should('be.visible');
  });
  it('Неверный логин', () => {
    cy.get('#log-form__login').type('developers');
    cy.get('#log-form__password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Пользователя с таким логином не существует').should(
      'be.visible'
    );
  });
  it('Неверный пароль', () => {
    cy.get('#log-form__login').type('developer');
    cy.get('#log-form__password').type('skillboks');
    cy.contains('Войти').click();
    cy.contains('Неверный пароль').should('be.visible');
  });
  it('Успешная авторизация', () => {
    cy.get('#log-form__login').type('developer');
    cy.get('#log-form__password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Ваши счета').should('be.visible');
  });
});
