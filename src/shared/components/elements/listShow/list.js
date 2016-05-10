/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import getSlug from '../../../utils/slug';

export default class List extends React.Component {

  renderItems(data, sectionUrl, itemUrl) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const slug = getSlug(item.title);
        const className = slug === itemUrl ? 'active' : '';
        return (<div key={index}>
          <Link className={className} to={'/' + sectionUrl + '/' + slug} title={item.title}>{item.title}</Link>
        </div>);
      });
    }
  }

  render() {
    const { data, item } = this.props;
    return (<div>
      {this.renderItems(data.items, data.sectionUrl, item)}
    </div>);
  }
}

List.propTypes = {
  data: React.PropTypes.object.isRequired,
  item: React.PropTypes.string,
};
