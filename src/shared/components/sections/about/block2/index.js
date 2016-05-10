/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { getImageBackground } from '../../../../utils/imageUtil';
import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');
import Carousel from '../../../elements/carousel';


export default class Block2 extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const className = index === 0 ? 'active' : '';
        return (<div className={'item ' + className} key={index}>
          <h3>{item.title}</h3>
          <div dangerouslySetInnerHTML={sanitizeUtil(item.content)} />
        </div>);
      });
    }
    return null;
  }

  render() {
    const { titles, images, buttons, slides } = this.props.data;
    const divStyle = getImageBackground(images.image1);
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };
    return !_.isEmpty(this.props.data) ? (<div style={divStyle} className={style.mainbanner}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <Carousel id="carousel-about-block-2" interval={8000} controls={false} classes={carouselClasses}>
              {this.renderItems(slides)}
            </Carousel>
            <Link to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
          <div className="col-sm-6 col-xs-12">
            <h2 className={style.title3}>{titles.title1}</h2>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block2.propTypes = {
  data: React.PropTypes.object,
  style: React.PropTypes.object,
};
