/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import SVG from '../../../svg';
const style = require('./style.scss');

export default class Block7 extends React.Component {

  render() {
    const { titles, buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div className={style.wrapper}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4 col-xs-12">
            <h3 className={style.title}>{titles.title1}</h3>
            <a className={style.button} href={buttons.button1.href} title={buttons.button1.title} target="_blank">DESCARGAR<SVG network="arrow_down" className={style.svg}/></a>
          </div>
          <div className="col-sm-4 col-xs-12">
            <h3 className={style.title}>{titles.title2}</h3>
            <a className={style.button} href={buttons.button2.href} title={buttons.button2.title} target="_blank">DESCARGAR<SVG network="arrow_down" className={style.svg}/></a>
          </div>
          <div className="col-sm-4 col-xs-12">
            <h3 className={style.title}>{titles.title3}</h3>
            <a className={style.button} href={buttons.button3.href} title={buttons.button3.title} target="_blank">DESCARGAR<SVG network="arrow_down" className={style.svg}/></a>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block7.propTypes = {
  data: React.PropTypes.object.isRequired,
};
