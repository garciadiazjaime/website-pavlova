import React from 'react';

import Block1 from './block1';
import Block2 from './block2';

const data = require('./data');

export default class ContactSection extends React.Component {

  render() {
    const { block1, block2 } = data;
    return (<div>
      <Block1 data={block1} />
      <Block2 data={block2} />
    </div>);
  }
}
