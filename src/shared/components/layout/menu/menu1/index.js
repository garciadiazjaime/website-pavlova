import React from 'react';
import { Link } from 'react-router';

import SVG from '../../../svg';

const style = require('./style.scss');


export default class MainMenu extends React.Component {

  getItems(data) {
    return data.map((item, index) => {
      const { title, url } = item;
      const elementID = url.replace('/', '');
      const className = style.navbarNavAnchor;
      const { onClick } = this.props;
      return (
        <li key={index}>
          <Link to={url} className={className} id={elementID} onClick={onClick}>{title}</Link>
        </li>
      );
    });
  }

  getIcons(data) {
    return data.map((item, index) => {
      return (<li key={index}>
          <Link to={item.url} className={style.sm_icon} id={item.url} target="_blank">
            <SVG network={item.title} className={style[item.title]}/>
          </Link>
        </li>);
    });
  }

  render() {
    /*eslint-disable */
    return (<div className={style.navbarWrapper}>
      <nav className={style.navbarDefault + ' navbar navbar navbar-fixed-top'} id="menu_wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className={style.navbarHeader + ' navbar-header'}>
              <button type="button" className={'navbar-toggle collapsed menu_trigger ' + style.toggleButton} data-toggle="collapse" data-target="#mainmenu" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className={'icon-bar ' + style.iconBar}></span>
                <span className={'icon-bar ' + style.iconBar}></span>
                <span className={'icon-bar ' + style.iconBar}></span>
              </button>
              <Link className={style.navbarBrand + ' navbar-brand'} to="/inicio" />
            </div>

            <div className={style.navbarCollapse + ' collapse navbar-collapse'} id='mainmenu'>
              <ul className={style.navbarIcons}>
                {this.getIcons(this.props.icons)}
              </ul>
              <ul className={style.navbarNav + ' nav navbar-nav'}>
                {this.getItems(this.props.items)}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>);
    /*eslint-enable */
  }
}

MainMenu.propTypes = {
  items: React.PropTypes.array.isRequired,
  icons: React.PropTypes.array,
  location: React.PropTypes.any,
  onClick: React.PropTypes.func.isRequired,
};
