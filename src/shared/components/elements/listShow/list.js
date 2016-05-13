/* eslint max-len: [2, 500, 4] */

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import SVG from '../../svg';
import getSlug from '../../../utils/slug';

export default class List extends React.Component {

  renderItems(data, sectionUrl, itemUrl, style) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        const slug = getSlug(item.title);
        let className = '';
        if (!itemUrl && index === 0) {
          className = style.active;
        } else if (slug === itemUrl) {
          className = style.active;
        }
        return (<div key={index} className={style.item}>
          <Link className={className} to={'/' + sectionUrl + '/' + slug} title={item.title}>{item.title}<SVG network="arrow_right" className={style.svg}/></Link>
        </div>);
      });
    }
  }

  render() {
    const { data, item, style } = this.props;
    return (<div>
      {this.renderItems(data.items, data.sectionUrl, item, style)}
    </div>);
  }
}

List.propTypes = {
  data: React.PropTypes.object.isRequired,
  item: React.PropTypes.string,
  style: React.PropTypes.object,
};
