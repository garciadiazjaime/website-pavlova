import React from 'react';
import { Link } from 'react-router';

const style = require('./style.scss');

export default class SimpleContact extends React.Component {

  render() {
    return (<div className={style.contact_info}>
          <Link to="contacto" title="Contáctanos">
            Contáctanos
          </Link>
          <Link to="mailto:info@mintitmedia.com" title="Contáctanos">
            info@mintitmedia.com
          </Link>
          <Link to="contacto" title="Contáctanos">
            (664)308-2240
          </Link>
          <Link to="https://www.google.com.mx/maps/@32.5019264,-116.9870849,17.44z?hl=en" title="Contáctanos">
            Calle Sacramento #4872, Col. El Paraíso, Tijuana B. C. México
          </Link>
    </div>);
  }
}
