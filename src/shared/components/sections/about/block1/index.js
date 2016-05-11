/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import SVG from '../../../svg';
import { getImageBackground } from '../../../../utils/imageUtil';
import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');


export default class Block1 extends React.Component {

  render() {
    const styles = this.props.style;
    const { titles, paragraphs, images } = this.props.data;
    const divStyle = getImageBackground(images.image1);
    return !_.isEmpty(this.props.data) ? (<div style={divStyle} className={style.mainbanner + ' ' + (styles ? styles.wrapper : '')}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-sm-offset-3">
            <h2 className={style.title}>{titles.title1}</h2>
            <p className={style.paragraph} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph1)} />
            <SVG network="arrow_down" className={style.svg}/>
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
