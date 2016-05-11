/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';
import Carousel from '../../../elements/carousel';
import SVG from '../../../svg';

const style = require('./style.scss');


export default class Block1 extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const divStyle = getImageBackground(item.image);
        let className = index === 0 ? 'active' : '';
        className += index === 0 ? ' ' + style.darkBG : '';
        return (<div className={'item ' + (style.item || '') + ' ' + className} key={index} style={divStyle}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <Link to={item.button_url}>{item.button_title}<SVG network="arrow_down"/></Link>
              </div>
            </div>
          </div>
        </div>);
      });
    }
    return null;
  }

  render() {
    const { slides } = this.props.data;
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };
    return !_.isEmpty(this.props.data) ? (<div>
      <Carousel id="carousel-home-block-1" interval={8000} indicators={false} controls={false} classes={carouselClasses}>
        {this.renderItems(slides)}
      </Carousel>
    </div>) : null;
  }
}

Block1.propTypes = {
  data: React.PropTypes.object,
};
