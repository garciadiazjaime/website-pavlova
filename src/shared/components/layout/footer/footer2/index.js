import React from 'react';
import { Link } from 'react-router';

const style = require('./style.scss');
import Powered from './powered';
import SVG from '../../../svg';

export default class FooterAAA extends React.Component {

  getIcons(data) {
    return data.map((item, index) => {
      return (<div key={index} className="col-xs-12">
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
          <div className="col-xs-12">
            <div className={style.footerBrand} />
          </div>
          <div className="col-xs-12">
            <div className="row">
              <p>
                Todos los derechos reservados &copy; Notable
              </p>
              {this.getIcons(this.props.icons)}
            </div>
          </div>
          <Powered />
        </div>
      </div>
    </div>);
  }
}

FooterAAA.propTypes = {
  items: React.PropTypes.array.isRequired,
  addresses: React.PropTypes.array,
  icons: React.PropTypes.array,
};
