import React from 'react';
import _ from 'lodash';

import Block1 from './block1';
import Block2 from './block2';

export default class ContactSection extends React.Component {
  render() {
    const { block1, block2 } = this.props.data;
    return !_.isEmpty(this.props.data) ? (<div>
      <Block1 data={block1} />
      <Block2 data={block2} />
    </div>) : null;
  }
}

ContactSection.propTypes = {
  data: React.PropTypes.object,
};
