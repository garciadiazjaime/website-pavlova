import React from 'react';

import Block1 from './block1';
import Block2 from './block2';
import Block3 from './block3';
import Block4 from './block4';
import Block5 from './block5';

const data = require('./data');


export default class HomeSection extends React.Component {

  render() {
    const { block1, block2, block3, block4 } = data;

    return (<div>
      <Block1 data={block1} />
      <Block2 data={block2} />
      <Block3 data={block3} />
      <Block4 data={block4} />
      <Block5 />
    </div>);
  }
}
