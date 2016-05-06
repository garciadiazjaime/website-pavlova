import AppHandler from '../../components/AppHandler';
import HomeSection from '../../components/sections/home';
import AboutSection from '../../components/sections/about';
import ProductsSection from '../../components/sections/products';
import ContactSection from '../../components/sections/contact';


export default {
  items: {
    component: AppHandler,
    default: HomeSection,
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
      id: 5,
      title: 'Contacto',
      url: '/contacto',
      component: ContactSection,
    }],
  },
  icons: [{
    title: 'facebook',
    url: 'https://www.facebook.com/',
  }],
  addresses: [{
    titles: {
      title1: 'UBICACIÓN',
      title2: 'LLÁMANOS',
      title3: 'CLASES',
      title4: 'DESCARGABLES',
    },
    texts: {
      text1: 'Av. Allende #38',
      text2: 'Col. Hipódromo',
      text3: 'Tijuana, B.C.',
      text4: 'info@pavlovahipodromo.com',
      text5: '664 686.27.87',
      text6: 'http://facebook.com',
      text7: 'Síguenos en Facebook',
    },
    links: {
      link1: {
        title: 'BALLET',
        href: '/clases/ballet',
      },
      link2: {
        title: 'JAZZ',
        href: '/clases/jazz',
      },
      link3: {
        title: 'FLAMENCO',
        href: '/clases/flamenco',
      },
      link4: {
        title: 'CARDIO DANZA',
        href: '/clases/cardio-danza',
      },
      link5: {
        title: 'BARRÉ',
        href: '/clases/barre',
      },
      link6: {
        title: 'HORARIOS',
        href: '/docs/horarios.pdf',
      },
      link7: {
        title: 'FICHA DE INSCRIPCIÓN',
        href: '/docs/ficha-inscripcion.pdf',
      },
      link8: {
        title: 'REGLAMENTO',
        href: '/docs/reglamento.pdf',
      },
    },
  }],
};
