import React from 'react';
import _ from 'lodash';
import List from './list';
import Show from './show';
import getSlug from '../../../utils/slug';

export default class ListShow extends React.Component {

  getItemInfo(data, itemUrl) {
    if (_.isArray(data) && data.length) {
      if (!itemUrl) {
        return data[0];
      }
      return _.find(data, (item) => {
        return getSlug(item.title) === itemUrl;
      });
    }
    return null;
  }

  render() {
    const { data, item, style } = this.props;
    const itemInfo = this.getItemInfo(data.items, item);
    return (<div>
      <div className="row">
        <div className="col-sm-5 col-xs-12">
          <h2 className={style.title}>Conoce a nuestro staff</h2>
          <List data={data} item={item} style={style} />
        </div>
        <div className="col-sm-6 col-sm-offset-1 col-xs-12">
          <Show items={data.items} data={itemInfo} style={style} />
        </div>
      </div>
    </div>);
  }
}

ListShow.propTypes = {
  data: React.PropTypes.object.isRequired,
  item: React.PropTypes.string,
  style: React.PropTypes.object,
};
