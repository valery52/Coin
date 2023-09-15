import 'babel-polyfill';
import 'choices.js/public/assets/styles/choices.css';
import '../css/exchange.scss';
import { el, setChildren, setAttr } from 'redom';
import renderHeader from './header.js';
import {
  getCurrencyBalances,
  getAllCurrencies,
  doExchange,
  getData,
} from './api.js';
import Choices from 'choices.js';
import loader from './helpers/loader.js';

export default async function renderExchange(router) {
  const data = await getCurrencyBalances();
  const allCurrencies = await getAllCurrencies();
  let wsDataArr = JSON.parse(localStorage.getItem('tableRate')) || [];
  let selectCur1;
  let selectCur2;
  let errorTxt;
  const errorMsg = el('.exchange-left__exch-error-msg.error-msg');
  const main = el('main');
  const header = renderHeader(router);
  const container = el('.container.exchange-container');

  setChildren(document.body, main);
  setChildren(main, [header.header, container]);

  setChildren(container, loader());

  setAttr(header.btnCurrency, { className: 'header-nav__btn active' });

  const title = el('h2.exchange-title.title', 'Валютный обмен');
  const contentWrap = el('.exchange-wrap');
  const contentLeft = el('.exchange-left__wrap');
  const contentRight = el('.exchange-right__wrap');
  const currencyListWrap = el('.exchange-left__list-wrap.box-shadow');
  const currencyExchWrap = el('.exchange-left__exch-wrap.box-shadow');
  const currencyListTitle = el(
    'h3.exchange-left__list-subtitle.exchange-subtitle',
    'Ваши валюты'
  );
  const currencyExchTitle = el(
    'h3.exchange-left__exch-subtitle.exchange-subtitle',
    'Обмен валюты'
  );

  setChildren(currencyListWrap, [
    currencyListTitle,
    await renderCurrencyBalances(data),
  ]);
  setChildren(currencyExchWrap, [
    currencyExchTitle,
    await renderCurrencyExch(),
  ]);
  setChildren(contentLeft, [currencyListWrap, currencyExchWrap]);

  const exchRatesTableTitle = el(
    'h3.exchange-rigth__table-title.exchange-subtitle',
    'Изменение курсов в реальном времени'
  );
  setChildren(contentRight, [
    exchRatesTableTitle,
    renderExchRatesTable(wsDataArr),
  ]);
  setChildren(contentWrap, [contentLeft, contentRight]);
  setChildren(container, [title, contentWrap]);

  async function renderCurrencyBalances(data) {
    const dataArr = Object.values(data);
    const wrap = el('.exchange-left__list-currencies');
    const doRaw = (item) => {
      const raw = el('.exchange-left__list-raw');
      const currencyCode = el(
        'span.exchange-left__list-currency-code',
        `${item.code}`
      );
      const currencySpacer = el('span.exchange-left__list-currency-spacer');
      const currencyAmount = el(
        'span.exchange-left__list-currency-amount',
        `${new Intl.NumberFormat().format(`${item.amount}`)}`
      );

      setChildren(raw, [currencyCode, currencySpacer, currencyAmount]);
      return raw;
    };
    const listItems = dataArr.map((element) => {
      if (element.amount > 0) {
        return doRaw(element);
      }
    });
    setChildren(wrap, listItems);
    return wrap;
  }

  async function renderCurrencyExch() {
    let allCurrenciesChanged = allCurrencies.slice();
    const firstCurrencies = allCurrenciesChanged.shift();
    allCurrenciesChanged.push(firstCurrencies);

    const doOption = (item) => {
      const option = el('option.exchange-left__exch-option', `${item}`);
      setAttr(option, { value: `${item}` });
      return option;
    };

    const exchForm = el('form.exchange-left__exch-form');
    setAttr(exchForm, { method: 'post' });

    exchForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      errorMsg.innerHTML = '';
      if (inputAmount.value > 0) {
        const response = await doExchange(
          selectCur1.value,
          selectCur2.value,
          inputAmount.value
        );
        if (response.success) {
          setChildren(currencyListWrap, [
            currencyListTitle,
            await renderCurrencyBalances(response.data),
          ]);
          inputAmount.value = '';
        } else {
          switch (response.error) {
            case `Unknown currency code`:
              errorTxt = 'неверный валютный код';
              break;
            case `Invalid amount`:
              errorTxt = 'не указана сумма перевода, или она отрицательная';
              break;
            case `Not enough currency`:
            case `Overdraft prevented`:
              errorTxt = 'сумма перевода больше остатка на счете';
              break;
          }
        }
      } else {
        errorTxt = 'сумма должна быть больше нуля';
      }
      errorMsg.textContent = errorTxt;
    });

    const wrap = el('.exchange-left__exch-form-wrap');
    const upperRaw = el('.exchange-left__exch-upper-raw');
    const bottomRaw = el('.exchange-left__exch-bottom-raw');
    const labelFrom = el('label.exchange-left__exch-label', 'Из');
    setAttr(labelFrom, { for: '#choices1' });

    selectCur1 = el('select.exchange-left__exch-select.choices');
    setAttr(selectCur1, { id: 'choices1' });
    setChildren(
      selectCur1,
      allCurrencies.map((item) => doOption(item))
    );

    const labelTo = el('label.exchange-left__exch-label', 'в');
    setAttr(labelTo, { for: '#choices2' });

    selectCur2 = el('select.exchange-left__exch-select.choices');
    setAttr(selectCur2, { id: 'choices2' });
    setChildren(
      selectCur2,
      allCurrenciesChanged.map((item) => doOption(item))
    );

    const labelAmount = el(
      'label.exchange-left__exch-label.exchange-left__exch-label-input',
      'Сумма'
    );
    setAttr(labelAmount, { for: '#exch-amount' });

    const inputAmount = el('input.exchange-left__exch-input');
    setAttr(inputAmount, { id: 'exch-amount' });
    setChildren(upperRaw, [labelFrom, selectCur1, labelTo, selectCur2]);
    setChildren(bottomRaw, [labelAmount, inputAmount]);
    setChildren(wrap, [upperRaw, bottomRaw]);

    const btnForm = el('button.exchange-left__exch-btn.btn-global', 'Обменять');
    setAttr(btnForm, { type: 'submit' });

    setChildren(exchForm, [wrap, btnForm, errorMsg]);

    return exchForm;
  }

  const currentExchRates = setInterval(makeExchRatesTable, 250);

  function makeExchRatesTable() {
    exchRatesGenerator();
    setChildren(contentRight, [
      exchRatesTableTitle,
      renderExchRatesTable(wsDataArr),
    ]);
  }

  function exchRatesGenerator() {
    const data = getData();
    const exchange = data.exchange;
    const currencies = Object.keys(data.mine.currencies);
    const randomNumGenerator = () => {
      return Math.round(Math.random() * 14);
    };
    let wsData = {};
    if (wsDataArr.length === 0) {
      wsData = {
        type: 'EXCHANGE_RATE_CHANGE',
        from: 'AUD',
        to: 'BTC',
        rate: 54.05,
        change: 0,
      };
    } else {
      const i = randomNumGenerator();
      let j = randomNumGenerator();
      if (i === j) {
        if (j + 1 > 14) {
          j = 0;
        } else j++;
      }
      const currencyFrom = currencies[i];
      const currencyTo = currencies[j];
      let rate;
      if (exchange[`${currencyFrom}/${currencyTo}`]) {
        rate = exchange[`${currencyFrom}/${currencyTo}`];
      } else rate = 0;
      const randomSign = (num) => (Math.random() < 0.5 ? num : -num);
      let change;
      if (rate === 0) {
        change = Math.random();
      } else change = randomSign((rate * Math.random()) / 100);
      let newRate = rate + change;
      if (newRate < 0) {
        newRate = 0;
      }
      wsData = {
        type: 'EXCHANGE_RATE_CHANGE',
        from: currencyFrom,
        to: currencyTo,
        rate: newRate,
        change,
      };
    }
    let k = wsDataArr.findIndex(
      (item) => item.from === wsData.from && item.to === wsData.to
    );
    if (k === -1) {
      wsDataArr.push(wsData);
    } else {
      if (wsDataArr[k].rate !== wsData.rate) {
        wsDataArr[k].rate = wsData.rate;
        wsDataArr[k].change = wsData.change;
      }
    }
    localStorage.setItem('tableRate', JSON.stringify(wsDataArr));
    return wsDataArr;
  }

  function renderExchRatesTable(arr) {
    const tableWrap = el('.exchange-rigth__table-wrap');
    if (arr) {
      const tableContent = arr.slice(-21).map((item) => {
        if (
          allCurrencies.includes(item.from) ||
          allCurrencies.includes(item.to)
        ) {
          const tableRaw = el('.exchange-rigth__table-raw');
          const pairName = el(
            'span.exchange-rigth__table-pair-name',
            `${item.from}/${item.to}`
          );
          const spacer = el('span.exchange-rigth__table-spacer');
          const currencyRate = el(
            'span.exchange-rigth__table-rate',
            `${item.rate}`
          );

          const currencyRateChange = el('.exchange-rigth__table-change');

          if (item.change === -1) {
            currencyRateChange.classList.add('red');
            spacer.classList.add('red-border');
          } else if (item.change === 1) {
            currencyRateChange.classList.add('green');
            spacer.classList.add('green-border');
          }

          setChildren(tableRaw, [
            pairName,
            spacer,
            currencyRate,
            currencyRateChange,
          ]);
          return tableRaw;
        }
      });
      setChildren(tableWrap, tableContent);
    }
    return tableWrap;
  }

  router.addLeaveHook('/exchange', (done) => {
    localStorage.setItem('tableRate', JSON.stringify(wsDataArr));
    clearInterval(currentExchRates);
    done();
  });

  // eslint-disable-next-line no-unused-vars
  const choices1 = new Choices(selectCur1, {
    searchEnabled: false,
    itemSelectText: '',
  });

  // eslint-disable-next-line no-unused-vars
  const choices2 = new Choices(selectCur2, {
    searchEnabled: false,
    itemSelectText: '',
  });

  return main;
}
