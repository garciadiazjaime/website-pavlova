import React from 'react';

import Block1 from './block1';
import Block2 from './block2';
import Block3 from './block3';
import Block4 from './block4';
import Block5 from './block5';
import Block6 from './block6';
import Block7 from './block7';
import Block8 from './block8';

const data = require('./dataDB');


export default class AboutSection extends React.Component {

  render() {
    const { params } = this.props;
    const { block3, block4, block7, block8 } = data;
    const { showListItem } = params;

    return (<div>
      <Block1 />
      <Block2 />
      <Block3 data={block3} />
      <Block4 data={block4} />
      <Block5 />
      <Block6 showListItem={showListItem} />
      <Block7 data={block7} />
      <Block8 data={block8} />
    </div>);
  }
}

AboutSection.propTypes = {
  params: React.PropTypes.any,
};
