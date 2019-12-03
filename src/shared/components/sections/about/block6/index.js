/* eslint max-len: [2, 500, 4] */
import React from 'react';

import ListShow from '../../../elements/listShow';
const style = require('./style.scss');

const data = require('./data');


export default class Block6 extends React.Component {

  render() {
    const { showListItem } = this.props;

    return (<div className={style.wrapper}>
        <div className="container-fluid">
        <ListShow data={data} item={showListItem} style={style} />
      </div>
    </div>);
  }
}

Block6.propTypes = {
  showListItem: React.PropTypes.string,
};
