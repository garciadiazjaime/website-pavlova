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
    const { data, item } = this.props;
    const itemInfo = this.getItemInfo(data.items, item);
    return (<div>
      <div className="row">
        <div className="col-sm-6 col-xs-6">
          <h2>Conoce a nuestro staff</h2>
          <List data={data} item={item} />
        </div>
        <div className="col-sm-6 col-xs-6">
          <Show data={itemInfo} />
        </div>
      </div>

    </div>);
  }
}

ListShow.propTypes = {
  data: React.PropTypes.object.isRequired,
  item: React.PropTypes.string,
};
