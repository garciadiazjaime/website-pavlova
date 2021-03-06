/* eslint max-len: [2, 500, 4] */
import React from 'react';

import SVG from '../../../svg';
import { getImageBackground } from '../../../../utils/imageUtil';
import sanitizeUtil from '../../../../utils/sanitize';
const style = require('./style.scss');

function getData() {
  return {
    images: {
      image1: {
        id: 3,
        alt: 'escuela',
        src:
            'https://www.dropbox.com/s/jttxmpw4gtlttan/Img-banner-nosotros.jpg?dl=0',
        block: 5,
      },
    },
    paragraphs: { paragraph1: 'Prestigio desde 1987' },
    titles: { title1: 'ESCUELA' },
  };
}
export default class Block1 extends React.Component {

  render() {
    const { titles, paragraphs } = getData();
    const divStyle = getImageBackground('/images/escuela/escuela-header.jpg');
    return (<div style={divStyle} className={style.mainbanner}>
      <div className={style.transparency}></div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-sm-offset-3">
            <h2 className={style.title}>{titles.title1}</h2>
            <p className={style.paragraph} dangerouslySetInnerHTML={sanitizeUtil(paragraphs.paragraph1)} />
            <SVG network="arrow_down" className={style.svg}/>
          </div>
        </div>
      </div>
    </div>);
  }
}
