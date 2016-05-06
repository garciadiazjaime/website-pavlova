/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Carousel from '../../../elements/carousel';
import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');


export default class Block3 extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const className = index === 0 ? 'active' : '';
        const imgUrl = item.image.length ? item.image.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : '/images/demo.png';
        return (<div className={'item ' + className + ' ' + (style.item || '')} key={index}>
          <div className={'container-fluid ' + style.wrapper}>
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-10 col-md-offset-1 ">
                <img className={style.image} src={imgUrl} alt={item.title} />
                <hr className={style.hr}/>
              </div>
              <div className="col-xs-12 col-sm-4 col-sm-offset-2 col-md-5 col-md-offset-1">
                <h3 className={style.subtitle}>{item.title}</h3>
                <p dangerouslySetInnerHTML={sanitizeUtil(item.content)} className={style.paragraph} />
              </div>
              <div className="col-xs-12 col-sm-4 col-md-5">
                <Link to={item.button_url} title={item.button_title} className={style.button}>
                  {item.button_title}
                </Link>
              </div>
            </div>
          </div>
        </div>);
      });
    }
    return null;
  }

  render() {
    const { sliderId } = this.props;
    const { slides, titles } = this.props.data;
    const carouselClasses = {
      inner: style.inner,
      controls: {
        base: style.controls,
        prev: style.prev,
        next: style.next,
        arrow: style.arrow,
      },
    };
    return _.isArray(slides) && slides.length && titles ? (<div>
      <div>
        <h2 className={style.title}>{titles.title1}</h2>
      </div>
      <Carousel id={sliderId} interval={8000} indicators={false} classes={carouselClasses}>
        {this.renderItems(slides)}
      </Carousel>
    </div>) : null;
  }
}

Block3.propTypes = {
  data: React.PropTypes.object,
  sliderId: React.PropTypes.string.isRequired,
};
