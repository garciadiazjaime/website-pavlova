/* eslint max-len: [2, 500, 4] */
import React from 'react';

export default class SVG extends React.Component {
  renderItems(network, className) {
    switch (network) {
      case 'facebook':
        /*eslint-disable */
        return (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" className={className}>
          <circle cx="15" cy="15" r="15"/>
          <path transform="scale(.8) translate(4, 4)" d="M16.6 25.1v-9.2h3.2l0.5-3.6h-3.7v-2.3c0-1 0.3-1.7 1.9-1.7l2 0V5.1c-0.3 0-1.5-0.1-2.9-0.1 -2.9 0-4.8 1.7-4.8 4.7v2.6H9.5v3.6h3.2v9.2H16.6z"/>
        </svg>);
        break;
      case 'twitter':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className={className}>
          <circle cx="15" cy="15" r="15"/>
          <path d="M23.5 9.7c-0.6 0.3-1.3 0.5-2 0.5 0.7-0.4 1.3-1.1 1.5-1.9 -0.7 0.4-1.4 0.7-2.2 0.8 -0.6-0.7-1.5-1.1-2.5-1.1 -1.9 0-3.5 1.6-3.5 3.5 0 0.3 0 0.5 0.1 0.8 -2.9-0.1-5.5-1.5-7.2-3.6 -0.3 0.5-0.5 1.1-0.5 1.8 0 1.2 0.6 2.3 1.6 2.9 -0.6 0-1.1-0.2-1.6-0.4 0 0 0 0 0 0 0 1.7 1.2 3.1 2.8 3.4 -0.3 0.1-0.6 0.1-0.9 0.1 -0.2 0-0.4 0-0.7-0.1 0.4 1.4 1.7 2.4 3.3 2.4 -1.2 0.9-2.7 1.5-4.3 1.5 -0.3 0-0.6 0-0.8 0 1.5 1 3.4 1.6 5.3 1.6 6.4 0 9.9-5.3 9.9-9.9 0-0.1 0-0.3 0-0.4C22.4 11 23 10.4 23.5 9.7z"/>
        </svg>);
        break;
      case 'pinterest':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className={className}>
          <circle className={this.props.background} cx="15" cy="15" r="15"/>
          <path d="M14.4 18.1c-0.5 2.6-1.1 5.1-2.9 6.4 -0.6-4 0.8-6.9 1.5-10.1 -1.1-1.8 0.1-5.5 2.4-4.6 2.8 1.1-2.4 6.8 1.1 7.5 3.7 0.8 5.2-6.4 2.9-8.8 -3.3-3.4-9.7-0.1-8.9 4.8 0.2 1.2 1.4 1.5 0.5 3.2 -2.1-0.5-2.8-2.1-2.7-4.4 0.1-3.7 3.3-6.2 6.5-6.6 4-0.4 7.8 1.5 8.3 5.2 0.6 4.2-1.8 8.8-6.1 8.5C15.8 19.2 15.4 18.6 14.4 18.1"/>
        </svg>);
        break;
      case 'instagram':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className={className}>
          <circle cx="15" cy="15" r="15"/>
          <path d="M20.6 7H9.4c-1.3 0-2.4 0.9-2.4 2.1v11.8c0 1.2 1.1 2.1 2.4 2.1h11.3c1.3 0 2.4-0.9 2.4-2.1V9.1C23 7.9 22 7 20.6 7zM18.6 9.2c0-0.3 0.2-0.5 0.5-0.5h1.7c0.3 0 0.5 0.2 0.5 0.5v1.7c0 0.3-0.2 0.5-0.5 0.5h-1.7c-0.3 0-0.5-0.2-0.5-0.5V9.2zM17.7 11.7v0c0 0 0 0 0 0H17.7zM14.9 12c2 0 3.5 1.6 3.5 3.5 0 2-1.6 3.5-3.5 3.5 -2 0-3.5-1.6-3.5-3.5C11.4 13.6 13 12 14.9 12zM22 20.7c0 0.8-0.6 1.4-1.4 1.4H9.3c-0.8 0-1.4-0.6-1.4-1.4V13.3h2.9c-0.3 0.7-0.5 1.4-0.5 2.2 0 2.6 2.1 4.7 4.7 4.7 2.6 0 4.7-2.1 4.7-4.7 0-0.7-0.2-1.4-0.5-2h2.8V20.7z"/>
        </svg>);
        break;
      case 'brand':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="27" height="29" viewBox="0 0 26.8 29.1" className={className}>
            <path d="M10.7 0v12L0 5.3v13.7l1.4 0.9v-2.3l0 0V7.8l9.3 5.9v0l3.9 2.5v10.4 0l0 1.7 1.4 0.9v-12.1l10.7 6.8v-13.8L10.7 0zM25.4 21.3l-9.3-5.9 -3.9-2.5V2.5l13.2 8.3V21.3z" fill="#c59f67"/>
          </svg>);
        break;
      case 'double_arrow_down':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 14.6 19.9" className={className}>
          <polygon points="7.3 8.7 0 1.4 1.4 0 7.3 5.9 13.2 0 14.6 1.4 " fill="#FFF"/>
          <polygon points="7.3 19.9 0 12.6 1.4 11.2 7.3 17.1 13.2 11.2 14.6 12.6 " fill="#FFF"/></svg>);
        break;
      case 'circled_brand':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="94" height="94" viewBox="0 0 94.5 94.5" className={className}>
          <circle cx="47.2" cy="47.2" r="47.2" fill="#CBA764"/>
          <path d="M44 27.7v15.7l-14-8.8v17.9l1.8 1.1v-2.9l0 0V37.9l12.1 7.6v0l5.1 3.2V62.3v-0.1l0 2.2 1.8 1.1V49.9l14 8.8V40.8L44 27.7zM63 55.4l-12.1-7.7L45.8 44.5V31l17.2 10.8V55.4z" fill="#FFF"/>
        </svg>);
        break;
      case 'circled_diseno':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="125" height="122" viewBox="0 0 125 121.8" className={className}>
            <circle cx="63" cy="59.7" r="59.3" fill="#CBA764"/>
            <path d="M50 69.9c-2.3-2.9-3.5-6.4-3.5-10.2 0-9.1 7.4-16.5 16.5-16.5 9.1 0 16.5 7.4 16.5 16.5 0 3.6-1.2 7.1-3.3 10l-2-1.5c1.9-2.4 2.8-5.4 2.8-8.4 0-7.7-6.3-14-14-14 -7.7 0-14 6.3-14 14 0 3.2 1 6.1 3 8.6L50 69.9z" fill="#fff" />
            <path d="M50.6 82c-8.1-4.5-13.1-13.1-13.1-22.3 0-10.3 6.1-19.5 15.6-23.5l1 2.3c-8.5 3.6-14.1 11.9-14.1 21.2 0 8.3 4.5 16.1 11.8 20.1L50.6 82z" fill="#fff" />
            <path d="M63 85.2v-2.5c12.7 0 23-10.3 23-23s-10.3-23-23-23v-2.5c14.1 0 25.5 11.5 25.5 25.5C88.5 73.8 77.1 85.2 63 85.2z" fill="#fff" />
            <path d="M63 94.6c-8.9 0-17.3-3.3-23.8-9.4 -6.8-6.4-10.7-15-11-24.3 -0.6-19.2 14.5-35.4 33.8-36l0.1 2.5c-17.9 0.6-31.9 15.6-31.3 33.4 0.3 8.6 3.9 16.7 10.2 22.6 6.3 5.9 14.5 9 23.2 8.7 17.9-0.6 31.9-15.6 31.3-33.4l2.5-0.1c0.6 19.2-14.5 35.4-33.8 36C63.7 94.6 63.3 94.6 63 94.6z" fill="#fff" />
            <path d="M94.3 51.3C91.1 39.5 81.3 30.3 69.3 27.9l0.5-2.5c12.9 2.6 23.5 12.5 26.9 25.2L94.3 51.3z" fill="#fff" />
            <path d="M63 67.5c-4.3 0-7.8-3.5-7.8-7.8 0-4.3 3.5-7.8 7.8-7.8 4.3 0 7.8 3.5 7.8 7.8C70.8 64 67.3 67.5 63 67.5zM63 54.4c-2.9 0-5.3 2.4-5.3 5.3 0 2.9 2.4 5.3 5.3 5.3 2.9 0 5.3-2.4 5.3-5.3C68.3 56.8 65.9 54.4 63 54.4z" fill="#fff" />
            <path d="M63 76.2c-3.6 0-6.9-1.1-9.8-3.2l1.5-2c2.6 1.9 5.6 2.8 8.8 2.7 2.8-0.1 5.5-1 7.7-2.6l1.5 2c-2.7 1.9-5.8 3-9.1 3.1C63.3 76.2 63.2 76.2 63 76.2z" fill="#fff" />
          </svg>);
        break;
      case 'circled_coordinacion':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="125" height="122" viewBox="0 0 125 121.8" className={className}>
            <circle cx="62.5" cy="60.9" r="59.3" fill="#CBA764"/>
            <path d="M62.5 68.2c-1.9 0-3.8-0.8-5.2-2.1 -2.8-2.8-2.8-7.5 0-10.3 1.4-1.4 3.2-2.1 5.2-2.1 1.9 0 3.8 0.8 5.2 2.1 2.8 2.8 2.8 7.5 0 10.3C66.3 67.5 64.4 68.2 62.5 68.2zM62.5 56.1c-1.3 0-2.5 0.5-3.4 1.4 -1.9 1.9-1.9 4.9 0 6.8 0.9 0.9 2.1 1.4 3.4 1.4 1.3 0 2.5-0.5 3.4-1.4 1.9-1.9 1.9-4.9 0-6.8C65 56.6 63.8 56.1 62.5 56.1z" fill="#FFF" />
            <polygon points="83.9 48.5 82.1 50.3 91.6 59.7 76 59.7 76 62.2 91.5 62.2 82.1 71.7 83.9 73.4 96.3 61 " fill="#FFF" />
            <polygon points="74.9 39.6 62.5 27.1 50 39.6 51.8 41.3 61.2 31.9 61.2 47.4 63.7 47.4 63.7 31.9 73.2 41.3 " fill="#FFF" />
            <polygon points="49 59.6 33.5 59.6 42.9 50.2 41.1 48.4 28.7 60.9 41.1 73.3 42.9 71.6 33.4 62.1 49 62.1 " fill="#FFF" />
            <polygon points="73.3 80.5 63.8 90 63.8 74.4 61.3 74.4 61.3 90 51.8 80.5 50.1 82.3 62.5 94.8 75 82.3 " fill="#FFF" />
          </svg>);
        break;
      case 'circled_calidad':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="125" height="122" viewBox="0 0 125 121.8" className={className}>
            <circle cx="62.5" cy="61.1" r="59.3" fill="#CBA764"/>
            <polygon points="80.5 88.5 62.5 75.4 44.5 88.5 51.4 67.3 33.3 54.2 55.6 54.2 62.5 33 68.3 50.9 65.9 51.7 62.5 41.1 57.4 56.7 41 56.7 54.3 66.3 49.2 81.9 62.5 72.3 75.8 81.9 70.7 66.3 84 56.7 75.1 56.7 75.1 54.2 91.7 54.2 73.6 67.3 " fill="#FFF" />
            <polygon points="61.8 68 55.9 60.9 57.8 59.3 61.8 64 83.3 37.3 85.2 38.9 " fill="#FFF" />
          </svg>);
        break;
      case 'carousel_left':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 7.9 14.1"  className={className}>
          <polyline points="7.4 0.5 0.8 7.1 7.5 13.7 " fill="none" stroke="#CBA764" strokeWidth="2"/>
        </svg>);
        break;
      case 'carousel_right':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 7.9 14.1"  className={className}>
          <polyline points="0.9 13.7 7.5 7.1 0.8 0.5 " fill="none" stroke="#CBA764" strokeWidth="2"/>
        </svg>);
        break;
      case 'servicios_entrevista':
        return(<svg xmlns="http://www.w3.org/2000/svg" width="119" height="119" viewBox="0 0 118.6 118.6" className={className}>
          <circle cx="59.3" cy="59.3" r="59.3" fill="#FFB69F"/>
          <rect x="27" y="28.5" width="64.6" height="61.6" fill="none" strokeWidth="3" stroke="#fff"/>
          <circle cx="38.4" cy="59.3" r="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
          <circle cx="80.2" cy="59.3" r="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
          <circle cx="59.3" cy="78.7" r="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
          <circle cx="59.3" cy="39.9" r="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
        </svg>);
        break;
      case 'servicios_conceptualizacion':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="119" height="119" viewBox="0 0 118.6 118.6" className={className}>
          <circle cx="59.3" cy="59.3" r="59.3" fill="#FFB69F"/>
          <rect x="28.5" y="28.1" width="61.6" height="62" fill="none" strokeWidth="3" stroke="#fff"/>
          <rect x="56.3" y="70.1" width="25.8" height="10.9" fill="none" strokeWidth="3" stroke="#fff"/>
          <rect x="35.8" y="36.1" width="11.4" height="26.7" fill="none" strokeWidth="3" stroke="#fff"/>
          <rect x="35.8" y="70.1" width="11.4" height="10.9" fill="none" strokeWidth="3" stroke="#fff"/>
          <rect x="56.3" y="36.1" width="25.8" height="26.7" fill="none" strokeWidth="3" stroke="#fff"/>
          <line x1="82.1" y1="62.7" x2="56.3" y2="36.1" fill="none" strokeWidth="3" stroke="#fff"/>
          <line x1="82.1" y1="51.2" x2="67.5" y2="36.1" fill="none" strokeWidth="3" stroke="#fff"/>
          <line x1="71" y1="62.7" x2="56.3" y2="47.6" fill="none" strokeWidth="3" stroke="#fff"/>
        </svg>);
        break;
      case 'servicios_proyecto':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="119" height="119" viewBox="0 0 118.6 118.6" className={className}>
        <circle cx="59.2" cy="59.3" r="59.3" fill="#FFB69F"/>
        <polyline points="90.7 45.8 90.7 90.8 27.6 90.8 27.6 29.2 90.7 29.2 90.7 34.1 " fill="none" strokeWidth="3" stroke="#fff"/>
        <polyline points="73.8 68.2 90.7 68.2 90.7 90.8 57.2 90.8 57.2 68.2 61 68.2 " fill="none" strokeWidth="3" stroke="#fff"/>
        <polyline points="27.6 68.2 46.4 68.2 46.4 81.4 " fill="none" strokeWidth="3" stroke="#fff"/>
        <line x1="90.7" y1="59.5" x2="56.1" y2="59.5" fill="none" strokeWidth="3" stroke="#fff"/>
        <line x1="46.9" y1="28.8" x2="46.9" y2="59.1" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="54.8" y="37.5" width="27.8" height="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="64.8" y="73.8" width="17.8" height="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="33.3" y="73.8" width="7.9" height="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="33.3" y="37.5" width="7.9" height="11.4" fill="none" strokeWidth="3" stroke="#fff"/>
        </svg>);
        break;
      case 'servicios_ejecucion':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="119" height="119" viewBox="0 0 118.6 118.6" className={className}>
        <circle cx="59.3" cy="59.3" r="59.3" fill="#FFB69F"/>
        <rect x="28.5" y="28.3" width="61.6" height="62" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="55.9" y="66.7" width="6.9" height="12.2" fill="none" strokeWidth="3" stroke="#fff"/>
        <line x1="56.1" y1="78.9" x2="56.1" y2="83" fill="none" strokeWidth="3" stroke="#fff"/>
        <line x1="76.8" y1="78.9" x2="76.8" y2="83" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="66.3" y="38.2" width="16" height="20.1" fill="none" strokeWidth="3" stroke="#fff"/>
        <rect x="71.2" y="68.5" width="18.9" height="10.4" fill="none" strokeWidth="3" stroke="#fff"/>
        <path d="M77.8 72.8c0.5 0 0.9 0.4 0.9 0.9s-0.4 0.9-0.9 0.9 -0.9-0.4-0.9-0.9S77.3 72.8 77.8 72.8M77.8 71.5c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2S79 71.5 77.8 71.5L77.8 71.5z" fill="#FFF"/>
        <polyline points="56.1 78.9 28.5 78.9 28.5 70.9 55.7 70.9"  fill="none" strokeWidth="3" stroke="#fff"/>
        <polyline points="56.1 70.9 28.5 70.9 28.5 58.3 59.3 58.3 59.3 66.7" fill="none" strokeWidth="3" stroke="#fff"/></svg>);
        break;
      case 'location':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="30" viewBox="0 0 17.5 30" className={className}>
          <path d="M8.8 5.4c-1.8 0-3.3 1.5-3.3 3.3 0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3C12.1 6.9 10.6 5.4 8.8 5.4zM8.8 10.1c-0.8 0-1.4-0.6-1.4-1.4 0-0.8 0.6-1.4 1.4-1.4 0.8 0 1.4 0.6 1.4 1.4C10.1 9.5 9.5 10.1 8.8 10.1z" fill="#CBA764"/>
        <path d="M8.8 0C3.9 0 0 3.9 0 8.8c0 1.1 0.2 2.1 0.6 3.2L7.9 29.4C8 29.8 8.4 30 8.8 30c0 0 0 0 0 0 0.4 0 0.8-0.2 0.9-0.6l7.3-17.5c0.4-1 0.6-2.1 0.6-3.1C17.5 3.9 13.6 0 8.8 0zM15.1 11.3L8.8 26.5 2.5 11.5l-0.1-0.3C2.1 10.4 2 9.6 2 8.8c0-3.8 3.1-6.8 6.8-6.8 3.8 0 6.8 3.1 6.8 6.8C15.6 9.6 15.4 10.4 15.1 11.3z" fill="#CBA764"/>
        </svg>);
        break;
      default:
        return (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className={className}>
          <circle cx="15" cy="15" r="15"/>
          <path d="M16.6 25.1v-9.2h3.2l0.5-3.6h-3.7v-2.3c0-1 0.3-1.7 1.9-1.7l2 0V5.1c-0.3 0-1.5-0.1-2.9-0.1 -2.9 0-4.8 1.7-4.8 4.7v2.6H9.5v3.6h3.2v9.2H16.6z"/>
        </svg>);
          /*eslint-enable */
    }
  }

  render() {
    return (this.renderItems(this.props.network, this.props.className));
  }
}
SVG.propTypes = {
  background: React.PropTypes.string,
  color: React.PropTypes.string,
  network: React.PropTypes.string,
  className: React.PropTypes.string,
};
