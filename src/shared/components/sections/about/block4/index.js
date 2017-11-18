/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import sanitizeUtil from '../../../../utils/sanitize';
import SVG from '../../../svg';
const style = require('./style.scss');
import Carousel from '../../../elements/carousel';


export default class Block4 extends React.Component {

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
    const { images, slides } = this.props.data;
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
    const imgUrl = images.image1.src ? images.image1.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : images.image1.src;
    return !_.isEmpty(this.props.data) ? (<div className={style.wrapper}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <img className={style.image} src={imgUrl} alt={images.image1.alt} />
          </div>
          <div className="col-sm-6 col-xs-12">
            <Carousel id="carousel-about-block-4" interval={8000} controls={false} classes={carouselClasses}>
              {this.renderItems(slides)}
            </Carousel>
          </div>
          <div className="col-sm-offset-6 col-xs-12">
            <h3 className={style.title}>REGLAMENTO</h3>
            <a className={style.button} href="https://dl.dropboxusercontent.com/s/gtf5rdfcblp500r/REGLAMENTO%20PAS%20DE%20CHAT.pdf?dl=0" title="REGLAMENTO-PAS-DE-CHAT" target="_blank">DESCARGAR<SVG network="arrow_down" className={style.svg}/></a>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block4.propTypes = {
  data: React.PropTypes.object,
  style: React.PropTypes.object,
};
