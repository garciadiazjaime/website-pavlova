/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Carousel from '../../../elements/carousel';
import getSlug from '../../../../utils/slug';
import { normalizeImageUrl } from '../../../../utils/imageUtil';
import SVG from '../../../svg';
import { getFacebookIcon } from '../../../svg';
const style = require('./style.scss');

export default class Block3 extends React.Component {

  getColumnSlider(slides, item) {
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };
    const slug = getSlug(item);
    return (<Carousel id={'carousel-clases-' + slug} interval={8000} indicators={false} classes={carouselClasses}>
      {this.renderItems(slides)}
    </Carousel>);
  }

  getColumnContent(titles, paragraphs, buttons) {
    return (<div>
      <h2 className={style.title}>{titles.title1}</h2>
      <p className={style.paragraph}>{paragraphs.paragraph1}</p>
      <div className="row">
        <div className="col-sm-6 col-xs12">
          <Link className={style.button} to={buttons.button1.href} target="_blank">{buttons.button1.title}<SVG network="arrow_down"/></Link>
        </div>
        <div className="col-sm-6 col-xs12">
          { buttons.button2 ? getFacebookIcon(buttons.button2.href, buttons.button2.title, style.paragraph2) : null}
        </div>
      </div>
    </div>);
  }

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const className = index === 0 ? 'active' : '';
        const imageUrl = normalizeImageUrl(item.image);
        return (<div className={'item ' + className + ' ' + (style.item || '')} key={index}>
          <img src={imageUrl} alt={item.title} />
        </div>);
      });
    }
    return null;
  }

  render() {
    const { data, type } = this.props;
    const { titles, slides, paragraphs, buttons } = data;
    const sliderEl = this.getColumnSlider(slides, titles.title1);
    const contentEl = this.getColumnContent(titles, paragraphs, buttons);
    const blockId = getSlug(titles.title1);

    return !_.isEmpty(this.props.data) ? (<div id={blockId}>
      <div className={'container-fluid'}>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            {type === 'SLIDER_CONTENT' ? sliderEl : contentEl}
          </div>
          <div className="col-sm-6 col-xs-12">
            {type === 'SLIDER_CONTENT' ? contentEl : sliderEl}
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block3.propTypes = {
  data: React.PropTypes.object.isRequired,
  classes: React.PropTypes.object,
  type: React.PropTypes.string.isRequired,
  variations: React.PropTypes.object.isRequired,
};
