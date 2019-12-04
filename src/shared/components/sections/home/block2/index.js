/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';

import SVG from '../../../svg';
const style = require('./style.scss');

function getData() {
  return {
    slides: [
      { title: 'BALLET', href: '/clases/ballet', className: 'button3v1' },
      { title: 'JAZZ', href: '/clases/jazz', className: 'button3v2' },
      { title: 'FLAMENCO', href: '/clases/flamenco', className: 'button3v3' },
      { title: 'Hip Hop', href: '/clases/hip-hop', className: 'button3v5' },
    ],
  };
}

function getSlides(slides) {
  return slides.map((slide, index) => (<div className={'col-xs-6 ' + style.customCol} key={index}>
  <Link className={style[slide.className] + ' row'} to={slide.href}>
    {slide.title}
    <SVG network="square_arrow" className={style.svg}/>
  </Link>
</div>));
}


export default class Block2 extends React.Component {

  render() {
    const { slides } = getData();

    return (<div>
      <div className="container-fluid">
        <div className="row">
          {getSlides(slides)}
        </div>
      </div>
    </div>);
  }
}
