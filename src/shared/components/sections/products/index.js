/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import Block1 from './block1';
import Block2 from '../about/block1';
import Block3 from './block3';
import Block4 from './block4';
const style = require('./style.scss');

export default class ProductsSection extends React.Component {

  render() {
    const { block1, block2, block3, block4, block5, block6 } = this.props.data;
    const block2Styles = {
      wrapper: style.wrapper,
    };
    return !_.isEmpty(this.props.data) ? (<div>
      <Block1 data={block1} />
      <Block2 data={block2} classes={'col-xs-12 col-sm-8 col-sm-offset-2'} style={block2Styles}/>
      <Block3 data={block3} sliderId="main-carousel-livingroom" />
      <Block3 data={block4} sliderId="main-carousel-dining" />
      <Block3 data={block5} sliderId="main-carousel-bedroom" />
      <Block4 data={block6} />
    </div>) : null;
  }
}

ProductsSection.propTypes = {
  data: React.PropTypes.object,
};
