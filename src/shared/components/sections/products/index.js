/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import Block1 from './block1';
import Block2 from '../home/block2';
import Block3 from './block3';
import Block4 from './block3';
import Block5 from './block3';
import Block8 from '../about/block8';

const balletData = require('./balletData');
const jazzData = require('./jazzData');
const flamencoData = require('./flamencoData');

export default class ProductsSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      types: ['SLIDER_CONTENT', 'CONTENT_SLIDER', 'SLIDER_CONTENT', 'CONTENT_SLIDER', 'SLIDER_CONTENT'],
    };
  }

  componentDidMount() {
    /*eslint-disable */
    this.setState({
      types: ['CONTENT_SLIDER', 'CONTENT_SLIDER', 'CONTENT_SLIDER', 'CONTENT_SLIDER', 'CONTENT_SLIDER'],
    });
    /*eslint-enable */
  }

  render() {
    const { block1, block2, block8 } = this.props.data;
    const block3Variations = {
      variation1: 'ballet',
    };
    const block4Variations = {
      variation1: 'jazz',
    };
    const block5Variations = {
      variation1: 'flamenco',
    };
    const { types } = this.state;

    return !_.isEmpty(this.props.data) ? (<div>
      <Block1 data={block1} />
      <Block2 data={block2} />
      <Block3 data={balletData} type={types[0]} variations={block3Variations} />
      <Block4 data={jazzData} type={types[1]} variations={block4Variations} />
      <Block5 data={flamencoData} type={types[2]} variations={block5Variations} />
      <Block8 data={block8} />
    </div>) : null;
  }
}

ProductsSection.propTypes = {
  data: React.PropTypes.object,
};
