/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import setImageAsBackground from '../../../../utils/setImageAsBackground';

// const style = require('./style.scss');


export default class Block3 extends React.Component {

  render() {
    const { titles, buttons, images, paragraphs } = this.props.data;
    const divStyle = setImageAsBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div style={divStyle}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-10 col-xs-12">
            <h2>{titles.title1}</h2>
            <p>{paragraphs.paragraph1}</p>
            <Link to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block3.propTypes = {
  data: React.PropTypes.object,
};
