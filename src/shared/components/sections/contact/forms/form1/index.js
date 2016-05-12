/* eslint max-len: [2, 600, 4] */

import React from 'react';
import _ from 'lodash';
import restClient from '../../../../../../server/helpers/rest-client';
const style = require('./style.scss');
import SVG from '../../../../svg';

export default class Form1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: this.getInitialFormState(),
      requiredFields: this.getRequiredFields(this.getInitialFormState()),
      showLoading: false,
    };

    this.submitFormHandler = this.submitFormHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(event) {
    const formData = this.state.formData;
    const { name, value } = event.target;
    formData[name].value = value;
    this.setState({ formData });
  }

  getRequiredFields(data) {
    const fields = {};
    _.map(data, (item, index) => {
      if (item.require) {
        fields[index] = item;
      }
    });
    return fields;
  }

  getInitialFormState() {
    return {
      name: {
        title: 'Nombre',
        value: '',
        require: true,
      },
      email: {
        title: 'Correo',
        value: '',
        require: true,
      },
      tel: {
        title: 'Tel&eacute;fono',
        value: '',
        require: true,
      },
      message: {
        title: 'Mensaje',
        value: '',
        require: true,
      },
    };
  }

  getHTMLMessage(data) {
    const response = _.map(data, (item) => {
      return item.title + ': ' + item.value + '<br />';
    });
    return response.join('');
  }

  validateForm(data, requiredFields) {
    let response = true;
    _.map(requiredFields, (item, property) => {
      const labelElement = $('#lab_' + property);
      if (!data.hasOwnProperty(property) || !data[property].value.length) {
        if (response) {
          response = false;
        }
        labelElement.addClass(style.errorCSSClass);
      } else {
        labelElement.removeClass(style.errorCSSClass);
      }
    });
    return response;
  }

  /*
  Handler function to validate form and send data
  */
  submitFormHandler(event) {
    event.preventDefault();
    const formData = this.state.formData;
    const isFormValid = this.validateForm(formData, this.state.requiredFields);
    const msgElement = $('#msg');
    msgElement.removeClass(style.errorCSSClass + ' ' + style.successCSSClass);
    msgElement.html('');

    if (isFormValid) {
      this.setState({
        showLoading: true,
      });
      msgElement.html('Enviando...');
      const _this = this;
      const html = this.getHTMLMessage(formData);
      const data = {
        fromname: formData.name.value,
        replyto: formData.email.value,
        subject: 'Forma de Contacto Website: NOTABLE',
        html,
      };

      restClient({
        path: '/api/send_email',
        method: 'POST',
        entity: data,
      }).then((response) => {
        const state = {
          showLoading: false,
        };
        if (response.entity.status) {
          state.formData = _this.getInitialFormState();
        }
        _this.setState(state);
        msgElement.addClass(response.entity.status ? style.successCSSClass : style.errorCSSClass);
        msgElement.html(response.entity.status ?
          'Información enviada de manera exitosa, gracias.' :
          'Lo sentimos, favor de intentar más tarde.');
      });
    } else {
      msgElement.addClass(style.errorCSSClass);
    }
    msgElement.html(!isFormValid ? 'Favor de llenar los campos en rojo.' : '');
  }

  render() {
    const { name, email, tel, message } = this.state.formData;

    return (<form id="form" className={style.form + ' form-horizontal'}>
        <div className={'form-group ' + style.formGroup}>
          <div className="col-xs-2">
            <label id="lab_name" className="row control-label">Nombre:</label>
          </div>
          <div className="col-xs-10">
            <input type="text" name="name" onChange={this.onChangeHandler} value={name.value} />
          </div>
          <div className={style.borderBottom2}></div>
        </div>

        <div className={'form-group ' + style.formGroup}>
          <div className="col-xs-2">
            <label id="lab_email" className="row control-label">Correo:</label>
          </div>
          <div className="col-xs-10">
            <input type="text" name="email" onChange={this.onChangeHandler} value={email.value}/>
          </div>
          <div className={style.borderBottom2}></div>
        </div>

        <div className={'form-group ' + style.formGroup}>
          <div className="col-xs-2">
            <label id="lab_tel" className="row control-label">Teléfono:</label>
          </div>
          <div className="col-xs-10">
            <input type="tel" name="tel" onChange={this.onChangeHandler} value={tel.value}/>
          </div>
          <div className={style.borderBottom2}></div>
        </div>

        <div className={'form-group ' + style.formGroup}>
          <div className="col-xs-2">
            <label id="lab_message" className="row control-label">Mensaje:</label>
          </div>
          <div className="col-sm-12 col-sm-offset-0">
            <textarea type="text" name="message" onChange={this.onChangeHandler} value={message.value} />
          </div>
          <div className={style.borderBottom2}></div>
        </div>

        <div><span id="msg"></span></div>
        <div>
          {
            this.state.showLoading ?
              (<span className={style.loader}>Cargando</span>)
              : null
          }
        </div>
        <div className="pull-right">
          <a className={style.submit} onClick={this.submitFormHandler}>
            ENVIAR
            <SVG network="arrow_right" className={style.svg}/>
          </a>
        </div>
      </form>
    );
  }
}
