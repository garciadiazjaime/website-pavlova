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

  getColumnSlider(slides, item, noControls) {
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
      },
    };
    const slug = getSlug(item);
    return (<div className="col-xs-12 col-sm-6">
    {
      noControls !== false ?
      <Carousel id={'carousel-clases-' + slug} interval={8000} indicators={false} classes={carouselClasses}>
        {this.renderItems(slides)}
      </Carousel> :
      <Carousel id={'carousel-clases-' + slug} interval={8000} indicators={false} controls={false} classes={carouselClasses}>
        {this.renderItems(slides)}
      </Carousel>
    }
    </div>);
  }

  getColumnContent(titles, paragraphs, buttons, danceStyle) {
    return (<div className="col-xs-12 col-sm-5">
      <h2 className={style.title + ' ' + style[danceStyle]}>{titles.title1}</h2>
      <p className={style.paragraph}>{paragraphs.paragraph1}</p>
      <div className="row">
        <div className="col-sm-6 col-xs12">
          <Link className={style.button} to={buttons.button1.href} target="_blank">{buttons.button1.title}<SVG network="arrow_down"/></Link>
        </div>
        <div className={'col-sm-6 col-xs12 ' + style.sm}>
          { buttons.button2 ? getFacebookIcon(buttons.button2.href, buttons.button2.title, style.paragraphB) : null}
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
          <img src={imageUrl} alt={item.title} className={style.image} />
        </div>);
      });
    }
    return null;
  }

  render() {
    const { data, type, variations, noControls } = this.props;
    const { titles, slides, paragraphs, buttons } = data;
    const sliderEl = this.getColumnSlider(slides, titles.title1, noControls);
    const contentEl = this.getColumnContent(titles, paragraphs, buttons, variations.variation1);
    const blockId = getSlug(titles.title1);

    return !_.isEmpty(this.props.data) ? (<div id={blockId} className={style.wrapper_2}>
      <div className={'container-fluid'}>
        <div className={'row ' + style.wrapper_}>
          {type === 'SLIDER_CONTENT' ? sliderEl : contentEl}
          <div className="col-sm-1 hidden-xs" />
          {type === 'SLIDER_CONTENT' ? contentEl : sliderEl}
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
  noControls: React.PropTypes.bool,
};
