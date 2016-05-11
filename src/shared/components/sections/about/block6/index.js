/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import ListShow from '../../../elements/listShow';
const style = require('./style.scss');


export default class Block6 extends React.Component {

  render() {
    const { data, showListItem } = this.props;
    return !_.isEmpty(this.props.data) ? (<div className={style.wrapper}>
        <div className="container-fluid">
        <ListShow data={data} item={showListItem} style={style} />
      </div>
    </div>) : null;
  }
}

Block6.propTypes = {
  data: React.PropTypes.object.isRequired,
  showListItem: React.PropTypes.string,
};
