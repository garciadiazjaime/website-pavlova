/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import SVG from '../../../svg';
const style = require('./style.scss');


export default class Block2 extends React.Component {

  render() {
    const { buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className="container-fluid">
        <div className="row">
          <div className={style.customCol + ' col-xs-6'}>
            <Link className={style.button3v1 + ' row'} to={buttons.button1.href}>
              {buttons.button1.title}
              <SVG network="square_arrow" className={style.svg}/>
            </Link>
          </div>

          <div className={style.customCol + ' col-xs-6'}>
            <Link className={style.button3v2 + ' row'} to={buttons.button2.href}>
              {buttons.button2.title}
              <SVG network="square_arrow" className={style.svg}/>
            </Link>
          </div>
          <div className={style.customCol + ' col-xs-6'}>
            <Link className={style.button3v3 + ' row'} to={buttons.button3.href}>
              {buttons.button3.title}
              <SVG network="square_arrow" className={style.svg}/>
            </Link>
          </div>
          <div className={style.customCol + ' col-xs-6'}>
            <Link className={style.button3v4 + ' row'} to={buttons.button4.href}>
              {buttons.button4.title}
              <SVG network="square_arrow" className={style.svg}/>
            </Link>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block2.propTypes = {
  data: React.PropTypes.object,
};
