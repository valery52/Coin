import '../../css/account.scss';
import { el, setChildren } from 'redom';

export default function renderAccountTop(
  accountData,
  titleTxt,
  router,
  backRoute
) {
  const topWrap = el('.account-top__wrap');
  const topLeft = el('.account-top__left');
  const topRight = el('.account-top__right');
  const title = el('h2.account-top__title.title', titleTxt);
  const accNumber = el(
    'p.account-top__account-number',
    `№ ${accountData.account}`
  );

  setChildren(topLeft, [title, accNumber]);

  const topBtn = el('a.btn-global.account-top__btn', 'Вернуться назад');
  const topBalance = el('.account-top__right-wrap');
  const topBalanceTxt = el('h3.account-top__subtitle', 'Баланс');
  const amount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(`${accountData.balance}`);
  const topBalanceAmount = el('p.account-top__descr', `${amount}`);

  setChildren(topBalance, [topBalanceTxt, topBalanceAmount]);
  setChildren(topRight, [topBtn, topBalance]);
  setChildren(topWrap, [topLeft, topRight]);

  topBtn.addEventListener('click', function () {
    router.navigate(backRoute);
  });

  return topWrap;
}
