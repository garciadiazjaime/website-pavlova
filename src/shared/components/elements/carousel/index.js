/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import SVG from '../../svg';

export default class Carousel extends React.Component {

  getIndicators(data, flag) {
    // todo: implement based on bootsrap syntax
    if (flag !== false && _.isArray(data) && data.length) {
      return data.map((item, index) => {
        return (<div key={index}>
          {item}
        </div>);
      });
    }
    return null;
  }

  getControls(flag, id, classes) {
    const { base, prev, next, arrow } = classes;
    if (flag !== false) {
      return (<div>
          <a className={'left carousel-control ' + (base || '') + ' ' + (prev || '')} href={'#' + id} role="button" data-slide="prev">
          <SVG network="carousel_left" className={arrow}/>
          <span className="sr-only">Previous</span>
        </a>
        <a className={'right carousel-control ' + (base || '') + ' ' + (next || '')} href={'#' + id} role="button" data-slide="next">
          <SVG network="carousel_right" className={arrow}/>
          <span className="sr-only">Next</span>
        </a>
      </div>);
    }
    return null;
  }

  render() {
    const { id, interval, children, indicators, controls, classes } = this.props;
    return (<div id={id} className="carousel slide" data-ride="carousel" data-interval={interval || 5000}>
      <div className={'carousel-inner ' + (classes.inner || '')} role="listbox">
        { this.getIndicators(children, indicators) }

        {children}

        { this.getControls(controls, id, classes.controls) }
      </div>
    </div>);
  }
}

Carousel.propTypes = {
  id: React.PropTypes.string.isRequired,
  interval: React.PropTypes.number.isRequired,
  children: React.PropTypes.any,
  indicators: React.PropTypes.bool,
  controls: React.PropTypes.bool,
  classes: React.PropTypes.object,
};
