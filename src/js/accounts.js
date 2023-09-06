import '../css/accounts.scss';
import { el, setChildren, setAttr } from 'redom';
import renderHeader from './header.js';
import { getAccounts, doAccount } from './api.js';
import loader from './helpers/loader.js';

export default async function renderAccounts(router) {
  const main = el('main');
  const header = renderHeader(router);
  const container = el('.container.accounts-container');

  setChildren(document.body, main);
  setChildren(main, [header.header, container]);

  setAttr(header.btnAccounts, { className: 'header-nav__btn active' });
  setChildren(container, loader());

  let accounts = await getAccounts();
  const topWrap = el('.accounts__top-wrap');
  const topWrapLeft = el('.accounts__top-wrap-left');
  const title = el('h2.accounts__title.title', 'Ваши счета');
  const selectorWrap = el('.accounts-choices-wrap');
  const selector = el('button.accounts-choices', 'Сортировка');
  setAttr(selector, { type: 'button' });
  const choicesList = el('.accounts-choices-list');

  selector.addEventListener('click', function () {
    selector.classList.toggle('is-active');
    choicesList.classList.toggle('is-active');
  });

  const checkboxLabel1 = el('label.accounts__checkbox-label');
  setAttr(checkboxLabel1, { for: 'accounts-checkdox1' });
  const checkbox1 = el('input.accounts__checkbox.visually-hidden', 'По номеру');
  setAttr(checkbox1, {
    type: 'checkbox',
    id: 'accounts-checkdox1',
    name: 'check1',
  });
  const checkboxContent1 = el('span.accounts__checkbox-content');
  const checkboxVisual1 = el('span.accounts__checkbox-visual');
  const checkboxTxt1 = el('span.accounts__checkbox-txt', 'По номеру');
  setChildren(checkboxContent1, [checkboxVisual1, checkboxTxt1]);
  setChildren(checkboxLabel1, [checkbox1, checkboxContent1]);

  const checkboxLabel2 = el('label.accounts__checkbox-label');
  setAttr(checkboxLabel2, { for: 'accounts-checkdox2' });
  const checkbox2 = el(
    'input.accounts__checkbox.visually-hidden',
    'По балансу'
  );
  setAttr(checkbox2, {
    type: 'checkbox',
    id: 'accounts-checkdox2',
    name: 'check2',
  });
  const checkboxContent2 = el('span.accounts__checkbox-content');
  const checkboxVisual2 = el('span.accounts__checkbox-visual');
  const checkboxTxt2 = el('span.accounts__checkbox-txt', 'По балансу');
  setChildren(checkboxContent2, [checkboxVisual2, checkboxTxt2]);
  setChildren(checkboxLabel2, [checkbox2, checkboxContent2]);

  const checkboxLabel3 = el('label.accounts__checkbox-label');
  setAttr(checkboxLabel3, { for: 'accounts-checkdox3' });
  const checkbox3 = el(
    'input.accounts__checkbox.visually-hidden',
    'По последней транзакции'
  );
  setAttr(checkbox3, {
    type: 'checkbox',
    id: 'accounts-checkdox3',
    name: 'check3',
  });
  const checkboxContent3 = el('span.accounts__checkbox-content');
  const checkboxVisual3 = el('span.accounts__checkbox-visual');
  const checkboxTxt3 = el(
    'span.accounts__checkbox-txt',
    'По последней транзакции'
  );
  setChildren(checkboxContent3, [checkboxVisual3, checkboxTxt3]);
  setChildren(checkboxLabel3, [checkbox3, checkboxContent3]);

  setChildren(choicesList, [checkboxLabel1, checkboxLabel2, checkboxLabel3]);
  setChildren(selectorWrap, [selector, choicesList]);
  setChildren(topWrapLeft, [title, selectorWrap]);

  checkbox1.addEventListener('click', function () {
    checkboxVisual1.classList.toggle('visual-check');
    checkboxVisual2.classList.remove('visual-check');
    checkboxVisual3.classList.remove('visual-check');
    const option = 'account';
    if (checkbox1.checked) {
      sortAccounts(option);
    }
  });

  checkbox2.addEventListener('click', function () {
    checkboxVisual1.classList.remove('visual-check');
    checkboxVisual2.classList.toggle('visual-check');
    checkboxVisual3.classList.remove('visual-check');
    const option = 'balance';
    if (checkbox2.checked) {
      sortAccounts(option);
    }
  });

  checkbox3.addEventListener('click', function () {
    checkboxVisual1.classList.remove('visual-check');
    checkboxVisual2.classList.remove('visual-check');
    checkboxVisual3.classList.toggle('visual-check');
    const option = 'transactions';
    if (checkbox3.checked) {
      sortAccounts(option);
    }
  });

  const createAccBtn = el(
    'button.btn-global accounts-top-btn',
    'Создать новый счёт'
  );

  setChildren(topWrap, [topWrapLeft, createAccBtn]);

  createAccBtn.addEventListener('click', async function () {
    setChildren(container, loader());
    await doAccount();
    const newAccounts = await getAccounts();
    container.innerHTML = '';
    console.log(doAccountsList(newAccounts));
    setChildren(container, [topWrap, doAccountsList(newAccounts)]);
    console.log(container);
  });

  const bottomWrap = el('.accounts__bottom-wrap');

  container.innerHTML = '';

  setChildren(container, [topWrap, bottomWrap]);

  function createAccCard(accountData) {
    const accCardWrap = el('.accounts__card-wrap.box-shadow');
    const accCardWrapLeft = el('.accounts__card-wrap-left');
    const accNumber = el('p.accounts__card-number', `${accountData.account}`);
    const amount = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(`${accountData.balance}`);
    const accAmount = el('p.accounts__card-ammount', `${amount}`);
    const accSubtitle = el(
      'h3.accounts__card-subtitle',
      'Последняя транзакция:'
    );
    let unformatedDate;
    if (accountData.transactions.length !== 0) {
      unformatedDate = new Date(accountData.transactions[0].date);
    } else {
      unformatedDate = new Date();
    }
    const date = unformatedDate.toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const accLastTransaction = el(
      'p.accounts__card-last-transaction',
      `${date}`
    );
    const accCardBtn = el('a.accounts__card-btn.btn-global', 'Открыть');

    setChildren(accCardWrapLeft, [
      accNumber,
      accAmount,
      accSubtitle,
      accLastTransaction,
    ]);
    setChildren(accCardWrap, [accCardWrapLeft, accCardBtn]);

    accCardBtn.addEventListener('click', function () {
      router.navigate(`/account/${accountData.account}`);
    });

    return accCardWrap;
  }

  function doAccountsList(accounts) {
    setChildren(
      bottomWrap,
      accounts.map((accountData) => {
        return createAccCard(accountData);
      })
    );
    return bottomWrap;
  }

  doAccountsList(accounts);

  function sortAccounts(option) {
    let sortedAccountsList;
    if (option === 'account') {
      sortedAccountsList = accounts
        .slice()
        .sort((a, b) => (a.account > b.account ? 1 : -1));
    } else if (option === 'balance') {
      sortedAccountsList = accounts
        .slice()
        .sort((a, b) => (a.balance > b.balance ? 1 : -1));
    } else {
      sortedAccountsList = accounts
        .slice()
        .sort((a, b) => (a.transactions.date > b.transactions.date ? 1 : -1));
    }
    doAccountsList(sortedAccountsList);
    selector.classList.remove('is-active');
    choicesList.classList.remove('is-active');
  }

  return main;
}
