/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import Block1 from './block1';
import Block2 from './block2';
import Block3 from '../home/block3';
import Block4 from './block4';
const style = require('./style.scss');


export default class AboutSection extends React.Component {

  render() {
    const { block1, block2, block3, block4 } = this.props.data;
    const block3Styles = {
      title1: style.title5,
      paragraph1: style.paragraph4,
    };
    const block2classes = 'col-xs-12 col-sm-6 col-sm-offset-3';
    const classes = {
      svg: style.svg,
      col1: 'col-xs-12 col-sm-6',
      col2: 'col-xs-12 col-sm-6',
    };
    return !_.isEmpty(this.props.data) ? (<div>
      <Block1 data={block1} classes={block2classes} />
      <Block2 data={block2} classes={classes}/>
      <Block3 data={block3} style={block3Styles} />
      <Block4 data={block4} />
    </div>) : null;
  }
}

AboutSection.propTypes = {
  data: React.PropTypes.object,
};
