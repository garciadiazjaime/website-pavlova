/* eslint max-len: [2, 500, 4] */

import React from 'react';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';
const style = require('./style.scss');


export default class Block1 extends React.Component {

  render() {
    const { images } = this.props.data;
    const divStyle = getImageBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div style={divStyle} className={style.mainbanner} />) : null;
  }
}

Block1.propTypes = {
  data: React.PropTypes.object,
};
