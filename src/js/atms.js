import 'babel-polyfill';
import '../css/atms.scss';
import { el, setChildren, setAttr } from 'redom';
import renderHeader from './header.js';
import { getAllAtms } from './api.js';

export default async function renderAtms(router) {
  const allAtms = await getAllAtms();
  const main = el('main');
  const header = renderHeader(router);
  const container = el('.container.atms-container');

  setChildren(document.body, main);
  setChildren(main, [header.header, container]);

  setAttr(header.btnAtms, { className: 'header-nav__btn active' });

  const title = el('h2.atms-title.title', 'Карта банкоматов');
  const map = el('.atms-map');
  setAttr(map, { id: 'map' });

  setChildren(container, [title, map]);

  const placemarkData = () => {
    return allAtms.slice().map((item, index) => {
      return {
        type: 'Feature',
        id: index,
        geometry: { type: 'Point', coordinates: [item.lat, item.lon] },
        options: {
          iconColor: '#116ACC',
          preset: 'islands#blueIcon',
        },
      };
    });
  };

  ymaps.ready(init);

  function init() {
    var myMap = new ymaps.Map(
        'map',
        {
          center: [55.76, 37.64],
          zoom: 10.25,
        },
        {
          searchControlProvider: 'yandex#search',
        }
      ),
      objectManager = new ymaps.ObjectManager({
        gridSize: 32,
      });

    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    objectManager.add(JSON.stringify(placemarkData()));
  }

  return container;
}
