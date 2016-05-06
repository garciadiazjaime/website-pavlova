/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

const style = require('./style.scss');


export default class Block2 extends React.Component {

  render() {
    const { titles, images, buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className="container-fluid">
        <div className={'row ' + style.wrapper1}>
          <div className="col-sm-4 col-xs-12">
            <h2 className={style.title1}>{titles.title1}</h2>
            <img className={style.image1} src={images.image1.src} alt={images.image1.alt} />
            <Link className={style.button1} to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
          <div className="col-sm-4 col-xs-12">
            <h2 className={style.title1}>{titles.title2}</h2>
            <img className={style.image1} src={images.image2.src} alt={images.image2.alt} />
            <Link className={style.button1} to={buttons.button2.href}>{buttons.button2.title}</Link>
          </div>
          <div className="col-sm-4 col-xs-12">
            <h2 className={style.title1}>{titles.title3}</h2>
            <img className={style.image1} src={images.image3.src} alt={images.image3.alt} />
            <Link className={style.button1} to={buttons.button3.href}>{buttons.button3.title}</Link>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block2.propTypes = {
  data: React.PropTypes.object,
};
