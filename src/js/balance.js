import 'babel-polyfill';
import '../css/balance.scss';
import '../css/account.scss';
import { el, setChildren } from 'redom';
import renderHeader from './header.js';
import { getAccount } from './api.js';
import renderAccountTop from './helpers/account-top.js';
import renderChart from './helpers/renderChart.js';
import {
  dataBalanceDynamics,
  dataTransactionDinamics,
} from './helpers/dataProcessor.js';
import renderTable from './helpers/renderTable.js';

export default async function renderBalance(router, accountId) {
  const accountData = await getAccount(accountId);
  const main = el('main');
  const header = renderHeader(router);
  const container = el('.container.balance-container');

  setChildren(document.body, main);
  setChildren(main, [header.header, container]);

  const topWrap = renderAccountTop(
    accountData,
    'История баланса',
    router,
    `/account/${accountId}`
  );

  const chart1Wrap = el(
    '.account-mid__chart-wrap.balance__chart-wrap.box-shadow'
  );
  const chart1 = el('a.account-mid__chart');
  const chart1Title = el('h3.account-mid__chart-title', 'Динамика баланса');
  const chart2Wrap = el(
    '.account-mid__chart-wrap.balance__chart-wrap.box-shadow'
  );
  const chart2 = el('a.account-mid__chart');
  const chart2Title = el(
    'h3.account-mid__chart-title',
    'Соотношение входящих исходящих транзакций'
  );

  const chartData1 = dataBalanceDynamics(accountData, 12);
  const chartData2 = dataTransactionDinamics(accountData, 12);
  const data1 = {
    labels: chartData1.map((row) => row.month),
    datasets: [
      {
        label: false,
        data: chartData1.map((row) => row.amount),
      },
    ],
  };
  const data2 = {
    labels: chartData2.map((row) => row.month),
    datasets: [
      {
        label: 'negative',
        data: chartData2.map((row) => row.negativePercent),
        backgroundColor: '#FD4E5D',
      },
      {
        label: 'positive',
        data: chartData2.map((row) => row.positivePercent),
        backgroundColor: '#76CA66',
      },
    ],
  };
  const percent1 =
    Math.floor(
      Math.max(...chartData2.map((item) => item.positivePercent)) * 100
    ) / 100;
  const percent2 =
    Math.floor(
      Math.max(...chartData2.map((item) => item.negativePercent)) * 100
    ) / 100;
  const percent = Math.min(percent1, percent2);

  const chart1Container = renderChart(chartData1, data1);
  const chart2Container = renderChart(chartData2, data2, percent);

  setChildren(chart1, [chart1Title, chart1Container]);
  setChildren(chart2, [chart2Title, chart2Container]);
  setChildren(chart1Wrap, chart1);
  setChildren(chart2Wrap, chart2);

  const bottomWrap = el('.account-bottom__wrap');

  setChildren(bottomWrap, renderTable(accountData, 0).bottomLink);
  setChildren(container, [topWrap, chart1Wrap, chart2Wrap, bottomWrap]);

  return main;
}
