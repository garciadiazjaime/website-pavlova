/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Carousel from '../../../elements/carousel';
const style = require('./style.scss');

export default class Block4 extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const className = index === 0 ? 'active' : '';
        return (<div className={'item ' + className + ' ' + (style.item || '')} key={index}>
          <img src={item.image} alt={item.title} />
        </div>);
      });
    }
    return null;
  }

  render() {
    const { titles, slides, paragraphs, buttons } = this.props.data;
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };
    return !_.isEmpty(this.props.data) ? (<div>
      <div className={'container-fluid'}>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <h2>{titles.title1}</h2>
            <p>{paragraphs.paragraph1}</p>
            <Link to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
          <div className="col-sm-6 col-xs-12">
            <Carousel id="carousel-home-block-4" interval={8000} indicators={false} classes={carouselClasses}>
              {this.renderItems(slides)}
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
