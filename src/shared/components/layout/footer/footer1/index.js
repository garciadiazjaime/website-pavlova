import React from 'react';
import { Link } from 'react-router';

const style = require('./style.scss');
import Powered from './powered';
import SimpleContact from './simplecontact';
import SiteMap from './simplesitemap';
import SVG from '../../../svg';

export default class FooterAAA extends React.Component {

  getIcons(data) {
    return data.map((item, index) => {
      return (<div key={index} className="col-xs-6 col-md-3">
          <Link to={item.url} className={style.sm_icon} id={item.url} target="_blank">
            <SVG network={item.title} className={style[item.title]}/>
          </Link>
        </div>);
    });
  }

  render() {
    return (<div className={style.footerWrapper}>
      <div className={'container-fluid ' + style.container}>
        <div className="row">
          <div className="col-xs-12 col-md-2">
            <SiteMap data={this.props.items} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <SimpleContact />
          </div>
          <div className="col-xs-12 col-sm-4">
            <div className="row">
              {this.getIcons(this.props.icons)}
            </div>
          </div>
        </div>
      </div>
      <Powered />
    </div>);
  }
}

FooterAAA.propTypes = {
  items: React.PropTypes.array.isRequired,
  addresses: React.PropTypes.array,
  icons: React.PropTypes.array,
};
