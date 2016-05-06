/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');


export default class Block4 extends React.Component {

  render() {
    const { titles, images, paragraphs, buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className={'container-fluid ' + style.wrapper}>
        <div className="row">
          <div className="col-sm-4 col-sm-offset-2 col-md-5 col-md-offset-1 col-xs-12">
            <h2 className={style.title}>{titles.title1}</h2>
            <p className={style.paragraph} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph1)} />
            <Link className={style.button} to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
          <div className="col-sm-6 col-xs-12">
            <img className={style.image} src={images.image1.src} alt={images.image1.alt} />
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block4.propTypes = {
  data: React.PropTypes.object,
};
