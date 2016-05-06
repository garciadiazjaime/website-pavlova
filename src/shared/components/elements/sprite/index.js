/* eslint max-len: [2, 500, 4] */
/* eslint react/no-did-mount-set-state: 0 */
import React from 'react';

export default class Sprite extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    const newData = {};
    const { data } = this.props;
    let tmp = data.backgroundSize.split(' ');

    const sprite = {
      width: this.sanitize(tmp[0]),
      height: this.sanitize(tmp[1]),
    };

    const image = {
      width: this.sanitize(data.width),
      height: this.sanitize(data.height),
    };

    tmp = data.backgroundPosition.split(' ');
    const position = {
      x: this.sanitize(tmp[0]),
      y: this.sanitize(tmp[1]),
    };

    const container = {
      width: this.refs.spriteContainer.getDOMNode().offsetWidth,
      height: this.refs.spriteContainer.getDOMNode().offsetHeight,
    };

    const ratio = container.width / image.width;
    const backgroundSize = sprite.width * ratio;
    newData.backgroundImage = data.backgroundImage;

    // sets container dimensions if they have not been specified.
    if (container.width === 0) {
      container.width = image.width * ratio;
      newData.width = image.width * ratio;
    }
    if (container.height === 0) {
      container.height = image.height * ratio;
      newData.height = container.height;
    }

    // Calculates background-size based on the ratio.
    newData.backgroundSize = backgroundSize;

    // Adjust background position to comply with the new background size.
    // This process depends on whether the height of the container is bigger than the new calculated height of the sprite.
    if (container.height < image.height * ratio) {
      const yDisplacement = (image.height * ratio - container.height) / 2;
      position.y = position.y * ratio - yDisplacement;
      newData.backgroundPosition = position.x * ratio + ' ' + position.y;
    } else if (container.height >= image.height * ratio) {
      const ratio2 = container.height / image.height;
      const xDisplacement = (image.width * ratio2 - container.width) / 2;
      position.x = position.x * ratio2 - xDisplacement;
      newData.backgroundSize = sprite.width * ratio2;
      newData.backgroundPosition = position.x + ' ' + position.y * ratio2;
    }

    this.setState({
      data: newData,
    });
  }

  sanitize(string) {
    return parseInt(string.replace('px', ''), 10);
  }

  render() {
    const { data } = this.state;
    return (<div ref="spriteContainer" style={data}></div>);
  }
}

Sprite.propTypes = {
  data: React.PropTypes.object.isRequired,
};
