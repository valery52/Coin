import 'babel-polyfill';
import '../css/normalize.css';
import '../css/style.scss';
import { el, setChildren } from 'redom';
import Navigo from 'navigo';
import renderLogin from './login.js';
import renderAccounts from './accounts.js';
import renderAccount from './account.js';
import renderBalance from './balance.js';
import renderExchange from './exchange.js';
import renderAtms from './atms.js';

const router = new Navigo('/');

const main = el('main');
setChildren(document.body, main);

router.on('/login', () => renderLogin(router));
router.on('/accounts', () => renderAccounts(router));
router.on('/account/:accountId', ({ data }) =>
  renderAccount(router, data.accountId)
);
router.on('/account/:accountId/balance', ({ data }) =>
  renderBalance(router, data.accountId)
);
router.on('/exchange', () => renderExchange(router));
router.on('/atms', () => renderAtms(router));

const isLog = !!localStorage.getItem('token');

if (isLog) {
  router.resolve('/accounts');
} else {
  router.resolve('/login');
}
