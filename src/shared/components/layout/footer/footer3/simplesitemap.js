import React from 'react';
import { Link } from 'react-router';

const style = require('./style.scss');


export default class SiteMap extends React.Component {

  getItems(data) {
    const items = data.map((item, index) => {
      const children = item.children ? this.getItems(item.children) : null;

      return (<li key={index}>
        <Link to={item.url}>{item.title}</Link>
        { children }
      </li>);
    }, this);
    return (<ul className={style.sitemap}>{items}</ul>);
  }

  render() {
    return this.getItems(this.props.data);
  }
}

SiteMap.propTypes = {
  data: React.PropTypes.array.isRequired,
};
