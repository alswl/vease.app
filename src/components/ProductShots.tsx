import markup from './markup/ProductShots.html?raw';
import productScreen1 from '../assets/product-screen-1.jpg';
import productScreen2 from '../assets/product-screen-2.jpg';
import { Markup } from './Markup';

export function ProductShots() {
  const html = markup.replace('__PRODUCT_SCREEN_1__', productScreen1).replace('__PRODUCT_SCREEN_2__', productScreen2);
  return <Markup html={html} />;
}
