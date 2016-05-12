import AppHandler from '../../components/AppHandler';
import HomeSection from '../../components/sections/home';
import AboutSection from '../../components/sections/about';
import ProductsSection from '../../components/sections/products';
import ContactSection from '../../components/sections/contact';


export default {
  items: {
    component: AppHandler,
    default: HomeSection,
    showListItem: AboutSection,
    service: ProductsSection,
    children: [{
      id: 1,
      title: 'Inicio',
      url: '/inicio',
      component: HomeSection,
    }, {
      id: 2,
      title: 'Escuela',
      url: '/escuela',
      component: AboutSection,
    }, {
      id: 3,
      title: 'Clases',
      url: '/clases',
      component: ProductsSection,
    }, {
      id: 4,
      title: 'Contacto',
      url: '/contacto',
      component: ContactSection,
    }],
  },
  icons: [{
    title: 'facebook',
    url: 'https://www.facebook.com/',
  }],
};
