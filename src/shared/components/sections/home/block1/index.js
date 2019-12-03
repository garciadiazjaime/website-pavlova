/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';
import Carousel from '../../../elements/carousel';
import SVG from '../../../svg';

const style = require('./style.scss');

function getData() {
  return {
    slides: [
      {
        id: 23,
        image:
          'https://www.dropbox.com/s/slj1394r4l2sr9h/Banner_Pavlova_001-2.jpg?dl=0',
        title: '',
        button_title: 'BAILA JAZZ',
        button_url: '/clases/jazz',
        content: '',
        block: 1,
      },
      {
        id: 24,
        image:
          'https://www.dropbox.com/s/4yi0dopo579m7bl/Banner_Pavlova_003-2.jpg?dl=0',
        title: '',
        button_title: 'BAILA FLAMENCO',
        button_url: '/clases/flamenco',
        content: '',
        block: 1,
      },
      {
        id: 26,
        image:
          'https://www.dropbox.com/s/ff1zyfoharkqxx4/Banner_Pavlova_004-2.jpg?dl=0',
        title: '',
        button_title: 'BAILA BALLET',
        button_url: '/clases/ballet',
        content: '',
        block: 1,
      },
      {
        id: 27,
        image:
          'https://www.dropbox.com/s/xcjhztd4g3ri8nj/Banner_Pavlova_002-2.jpg?dl=0',
        title: '',
        button_title: 'BAILA JAZ',
        button_url: '/clases/jazz',
        content: '',
        block: 1,
      },
    ],
  };
}


export default class Block1 extends React.Component {

  componentDidMount() {
    $('#carousel-home-block-1').carousel();
  }

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const divStyle = getImageBackground(item.image);
        let className = index === 0 ? 'active' : '';
        className += index === 1 ? style.darkBG : '';
        return (<div className={'item ' + (style.item || '') + ' ' + className} key={index} style={divStyle}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <Link to={item.button_url}>{item.button_title}<SVG network="arrow_right"/></Link>
              </div>
            </div>
          </div>
        </div>);
      });
    }
    return null;
  }

  render() {
    const { slides } = getData();
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
        arrow: style.arrow,
      },
    };
    return (<div>
      <Carousel id="carousel-home-block-1" interval={8000} indicators={false} classes={carouselClasses}>
        {this.renderItems(slides)}
      </Carousel>
    </div>);
  }
}
