/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
import { normalizeImageUrl } from '../../../utils/imageUtil';
import getSlug from '../../../utils/slug';


export default class Show extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        if (_.isArray(item)) {
          const bullets = item.map((line, index2) => { return (<li key={index2} dangerouslySetInnerHTML={{ __html: line }} />); });
          return (<ul key={index}>
            { bullets }
          </ul>);
        }
        return (<p key={index} dangerouslySetInnerHTML={{ __html: item }} />);
      });
    }
  }

  renderIds(data) {
    return data.map((item, index) => {
      const id = getSlug(item.title);
      return (<span id={id} key={index} />);
    });
  }

  render() {
    const { data, style, items } = this.props;
    const imgUrl = normalizeImageUrl(data.image);
    return (<div>
      {this.renderIds(items)}
      <div className="row">
        <div className="col-sm-6 col-xs-12">
          <img className={style.image} src={imgUrl} alt={data.title} />
        </div>
        <div className="col-sm-6 col-xs-12">
          <h3 className={style.subtitle}>{data.subtitle}</h3>
          <p className={style.content}>{data.intro}</p>
        </div>
        <div className="col-xs-12">
        <div className={style.content}>
          {this.renderItems(data.content)}
        </div>
        </div>
      </div>
    </div>);
  }
}

Show.propTypes = {
  data: React.PropTypes.object.isRequired,
  style: React.PropTypes.object,
  items: React.PropTypes.array,
};
