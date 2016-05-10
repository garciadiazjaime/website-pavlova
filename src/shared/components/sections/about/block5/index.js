/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import SVG from '../../../svg';
import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');


export default class Block4 extends React.Component {

  render() {
    const { titles, paragraphs } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <h2 className={style.title5}>{titles.title1}</h2>
          </div>
          <div className="col-sm-4 col-xs-12">
            <SVG network="circled_diseno" className={style.svg}/>
            <h3 className={style.title4}>{titles.title2}</h3>
            <p className={style.paragraph2} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph1)} />
          </div>
          <div className="col-sm-4 col-xs-12">
            <SVG network="circled_coordinacion" className={style.svg}/>
            <h3 className={style.title4}>{titles.title3}</h3>
            <p className={style.paragraph2} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph2)} />
          </div>
          <div className="col-sm-4 col-xs-12">
            <SVG network="circled_calidad" className={style.svg}/>
            <h3 className={style.title4}>{titles.title4}</h3>
            <p className={style.paragraph2} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph3)} />
          </div>
        </div>
      </div>
    </div>) : null;
  }
}

Block4.propTypes = {
  data: React.PropTypes.object,
};
