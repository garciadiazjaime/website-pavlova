import React from 'react';
import _ from 'lodash';

import Block1 from './block1';
import Block2 from './block2';
import Block3 from './block3';
import Block4 from './block4';
import Block5 from './block3';
import Block6 from './block6';
import Block7 from './block7';
import Block8 from './block8';
import dataStaff from './data';
// const style = require('./style.scss');


export default class AboutSection extends React.Component {

  render() {
    const { params, data } = this.props;
    const { block1, block2, block3, block4, block5, block7, block8 } = data;
    const { showListItem } = params;
    const block3Variations = {
      variation1: 'class1',
    };
    const block5Variations = {
      variation1: 'class1',
    };

    return !_.isEmpty(this.props.data) ? (<div>
      <Block1 data={block1} />
      <Block2 data={block2} />
      <Block3 data={block3} variations={block3Variations} />
      <Block4 data={block4} />
      <Block5 data={block5} variations={block5Variations} />
      <Block6 data={dataStaff} showListItem={showListItem} />
      <Block7 data={block7} />
      <Block8 data={block8} />
    </div>) : null;
  }
}

AboutSection.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.any,
};
