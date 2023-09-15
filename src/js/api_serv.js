export async function isLoggedIn(login, password) {
  const response = await fetch(`http://localhost:3000/login`, {
    method: 'POST',
    body: JSON.stringify({
      login: login,
      password: password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload?.token) {
    localStorage.setItem('token', data.payload.token);
    return { success: true };
  }
  return { success: false, error: data.error };
}

export async function getAccounts() {
  const response = await fetch(`http://localhost:3000/accounts`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return data.payload;
  }
  throw new Error(data.error);
}

export async function doAccount() {
  const response = await fetch(`http://localhost:3000/create-account`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return { success: true };
  }

  return { success: false, error: data.error };
}

export async function getAccount(id) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (data.payload) {
    return data.payload;
  }
  throw new Error(data.error);
}

export async function transferFunds(senderAccount, recipientAccount, amount) {
  const response = await fetch(`http://localhost:3000/transfer-funds`, {
    method: 'POST',
    body: JSON.stringify({
      from: senderAccount,
      to: recipientAccount,
      amount,
    }),
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return { success: true, data: data.payload };
  }
  return { success: false, error: data.error };
}

export async function getCurrencyBalances() {
  const response = await fetch(`http://localhost:3000/currencies`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return data.payload;
  }
  throw new Error(data.error);
}

export async function getAllCurrencies() {
  const response = await fetch(`http://localhost:3000/all-currencies`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return data.payload;
  }
  throw new Error(data.error);
}

export async function doExchange(currencyFrom, currencyTo, amount) {
  const response = await fetch(`http://localhost:3000/currency-buy`, {
    method: 'POST',
    body: JSON.stringify({
      from: currencyFrom,
      to: currencyTo,
      amount,
    }),
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return { success: true, data: data.payload };
  }
  return { success: false, error: data.error };
}

export async function getAllAtms() {
  const response = await fetch(`http://localhost:3000/banks`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.payload) {
    return data.payload;
  }
  throw new Error(data.error);
}
