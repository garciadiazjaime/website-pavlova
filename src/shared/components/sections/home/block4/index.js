/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Carousel from '../../../elements/carousel';
import SVG from '../../../svg';
const style = require('./style.scss');


export default class Block4 extends React.Component {

  renderItems() {
    return Array.apply(null, Array(7)).map((item, index) => {
      const className = index === 0 ? 'active' : '';
      return (<div className={'item ' + className + ' ' + (style.item || '')} key={index}>
          <img className={style.carrouselImg} src={`/images/home-escuela/img-slider-escuela-0${index + 1}.jpg`} alt="pavlova hipodromo escuela" />
        </div>);
    });
  }

  render() {
    const { titles, paragraphs, buttons } = this.props.data;
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };

    return !_.isEmpty(this.props.data) ? (<div>
      <div className={'container-fluid ' + style.wrapper}>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <h2 className={style.title}>{titles.title1}</h2>
            <p className={style.paragraph}>{paragraphs.paragraph1}</p>
            <Link className={style.button} to={buttons.button1.href}>{buttons.button1.title}<SVG network="arrow_right"/></Link>
          </div>
          <div className="col-sm-6 col-xs-12">
            <Carousel id="carousel-home-block-4" interval={8000} indicators={false} classes={carouselClasses}>
              {this.renderItems()}
            </Carousel>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block4.propTypes = {
  data: React.PropTypes.object,
  classes: React.PropTypes.object,
};
