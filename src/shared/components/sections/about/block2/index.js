/* eslint max-len: [2, 1000, 4] */

import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { getImageBackground } from '../../../../utils/imageUtil';
import sanitizeUtil from '../../../../utils/sanitize';
import SVG from '../../../svg';
import Carousel from '../../../elements/carousel';
const style = require('./style.scss');

function getData() {
  return {
    slides: [
      {
        id: 4,
        image: '',
        title: 'Nuestra Escuela',
        button_title: '',
        button_url: '',
        content:
          '<p>Somos una Escuela de gran prestigio en el ámbito de la Danza, altamente especializada en las técnicas de Ballet, Jazz y Flamenco desde 1987. Nuestro principal compromiso es lograr que las alumnas aprovechen el tiempo de forma positiva ejercitando las técnicas de baile con un balance entre disciplina y convivencia.</p>\r\n<p>A través de la expresión corporal y estética de los movimientos, las alumnas adquieren una mejor coordinación, corrigen su postura, siguen un régimen alimenticio y moldean su silueta. La formación en el ámbito de la danza implica aprender a trabajar en equipo además de lograr un mayor desenvolvimiento, adquirir confianza en sí mismas y obtener crecimiento personal.</p>\r\n<p>Nuestra enseñanza es una propuesta de experiencia artística que armoniza mente y cuerpo.</p>',
        block: 6,
      },
      {
        id: 5,
        image: '',
        title: 'Nuestra Misón',
        button_title: '',
        button_url: '',
        content:
          'Ser una escuela de danza líder a nivel nacional, que ofrezca a su alumnado la oportunidad de desarrollar su pasión por la danza y la apreciación de las bellas artes dejando así una huella positiva en nuestra sociedad.',
        block: 6,
      },
      {
        id: 6,
        image: '',
        title: 'Nuestra Visión',
        button_title: '',
        button_url: '',
        content:
          'Mantener el liderazgo con festivales binacionales de calidad, reinventándonos constantemente para estar en la vanguardia. Tener una gran variedad de clases y maestros que asistan con alegría, convencidos de que están en la mejor academia de danza. Capacitar constantemente a nuestros maestros. Compartir con orgullo nuestros logros a la sociedad, mediante los medios de comunicación disponibles. Cuidando la salud integral de nuestro alumnado, asesorándolo en su nutrición, además de motivar a las alumnas a participar en cursos y concursos.',
        block: 6,
      },
    ],
    buttons: {
      button1: { id: 9, title: 'CONTÁCTANOS', href: '/contacto', block: 6 },
    },
    images: {
      image1: {
        id: 4,
        alt: 'nuestra escuela',
        src:
          'https://www.dropbox.com/s/d69v5mv7tr0k7f5/Img-escuela-bg.jpg?dl=0https://www.dropbox.com/s/d69v5mv7tr0k7f5/Img-escuela-bg.jpg?dl=0',
        block: 6,
      },
    },
    titles: { title1: 'Experiencia artística que armoniza mente y cuerpo' },
  };
}

export default class Block2 extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const className = index === 0 ? 'active' : '';
        return (<div className={'item ' + className} key={index}>
          <h3 className={style.title}>{item.title}</h3>
          <div className={style.paragraph} dangerouslySetInnerHTML={sanitizeUtil(item.content)} />
        </div>);
      });
    }
    return null;
  }

  render() {
    const { titles, buttons, slides } = getData();
    const divStyle = getImageBackground('/images/escuela/banner-experiencia-artistica.jpg');
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
      indicator: {
        base: style.indicators,
        active: style.active,
      },
    };
    return (<div style={divStyle} className={style.mainbanner}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <Carousel id="carousel-about-block-2" interval={8000} controls={false} classes={carouselClasses}>
              {this.renderItems(slides)}
            </Carousel>
            <Link className={style.button} to={buttons.button1.href}>{buttons.button1.title}<SVG network="arrow_right"/></Link>
          </div>
          <div className="col-sm-4 col-xs-10 col-xs-offset-1">
            <p className={style.tagline}>{titles.title1}</p>
          </div>
        </div>
      </div>
    </div>);
  }
}
