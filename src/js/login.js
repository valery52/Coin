import '../css/login.scss';
import { el, setChildren, setAttr } from 'redom';
import renderHeader from './header.js';
import { isLoggedIn } from './api';

export default function renderLogin(router) {
  const main = el('main');
  const header = renderHeader(router);
  const container = el('.container');

  setChildren(document.body, main);
  setChildren(main, [header.header, container]);

  const loginForm = el('form.log-form');
  const title = el('h2.log-form__title', 'Вход в аккаунт');
  const labelLogin = el('label.log-form__label');
  const labelLoginTxt = el('p.log-form__label-descr', 'Логин');
  const labelPassword = el('label.log-form__label');
  const labelPasswordTxt = el('p.log-form__label-descr', 'Пароль');
  const inputLogin = el('input.log-form__input');
  const inputPassword = el('input.log-form__input');
  const btn = el('button.log-form__btn', 'Войти');
  let errorTxt;
  const errorMsg = el('.log-form__error-msg.error-msg');

  setAttr(header.nav, { className: 'header-nav visualy-hidden' });
  setAttr(labelLogin, { for: 'log-form__login' });
  setAttr(labelPassword, { for: 'log-form__password' });
  setAttr(inputLogin, {
    id: 'log-form__login',
    type: 'text',
    required: true,
    placeholder: 'Placeholder',
  });
  setAttr(inputPassword, {
    id: 'log-form__password',
    type: 'text',
    required: true,
    placeholder: 'Placeholder',
  });
  setAttr(btn, { type: 'submit' });

  setChildren(labelLogin, [labelLoginTxt, inputLogin]);
  setChildren(labelPassword, [labelPasswordTxt, inputPassword]);
  setChildren(loginForm, [title, labelLogin, labelPassword, btn, errorMsg]);
  setChildren(container, loginForm);

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const log = inputLogin.value;
    const password = inputPassword.value;
    errorMsg.innerHTML = '';
    if (
      log.length >= 6 &&
      password.length >= 6 &&
      log.indexOf(' ') === -1 &&
      password.indexOf(' ') === -1
    ) {
      const login = await isLoggedIn(log, password);
      if (login.success) {
        router.navigate('/accounts');
      } else if (login.error === 'Invalid password') {
        errorTxt = 'Неверный пароль';
      } else {
        errorTxt = 'Пользователя с таким логином не существует';
      }
    } else {
      errorTxt =
        'Логин и пароль должны содержать не менее шести символов и не содержать пробелов';
    }
    errorMsg.textContent = errorTxt;
  });
}
