import 'babel-polyfill';
import '../../css/account.scss';
import { el, setChildren, setAttr } from 'redom';
import Chart from 'chart.js/auto';

export default function renderChart(chartData, data, percent = 0) {
  const chartContainer = el('.account-mid__chart-container');
  const chartCanvas = el('canvas.account-mid__chart-canvas');

  const maxScale = Math.max(...chartData.map((item) => item.amount));

  new Chart(chartCanvas, {
    type: 'bar',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          stacked: true,
          border: {
            color: 'black',
          },
          grid: {
            color: false,
          },
          ticks: {
            padding: 8,
            font: {
              color: 'black',
              size: 20,
              family: 'Work Sans',
              weight: 700,
            },
          },
        },
        x1: {
          stacked: true,
          position: 'top',
          border: {
            color: 'black',
          },
          grid: {
            color: false,
          },
          ticks: false,
        },
        y: {
          stacked: true,
          position: 'right',
          min: 0,
          max: maxScale,
          border: {
            color: 'black',
          },
          grid: {
            color: false,
          },
          ticks: {
            padding: 24,
            labelOffset: 10,
            callback: function (value, index, ticks) {
              let i = Math.floor(
                ((percent - this.min) / (this.max - this.min)) * ticks.length
              );
              if (index === 0 || index === ticks.length - 1) {
                return value;
              } else if (index === i) {
                return percent;
              } else return '';
            },
            font: {
              color: 'black',
              size: 20,
              family: 'Work Sans',
              weight: 500,
            },
          },
        },
        y1: {
          stacked: true,
          position: 'left',
          border: {
            color: 'black',
          },
          ticks: {
            display: false,
          },
          grid: {
            color: false,
          },
        },
      },
    },
    data: data,
  });

  setAttr(chartCanvas, { id: 'balance-dynamics' });

  setChildren(chartContainer, chartCanvas);

  return chartContainer;
}
