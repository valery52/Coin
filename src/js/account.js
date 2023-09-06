import '../css/account.scss';
import { el, setChildren, setAttr } from 'redom';
import renderHeader from './header.js';
import { getAccount, transferFunds } from './api.js';
import { dataBalanceDynamics } from './helpers/dataProcessor.js';
import autoComplete from '@tarekraafat/autocomplete.js';
import renderAccountTop from './helpers/account-top.js';
import renderChart from './helpers/renderChart.js';
import renderTable from './helpers/renderTable.js';
import loader from './helpers/loader.js';

export default async function renderAccount(router, accountId) {
  const accountData = await getAccount(accountId);
  const main = el('main');
  const header = renderHeader(router);
  const container = el('.container.account-container');
  let errorTxt;
  const errorMsg = el('.account-mid__form-error-msg.error-msg');

  setChildren(document.body, main);
  setChildren(main, [header.header, container]);
  setChildren(container, loader());

  const topWrap = renderAccountTop(
    accountData,
    'Просмотр счёта',
    router,
    `/accounts`
  );

  const midWrap = el('.account-mid__wrap');
  const midForm = el('form.account-mid__form');

  setAttr(midForm, { method: 'post' });

  const formTitle = el('h3.account-mid__form-title', 'Новый перевод');
  const labelBenef = el('label.account-mid__form-label');
  const labelBenefAcc = el(
    'p.account-mid__form-label-descr',
    'Номер счёта получателя'
  );
  const errorMessageBenef = el(
    'p.account-mid__form-message.visually-hidden',
    'Введите корректный номер счета'
  );
  const labelAmount = el('label.account-mid__form-label');
  const labelAmountNum = el(
    'p.account-mid__form-label-descr',
    'Сумма перевода'
  );
  const errorMessageAmount = el(
    'p.account-mid__form-message.visually-hidden',
    'Сумма перевода должна быть больше ноля'
  );
  const inputBenef = el('input.account-mid__form-input');
  const inputAmount = el('input.account-mid__form-input');
  const formBtn = el('button.account-mid__form-btn.btn-global', 'Отправить');

  setAttr(labelBenef, { for: 'autoComplete', id: 'label-benef' });
  setAttr(labelAmount, { for: 'account-mid__form-amount' });
  setAttr(inputBenef, {
    id: 'autoComplete',
    type: 'text',
    required: true,
    placeholder: 'Placeholder',
  });
  setAttr(inputAmount, {
    id: 'account-mid__form-amount',
    type: 'text',
    required: true,
    placeholder: 'Placeholder',
  });
  setAttr(formBtn, { type: 'submit' });

  setChildren(labelBenef, [labelBenefAcc, inputBenef, errorMessageBenef]);
  setChildren(labelAmount, [labelAmountNum, inputAmount, errorMessageAmount]);
  setChildren(midForm, [formTitle, labelBenef, labelAmount, formBtn, errorMsg]);

  // function validationForm() {
  //   if (inputBenef.value === '') {
  //     errorMessageBenef.classList.remove('visually-hidden');
  //     return false;
  //   } else if (inputAmount.value === '' || inputAmount.value === 0) {
  //     errorMessageAmount.classList.remove('visually-hidden');
  //     return false;
  //   } else {
  //     errorMessageBenef.classList.add('visually-hidden');
  //     errorMessageAmount.classList.add('visually-hidden');
  //     return true;
  //   }
  // }

  inputAmount.addEventListener('blur', function () {
    if (inputAmount.value < 0) {
      inputAmount.value = 0;
    }
  });

  const midChartWrap = el('.account-mid__chart-wrap.box-shadow');
  const midChart = el('a.account-mid__chart');
  const midChartTitle = el('h3.account-mid__chart-title', 'Динамика баланса');
  const chartData = dataBalanceDynamics(accountData, 6);
  const data = {
    labels: chartData.map((row) => row.month),
    datasets: [
      {
        label: false,
        data: chartData.map((row) => row.amount),
      },
    ],
  };
  const midChartContainer = renderChart(chartData, data);
  setChildren(midChart, [midChartTitle, midChartContainer]);
  setChildren(midChartWrap, midChart);
  setChildren(midWrap, [midForm, midChartWrap]);

  midChart.addEventListener('click', function () {
    router.navigate(`/account/${accountId}/balance`);
  });

  const bottomWrap = el('.account-bottom__wrap');
  const bottomLink = renderTable(accountData).bottomLink;

  setChildren(bottomWrap, bottomLink);

  bottomLink.addEventListener('click', function () {
    router.navigate(`/account/${accountId}/balance`);
  });

  setChildren(container, [topWrap, midWrap, bottomWrap]);

  let usedAccArr = [];

  midForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    setChildren(container, loader());
    errorMsg.innerHTML = '';
    if (inputBenef.value.trim().length !== 0 && inputAmount.value > 0) {
      const response = await transferFunds(
        accountId,
        inputBenef.value,
        inputAmount.value
      );
      if (response.success) {
        usedAccArr = JSON.parse(localStorage.getItem('usedAcc')) || [];
        if (!usedAccArr.includes(inputBenef.value)) {
          usedAccArr.push(inputBenef.value);
        }
        localStorage.setItem('usedAcc', JSON.stringify(usedAccArr));
        setChildren(
          renderTable(accountData).tableBody,
          response.data.transactions
            .slice(-10)
            .reverse()
            .map((item) => renderTable(accountData).createTableBodyRaw(item))
        );
      } else {
        switch (response.error) {
          case `Invalid account from`:
            errorTxt =
              'Не указан счёт списания, или этот счёт не принадлежит нам';
            break;
          case `Invalid account to`:
            errorTxt =
              'Не указан счёт зачисления, или этого счёта не существует';
            break;
          case `Invalid amount`:
            errorTxt = 'Не указана сумма перевода, или она отрицательная';
            break;
          case `Overdraft prevented`:
            errorTxt =
              'мы попытались перевести больше денег, чем доступно на счёте списания';
            break;
        }
      }
      inputBenef.value = '';
      inputAmount.value = '';
    } else {
      errorTxt = 'Не указан номер счета зачисления или сумма перевода';
    }
    errorMsg.textContent = errorTxt;
    setChildren(container, [topWrap, midWrap, bottomWrap]);
  });

  const autoCompleteJS = new autoComplete({
    data: {
      src: JSON.parse(localStorage.getItem('usedAcc')) || [],
    },
    resultItem: {
      highlight: false,
    },
    events: {
      input: {
        selection: (event) => {
          const selection = event.detail.selection.value;
          autoCompleteJS.input.value = selection;
        },
      },
    },
  });
  return main;
}
