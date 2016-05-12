/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import Block1 from '../about/block1';
import Block2 from '../home/block2';
import Block3 from './block3';
import Block4 from './block3';
import Block5 from './block3';
import Block6 from './block3';
import Block7 from './block3';
import Block8 from '../about/block8';
// const style = require('./style.scss');

export default class ProductsSection extends React.Component {

  render() {
    const { block1, block2, block3, block4, block5, block6, block7, block8 } = this.props.data;
    const block3Variations = {
      variation1: 'ballet',
    };
    const block4Variations = {
      variation1: 'jazz',
    };
    const block5Variations = {
      variation1: 'flamenco',
    };
    const block6Variations = {
      variation1: 'cardioDanza',
    };
    const block7Variations = {
      variation1: 'barre',
    };

    return !_.isEmpty(this.props.data) ? (<div>
      <Block1 data={block1} />
      <Block2 data={block2} />
      <Block3 data={block3} type={'SLIDER_CONTENT'} variations={block3Variations} />
      <Block4 data={block4} type={'CONTENT_SLIDER'} variations={block4Variations} />
      <Block5 data={block5} type={'SLIDER_CONTENT'} variations={block5Variations} />
      <Block6 data={block6} type={'CONTENT_SLIDER'} variations={block6Variations} />
      <Block7 data={block7} type={'SLIDER_CONTENT'} variations={block7Variations} />
      <Block8 data={block8} />
    </div>) : null;
  }
}

ProductsSection.propTypes = {
  data: React.PropTypes.object,
};
