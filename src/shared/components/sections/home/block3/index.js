/* eslint max-len: [2, 500, 4] */

import React from 'react';
import _ from 'lodash';

import sanitizeUtil from '../../../../utils/sanitize';


export default class Block3 extends React.Component {

  render() {
    const { data, style } = this.props;
    const { titles, paragraphs } = data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
            <h2 className={style.title1}>{titles.title1}</h2>
            <p className={style.paragraph1} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph1)} />
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block3.propTypes = {
  data: React.PropTypes.object,
  style: React.PropTypes.object,
};
