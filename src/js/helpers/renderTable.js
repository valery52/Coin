import 'babel-polyfill';
import '../../css/account.scss';
import { el, setChildren, setAttr } from 'redom';

export default function renderTable(accountData, n = 10) {
  const accountId = accountData.account;
  const bottomLink = el('a.account-bottom__link');
  const bottomTitle = el('h3.account-bottom__title', 'История переводов');
  const tableHeader = el('ul.account-bottom__table-head');
  const tableHeaderSender = el(
    'li.account-bottom__table-title.account-bottom__table-title-sender',
    'Счёт отправителя'
  );
  const tableHeaderRecipient = el(
    'li.account-bottom__table-title.account-bottom__table-title-recipient',
    'Счёт получателя'
  );
  const tableHeaderSum = el(
    'li.account-bottom__table-title.account-bottom__table-title-sum',
    'Сумма'
  );
  const tableHeaderData = el(
    'li.account-bottom__table-title.account-bottom__table-title-date',
    'Дата'
  );

  setChildren(tableHeader, [
    tableHeaderSender,
    tableHeaderRecipient,
    tableHeaderSum,
    tableHeaderData,
  ]);

  const tableBody = el('.account-bottom__table-body');

  function createTableBodyRaw(item) {
    const tableRaw = el('ul.account-bottom__table-raw');
    const senderAcc = el(
      'li.account-bottom__table-content.account-bottom__table-acc',
      `${item.from}`
    );
    const recipientAcc = el(
      'li.account-bottom__table-content.account-bottom__table-acc',
      `${item.to}`
    );
    const sum = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(`${item.amount}`);
    let amount;
    if (item.from === accountId) {
      amount = el(
        'li.account-bottom__table-content.account-bottom__table-sum',
        `- ${sum}`
      );
      setAttr(amount, { style: { color: 'red' } });
    } else {
      amount = el(
        'li.account-bottom__table-content.account-bottom__table-sum',
        `+ ${sum}`
      );
      setAttr(amount, { style: { color: 'green' } });
    }

    const unformatedTransactionDate = new Date(item.date);
    const transactionDate =
      `${unformatedTransactionDate.getDate()}` +
      '.' +
      `${unformatedTransactionDate.getMonth() + 1}` +
      '.' +
      `${unformatedTransactionDate.getUTCFullYear()}`;
    const date = el(
      'li.account-bottom__table-content.account-bottom__table-date',
      `${transactionDate}`
    );
    setChildren(tableRaw, [senderAcc, recipientAcc, amount, date]);
    return tableRaw;
  }

  const listItems = accountData.transactions
    .slice(-n)
    .reverse()
    .map((item) => createTableBodyRaw(item));

  if (n !== 0) {
    setChildren(tableBody, listItems);
  } else {
    const paginationContainer = el('nav.pagination-container');
    const prevButton = el('button', '\u003c');
    setAttr(prevButton, {
      className: 'pagination-button',
      id: 'prev-button',
      title: 'Previous page',
    });
    const paginationNumbers = el('div');
    setAttr(paginationNumbers, { id: 'pagination-numbers' });
    const nextButton = el('button', '\u003e');
    setAttr(nextButton, {
      className: 'pagination-button',
      id: 'next-button',
      title: 'Next page',
    });

    setChildren(paginationContainer, [
      prevButton,
      paginationNumbers,
      nextButton,
    ]);
    setChildren(tableBody, [listItems, paginationContainer]);
    const paginationLimit = 25;
    const pageCount = Math.ceil(listItems.length / paginationLimit);
    let currentPage = 1;

    const disableButton = (button) => {
      button.classList.add('disabled');
      button.setAttribute('disabled', true);
    };

    const enableButton = (button) => {
      button.classList.remove('disabled');
      button.removeAttribute('disabled');
    };

    const handlePageButtonsStatus = () => {
      if (currentPage === 1) {
        disableButton(prevButton);
      } else {
        enableButton(prevButton);
      }

      if (pageCount === currentPage) {
        disableButton(nextButton);
      } else {
        enableButton(nextButton);
      }
    };

    const setCurrentPage = (pageNum) => {
      currentPage = pageNum;

      handlePageButtonsStatus();

      const prevRange = (pageNum - 1) * paginationLimit;
      const currRange = pageNum * paginationLimit;

      listItems.forEach((item, index) => {
        item.classList.add('visually-hidden');
        if (index >= prevRange && index < currRange) {
          item.classList.remove('visually-hidden');
        }
      });
    };

    setCurrentPage(1);

    prevButton.addEventListener('click', () => {
      setCurrentPage(currentPage - 1);
    });

    nextButton.addEventListener('click', () => {
      setCurrentPage(currentPage + 1);
    });
  }

  setChildren(bottomLink, [bottomTitle, tableHeader, tableBody]);

  return { bottomLink, tableBody, createTableBodyRaw };
}
