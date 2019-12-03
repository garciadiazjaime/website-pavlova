/* eslint max-len: [2, 500, 4] */
import React from 'react';

import { getImageBackground } from '../../../../utils/imageUtil';
const style = require('./style.scss');

function getData() {
  return {
    images: {
      image1: {
        id: 7,
        alt: 'STAFF',
        src: '/images/escuela/banner-staff.jpg',
        block: 9,
      },
    },
    titles: { title1: 'STAFF' },
  };
}

export default class Block3 extends React.Component {

  render() {
    const { titles, images } = getData();
    const divStyle = getImageBackground(images.image1);

    return (<div style={divStyle} className={style.mainbannerE}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <h2 className={style.titleE}>{titles.title1}</h2>
          </div>
        </div>
      </div>
    </div>);
  }
}
