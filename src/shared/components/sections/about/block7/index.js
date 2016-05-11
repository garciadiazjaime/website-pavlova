  /* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import Carousel from '../../../elements/carousel';
import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');

export default class Block7 extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const className = index === 0 ? 'active' : '';
        return (<div className={'item ' + className} key={index}>
          <p className={style.paragraph} dangerouslySetInnerHTML={sanitizeUtil(item.content)} />
          <p className={style.author}>{item.title}</p>
        </div>);
      });
    }
    return null;
  }

  render() {
    const { titles, slides } = this.props.data;
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };
    return !_.isEmpty(this.props.data) ? (<div className="container-fluid">
      <h2 className={style.title}>{titles.title1}</h2>
      <Carousel id="carousel-about-block-7" interval={8000} controls={false} indicators={false} classes={carouselClasses}>
        {this.renderItems(slides)}
      </Carousel>
    </div>) : null;
  }
}

Block7.propTypes = {
  data: React.PropTypes.object.isRequired,
};
