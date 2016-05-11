/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
// const style = require('./style.scss');

export default class Block8 extends React.Component {

  render() {
    const { titles, buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div className="container-fluid">
      <div className="row">
        <div className="col-sm-4 col-xs-12">
          <h3>{titles.title1}</h3>
          <a href={buttons.button1.href} title={buttons.button1.title} target="_blank">DESCARGAR</a>
        </div>
        <div className="col-sm-4 col-xs-12">
          <h3>{titles.title2}</h3>
          <a href={buttons.button2.href} title={buttons.button2.title} target="_blank">DESCARGAR</a>
        </div>
        <div className="col-sm-4 col-xs-12">
          <h3>{titles.title3}</h3>
          <a href={buttons.button3.href} title={buttons.button3.title} target="_blank">DESCARGAR</a>
        </div>
      </div>
    </div>) : null;
  }
}

Block8.propTypes = {
  data: React.PropTypes.object.isRequired,
};
