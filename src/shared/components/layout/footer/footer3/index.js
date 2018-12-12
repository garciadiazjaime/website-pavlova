/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';

const style = require('./style.scss');
import Powered from './powered';
import SVG from '../../../svg';
import dataSection from './data';

export default class FooterAAA extends React.Component {

  getIcons(data) {
    return data.map((item, index) => {
      return (<Link key={index} to={item.url} className={style.sm_icon} id={item.url} target="_blank">
            <SVG network={item.title} className={style[item.title]}/>
          </Link>);
    });
  }

  render() {
    const { icons } = this.props;
    const { titles, paragraphs, buttons } = dataSection;
    return (<div className={style.footerWrapper}>
      <div className={'container-fluid ' + style.container}>
        <div className="row">
          <div className="col-xs-12">
            <div className={style.footerBrand} />
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3 className={style.title}>{titles.title1}</h3>
            <ul className={style.list}>
              <li>{paragraphs.paragraph1}</li>
              <li>{paragraphs.paragraph2}</li>
              <li>{paragraphs.paragraph3}</li>
              <br />
              <li>{paragraphs.paragraph4}</li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3 className={style.title}>{titles.title2}</h3>
            <p className={style.paragraph}>{paragraphs.paragraph5}</p>
            {this.getIcons(icons)}
            <a className={style.paragraph} href={buttons.button1.href} title={buttons.button1.title} target="_blank">{buttons.button1.title}</a>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3 className={style.title}>{titles.title3}</h3>
            <ul className={style.list}>
              <li><a href={buttons.button2.href} title={buttons.button2.title}>{buttons.button2.title}</a></li>
              <li><a href={buttons.button3.href} title={buttons.button3.title}>{buttons.button3.title}</a></li>
              <li><a href={buttons.button4.href} title={buttons.button4.title}>{buttons.button4.title}</a></li>
              <li><a href={buttons.button5.href} title={buttons.button5.title}>{buttons.button5.title}</a></li>

            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3 className={style.title}>{titles.title4}</h3>
            <ul className={style.list}>
              <li><a href={buttons.button7.href} title={buttons.button7.title} target="_blank">{buttons.button7.title}</a></li>
              <li><a href={buttons.button8.href} title={buttons.button8.title} target="_blank">{buttons.button8.title}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <Powered />
    </div>);
  }
}

FooterAAA.propTypes = {
  icons: React.PropTypes.array,
};
