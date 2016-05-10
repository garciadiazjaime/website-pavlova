/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';
const style = require('./style.scss');


export default class Block3 extends React.Component {

  render() {
    const { data, variations } = this.props;
    const { titles, images } = data;
    const divStyle = getImageBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div style={divStyle} className={style.mainbanner}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <h2 className={style.title3 + ' ' + variations.variation1}>{titles.title1}</h2>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block3.propTypes = {
  data: React.PropTypes.object.isRequired,
  variations: React.PropTypes.object.isRequired,
};
