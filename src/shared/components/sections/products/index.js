/* eslint max-len: [2, 500, 4] */
import React from 'react';

import Block1 from './block1';
import Block2 from '../home/block2';
import Block3 from './block3';
import Block4 from './block3';
import Block5 from './block3';
import Block6 from './block3';
import Block8 from '../about/block8';

const balletData = require('./balletData');
const jazzData = require('./jazzData');
const flamencoData = require('./flamencoData');
const hipHopData = require('./hipHopData');

const data = require('./data');

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
    const { block8 } = data;
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
      variation1: 'hiphop',
    };
    const { types } = this.state;

    return (<div>
      <Block1 />
      <Block2 />
      <Block3 data={balletData} type={types[0]} variations={block3Variations} />
      <Block4 data={jazzData} type={types[1]} variations={block4Variations} />
      <Block5 data={flamencoData} type={types[2]} variations={block5Variations} />
      <Block6 data={hipHopData} type={types[2]} variations={block6Variations} />
      <Block8 data={block8} />
    </div>);
  }
}
