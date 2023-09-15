import dataFromServer from '../assets/data_example.json';

if (!localStorage.getItem('server')) {
  localStorage.setItem('server', JSON.stringify(dataFromServer));
}

export async function isLoggedIn() {
  localStorage.setItem('token', '123456789');
  return { success: true };
}

export async function getAccounts() {
  const dataServer = JSON.parse(localStorage.getItem('server'));
  const response = dataServer.accounts;
  const myAccounts = Object.values(response)
    .filter((account) => account.mine === true)
    .map((item) => {
      item.transactions = item.transactions.slice(-1);
      return item;
    });
  return myAccounts;
}

export async function doAccount() {
  let data = {
    '43123747452820828268825011': {
      account: '43123747452820828268825011',
      balance: 0,
      mine: true,
      transactions: [],
    },
  };
  const dataServer = JSON.parse(localStorage.getItem('server'));
  dataServer.accounts = Object.assign(dataServer.accounts, data);
  localStorage.setItem('server', JSON.stringify(dataServer));
  return data;
}

export async function getAccount(id) {
  const dataServer = JSON.parse(localStorage.getItem('server'));
  const response = dataServer.accounts;
  const accountById = Object.values(response).filter(
    (account) => account.account === id
  );
  return accountById[0];
}

export async function transferFunds(senderAccount, recipientAccount, amount) {
  const data = JSON.parse(localStorage.getItem('server'));
  const senderAccountdata = Object.values(data.accounts).filter(
    (account) => account.account === senderAccount
  )[0];
  senderAccountdata.balance = senderAccountdata.balance - amount;
  const today = new Date();
  const newTransaction = {
    amount: Number(amount),
    date: today.toISOString(),
    from: senderAccount,
    to: recipientAccount,
  };
  senderAccountdata.transactions.push(newTransaction);
  localStorage.setItem('server', JSON.stringify(data));

  return { success: true, data: senderAccountdata };
}

export async function getCurrencyBalances() {
  const data = JSON.parse(localStorage.getItem('server'));
  const currencies = data.mine.currencies;

  return currencies;
}

export async function getAllCurrencies() {
  const data = JSON.parse(localStorage.getItem('server'));
  const currencies = Object.keys(data.mine.currencies);

  return currencies;
}

export async function doExchange(currencyFrom, currencyTo, amount) {
  const data = JSON.parse(localStorage.getItem('server'));
  const currencies = data.mine.currencies;
  const exchangeRate = data.exchange[`${currencyFrom}/${currencyTo}`];
  const transactionAmount = amount / exchangeRate;
  data.mine.currencies[currencyFrom].amount =
    data.mine.currencies[currencyFrom].amount - amount;
  data.mine.currencies[currencyTo].amount =
    data.mine.currencies[currencyTo].amount + transactionAmount;
  localStorage.setItem('server', JSON.stringify(data));

  return { success: true, data: currencies };
}

export async function getAllAtms() {
  return [
    { lat: 55.748414, lon: 37.690289 },
    { lat: 55.7298268, lon: 37.6006606 },
  ];
}
