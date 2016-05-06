/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import setImageAsBackground from '../../../../utils/setImageAsBackground';

const style = require('./style.scss');


export default class Block4 extends React.Component {

  render() {
    const { titles, buttons, images } = this.props.data;
    const divStyle = setImageAsBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div className={style.wrapper2} style={divStyle}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-10 col-xs-12">
            <h2 className={style.mainTitle}>{titles.title1}</h2>
            <Link className={style.button2} to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block4.propTypes = {
  data: React.PropTypes.object,
};
