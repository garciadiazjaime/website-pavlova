/* eslint max-len: [2, 500, 4] */
import React from 'react';
const style = require('./style.scss');


export default class Block5 extends React.Component {


  render() {
    return (<div>
      <div className={'container-fluid ' + style.wrapper}>
        <div className="row">
          <div className="col-sm-12 col-xs-12">
            <h2 className={style.title}>Recorrido Virtual Pavlova Escuela de Danza</h2>
            <p className={style.paragraph}>¡Conoce nuestras instalaciones!</p>
            <iframe src="https://www.google.com/maps/embed?pb=!4v1541182910595!6m8!1m7!1sCAoSLEFGMVFpcE5qXzV5WUk1bnN4OHhtYUdfSDkzVGExa2RDMzRELTZWZXp4aldF!2m2!1d32.504544235447!2d-116.9994770827!3f34.500004!4f0!5f0.7820865974627469" width="100%" height="450" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      </div>
    </div>);
  }
}

Block5.propTypes = {
  data: React.PropTypes.object,
  classes: React.PropTypes.object,
};
