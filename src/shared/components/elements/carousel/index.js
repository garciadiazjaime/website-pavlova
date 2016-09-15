/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import SVG from '../../svg';

export default class Carousel extends React.Component {

  getIndicators(sliderId, isVisible, data, indicatorClass) {
    let indicators = [];
    if (isVisible !== false && _.isArray(data) && data.length) {
      const activeClassName = indicatorClass && indicatorClass.active ? 'active ' + indicatorClass.active : 'active';
      indicators = data.map((item, index) => {
        const className = index === 0 ? activeClassName : '';
        return (<li data-target={'#' + sliderId} data-slide-to={index} className={className} key={index} />);
      });
      return (<ol className={'carousel-indicators ' + (indicatorClass.base || '')}>
        {indicators}
      </ol>);
    }
    return null;
  }


  getControls(sliderId, isVisible, classes) {
    const { base, prev, next, arrow } = classes;
    if (isVisible !== false) {
      return (<div>
          <a className={'left carousel-control ' + (base || '') + ' ' + (prev || '')} href={'#' + sliderId} role="button" data-slide="prev">
          <SVG network="carousel_left" className={arrow}/>
          <span className="sr-only">Previous</span>
        </a>
        <a className={'right carousel-control ' + (base || '') + ' ' + (next || '')} href={'#' + sliderId} role="button" data-slide="next">
          <SVG network="carousel_right" className={arrow}/>
          <span className="sr-only">Next</span>
        </a>
      </div>);
    }
    return null;
  }

  render() {
    const { id, interval, children, indicators, controls, classes } = this.props;
    return (<div id={id} className="carousel slide" data-ride="carousel" data-interval={interval || 8000}>
      { this.getIndicators(id, indicators, children, classes.indicator) }
      <div className={'carousel-inner ' + (classes.inner || '')} role="listbox">
        {children}
      </div>
      { this.getControls(id, controls, classes.controls) }
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
