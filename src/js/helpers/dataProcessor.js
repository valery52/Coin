import 'babel-polyfill';

const monthOfTheYear = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

function makeMonthlyTransactions(accountData, indicatorsNumber) {
  const accountId = accountData.account;
  const transactions = accountData.transactions;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const n = indicatorsNumber - 1;

  const resultArr = transactions
    .slice()
    .reverse()
    .map((transaction) => {
      const month = new Date(transaction.date).getMonth();
      const year = new Date(transaction.date).getFullYear();
      let amount;
      if (!transaction) {
        amount = 0;
      } else if (transaction.from === accountId) {
        amount = -transaction.amount;
      } else {
        amount = transaction.amount;
      }
      return { year, month, amount };
    })
    .filter(
      (item) =>
        item.year <= currentYear && item.year >= currentYear - Math.ceil(n / 12)
    )
    .filter(
      (item) => item.month <= currentMonth && item.month >= currentMonth - n
    );
  return resultArr;
}

export function dataBalanceDynamics(accountData, indicatorsNumber) {
  let currentBalance = accountData.balance;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const resultArr = makeMonthlyTransactions(
    accountData,
    indicatorsNumber
  ).reduce((monthlyChange, item) => {
    const i = monthlyChange.findIndex(
      (obj) => obj.month === item.month && obj.year === item.year
    );
    if (i >= 0) {
      monthlyChange[i].amount = monthlyChange[i].amount + item.amount;
      return monthlyChange;
    } else {
      monthlyChange.push(item);
      return monthlyChange;
    }
  }, []);
  resultArr.unshift({
    year: currentYear,
    month: currentMonth,
    amount: currentBalance,
  });

  for (let i = 1; i < resultArr.length; ++i) {
    resultArr[i].month = resultArr[i].month - 1;
    resultArr[i].amount =
      Math.round(100 * (resultArr[i - 1].amount - resultArr[i].amount)) / 100;
  }

  resultArr.forEach((item) => {
    item.month = monthOfTheYear[item.month];
  });

  resultArr.reverse();

  return resultArr;
}

export function dataTransactionDinamics(accountData, indicatorsNumber) {
  const resultArr = makeMonthlyTransactions(accountData, indicatorsNumber)
    .reduce((monthlyTransactions, item) => {
      const i = monthlyTransactions.findIndex(
        (obj) => obj.month === item.month && obj.year === item.year
      );
      if (i >= 0) {
        if (item.amount < 0) {
          monthlyTransactions[i].negativeSum =
            monthlyTransactions[i].negativeSum + item.amount;
        } else {
          monthlyTransactions[i].positiveSum =
            monthlyTransactions[i].positiveSum - item.amount;
        }
        return monthlyTransactions;
      } else {
        let negativeSum;
        let positiveSum;
        if (item.amount < 0) {
          negativeSum = item.amount;
          positiveSum = 0;
        } else {
          positiveSum = item.amount;
          negativeSum = 0;
        }
        monthlyTransactions.push({
          year: item.year,
          month: item.month,
          negativeSum,
          positiveSum,
        });
        return monthlyTransactions;
      }
    }, [])
    .map((item) => {
      const negativeSum = Math.abs(Math.round(100 * item.negativeSum) / 100);
      const positiveSum = Math.abs(Math.round(100 * item.positiveSum) / 100);
      const amount = negativeSum + positiveSum;
      const year = item.year;
      const month = item.month;
      const positivePercent = positiveSum / amount;
      const negativePercent = negativeSum / amount;
      return {
        year,
        month,
        negativePercent,
        positivePercent,
      };
    });

  resultArr.forEach((item) => {
    item.month = monthOfTheYear[item.month];
  });

  resultArr.reverse();

  const dataBalanceDynamicsArr = dataBalanceDynamics(
    accountData,
    indicatorsNumber
  );

  const percentBalanceDynamicsArr = resultArr.slice().map((item) => {
    const i = dataBalanceDynamicsArr.findIndex(
      (data) => data.month === item.month && data.year === item.year
    );
    return {
      year: item.year,
      month: item.month,
      amount: dataBalanceDynamicsArr[i].amount,
      positivePercent: Math.floor(
        dataBalanceDynamicsArr[i].amount * item.positivePercent
      ),
      negativePercent: Math.floor(
        dataBalanceDynamicsArr[i].amount * item.negativePercent
      ),
    };
  });

  return percentBalanceDynamicsArr;
}
