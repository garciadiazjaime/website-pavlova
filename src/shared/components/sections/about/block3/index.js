/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import { getImageBackground } from '../../../../utils/imageUtil';
const style = require('./style.scss');


export default class Block1 extends React.Component {

  render() {
    const styles = this.props.style;
    const divStyle = getImageBackground('/images/home/pas-de-chat.jpg');
    return !_.isEmpty(this.props.data) ? (<div style={divStyle} className={style.mainbanner + ' ' + (styles ? styles.wrapper : '')}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-sm-offset-3">
            <h2 className={style.title}>EXCELENCIA</h2>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block1.propTypes = {
  data: React.PropTypes.object,
  style: React.PropTypes.object,
};
