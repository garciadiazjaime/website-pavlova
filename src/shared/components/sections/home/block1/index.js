/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';

// const style = require('./style.scss');


export default class Block1 extends React.Component {

  render() {
    const { buttons, images } = this.props.data;
    const divStyle = getImageBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div style={divStyle}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-10 col-xs-12">
            <Link to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block1.propTypes = {
  data: React.PropTypes.object,
};
