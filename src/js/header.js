import '../css/header.scss';
import { el, setChildren } from 'redom';

export default function renderHeader(router) {
  const header = el('.header');
  const container = el('.container');
  setChildren(header, container);

  const wrap = el('.header-wrap');
  setChildren(container, wrap);

  const logo = el('.header-logo', 'Coin.');
  const nav = el('nav.header-nav');
  setChildren(wrap, [logo, nav]);

  const btnAtms = el('a.header-nav__btn', 'Банкоматы');
  const btnAccounts = el('a.header-nav__btn', 'Счета');
  const btnCurrency = el('a.header-nav__btn', 'Валюта');
  const btnExit = el('a.header-nav__btn', 'Выйти');

  setChildren(nav, [btnAtms, btnAccounts, btnCurrency, btnExit]);

  btnAtms.addEventListener('click', function () {
    router.navigate(`/atms`);
  });

  btnAccounts.addEventListener('click', function () {
    router.navigate(`/accounts`);
  });

  btnCurrency.addEventListener('click', function () {
    router.navigate(`/exchange`);
  });

  btnExit.addEventListener('click', function () {
    localStorage.clear();
    router.navigate(`/login`);
  });

  return { header, nav, btnAtms, btnAccounts, btnCurrency, btnExit };
}
