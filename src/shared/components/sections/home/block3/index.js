/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';
import SVG from '../../../svg';

const style = require('./style.scss');

export default class Block3 extends React.Component {

  render() {
    const { titles, buttons, images, paragraphs } = this.props.data;
    const divStyle = getImageBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div style={divStyle} className={style.passeDeChat}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h2 className={style.title}>{titles.title1}</h2>
            <p className={style.paragraph}>{paragraphs.paragraph1}</p>
            <Link className={style.button} to={buttons.button1.href}>{buttons.button1.title}<SVG network="arrow_right"/></Link>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block3.propTypes = {
  data: React.PropTypes.object,
};
