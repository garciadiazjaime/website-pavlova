import React from 'react';
import _ from 'lodash';


export default class Show extends React.Component {

  renderItems(data) {
    if (_.isArray(data) && data.length) {
      return data.map((item, index) => {
        return (<p key={index}>{item}</p>);
      });
    }
  }

  render() {
    const { data, style } = this.props;
    return (<div>
      <div className="row">
        <div className="col-sm-6 col-xs-12">
          <img className={style.image} src={data.image} alt={data.title} />
        </div>
        <div className="col-sm-6 col-xs-12">
          <h3 className={style.subtitle}>{data.subtitle}</h3>
          <p className={style.intro}>{data.intro}</p>
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
};
