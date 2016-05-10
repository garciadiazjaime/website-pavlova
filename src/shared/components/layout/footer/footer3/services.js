import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
// import dbServices from '../../../sections/services/db';

const style = require('./style.scss');


export default class Services extends React.Component {

  getServicesData(data) {
    const getItems = (children) => {
      let i = 0;
      const len = children.length;
      for (; i < len; i++) {
        if (children[i].type.toUpperCase() === 'LIST') {
          return children[i].children;
        }
      }
    };

    if (_.isArray(data) && data.length) {
      return data.map((item) => {
        return {
          href: item.href,
          title: item.title,
          items: getItems(item.children),
        };
      });
    }
    return null;
  }

  renderServices(data) {
    const renderServiceChildren = (href, items) => {
      const className = items.length > 5 ? 'col-xs-12 col-md-6' : 'col-sm-12';
      return items.map((service, index) => {
        return (<div className={className + ' ' + style.serviceElement} key={index}>
          <div className="row">
            <Link to={href + service.href} title={service.title}>
            {service.title}
            </Link>
          </div>
        </div>);
      });
    };
    const servicesEl = data.map((item, index) => {
      const childrenEl = renderServiceChildren(item.href, item.items);
      return (<div className="col-sm-4" key={index}>
        <Link className={style.serviceTitle} to={item.href} title={item.title}>
          {item.title}
        </Link>
        {childrenEl}
      </div>);
    });
    return (<div className="row">{servicesEl}</div>);
  }

  render() {
    const servicesData = []; // this.getServicesData(dbServices);

    return (<div>
      {this.renderServices(servicesData)}
    </div>);
  }
}
