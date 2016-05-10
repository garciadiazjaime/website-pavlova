import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
// const style = require('./style.scss');


export default class Block2 extends React.Component {

  render() {
    const { buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm1" />
          <div className="col-sm-2 col-xs-12">
            <Link to={buttons.button1.href}>{buttons.button1.title}</Link>
          </div>
          <div className="col-sm-2 col-xs-12">
            <Link to={buttons.button2.href}>{buttons.button2.title}</Link>
          </div>
          <div className="col-sm-2 col-xs-12">
            <Link to={buttons.button3.href}>{buttons.button3.title}</Link>
          </div>
          <div className="col-sm-2 col-xs-12">
            <Link to={buttons.button4.href}>{buttons.button4.title}</Link>
          </div>
          <div className="col-sm-2 col-xs-12">
            <Link to={buttons.button5.href}>{buttons.button5.title}</Link>
          </div>
          <div className="col-sm1" />
        </div>
      </div>
    </div>) : null;
  }
}

Block2.propTypes = {
  data: React.PropTypes.object,
};
