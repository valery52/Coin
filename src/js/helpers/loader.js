import '../../css/loader.scss';
import { el, setChildren } from 'redom';

export default function loader() {
  const container = el('.container.loader-container');
  const spiner = el('.spiner');

  setChildren(container, spiner);

  return container;
}
