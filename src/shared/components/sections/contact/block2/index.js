/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';
const style = require('./style.scss');

import Form from '../forms/form1';


export default class Block2 extends React.Component {

  render() {
    const { titles, paragraphs, buttons } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <h2 className={style.title}>{titles.title1}</h2>
            <Form />
          </div>
          <div className="col-sm-6 col-xs-12">
            <h2 className={style.title}>{titles.title2}</h2>
            <p className={style.paragraph}>{paragraphs.paragraph1}</p>
            <p className={style.paragraph}>{paragraphs.paragraph2}</p>
            <a className={style.gmap} href={buttons.button1.href} target="_blank">{buttons.button1.title}</a>
            <p className={style.paragraph}>{paragraphs.paragraph3}</p>

            <h2 className={style.title}>{titles.title3}</h2>
            <p className={style.paragraph}>{paragraphs.paragraph4}</p>
            <a className={style.paragraph} href={buttons.button2.href} target="_blank">{buttons.button2.title}</a>
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block2.propTypes = {
  data: React.PropTypes.object,
};
