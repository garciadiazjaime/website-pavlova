/* eslint max-len: [2, 500, 4] */
import React from 'react';
import { Link } from 'react-router';
import style from './style.scss';

function renderItems(network, className) {
  switch (network) {
    case 'facebook':
      /*eslint-disable */
      return (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" className={className}>
        <circle cx="15" cy="15" r="15"/>
        <path transform="scale(.8) translate(4, 4)" d="M16.6 25.1v-9.2h3.2l0.5-3.6h-3.7v-2.3c0-1 0.3-1.7 1.9-1.7l2 0V5.1c-0.3 0-1.5-0.1-2.9-0.1 -2.9 0-4.8 1.7-4.8 4.7v2.6H9.5v3.6h3.2v9.2H16.6z"/>
      </svg>);
    case 'square_arrow':
      return(<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31.4 31.3" className={className}>
        <path d="M1 30.9c-0.3 0-0.5-0.2-0.5-0.5V1c0-0.3 0.2-0.5 0.5-0.5h29.4c0.3 0 0.5 0.2 0.5 0.5v29.4c0 0.3-0.2 0.5-0.5 0.5H1z" fill="#221f1f"/>
        <path d="M30.4 1v29.4H1V1H30.4M30.4 0H1c-0.6 0-1 0.4-1 1v29.4c0 0.6 0.4 1 1 1h29.4c0.6 0 1-0.4 1-1V1C31.4 0.4 31 0 30.4 0L30.4 0z" fill="#FFF"/>
        <polyline points=" 13.2 9.1 19.7 15.6 13.1 22.2 " fill="none" stroke="#fff"/>
      </svg>)
    case 'arrow_right':
      return (<svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 7.7 13.8" className={className}>
        <polyline points="0.5 0.4 7 6.9 0.4 13.5 " fill="none" stroke="#FFF"/>
      </svg>);
    case 'arrow_down':
      return (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 14.6 8" className={className}>
        <polyline points="13.8 0.8 7.3 7.3 0.7 0.7 " fill="none" stroke="#FFF"/>
      </svg>);
    case 'carousel_right':
      return (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10.1 18" className={className}>
        <polyline points=" 1.1 1.1 9 9 1.1 16.9 " fill="none" strokeLinejoin="round" strokeWidth="2" stroke="#010101" />
      </svg>);
      case 'carousel_left':
        return (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10.1 18" className={className}>
          <polyline points=" 9 16.9 1.1 9 9 1.1 " fill="none" strokeLinejoin="round" strokeWidth="2" stroke="#010101" />
        </svg>);
    case 'location':
      return (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="30" viewBox="0 0 17.5 30" className={className}>
        <path d="M8.8 5.4c-1.8 0-3.3 1.5-3.3 3.3 0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3C12.1 6.9 10.6 5.4 8.8 5.4zM8.8 10.1c-0.8 0-1.4-0.6-1.4-1.4 0-0.8 0.6-1.4 1.4-1.4 0.8 0 1.4 0.6 1.4 1.4C10.1 9.5 9.5 10.1 8.8 10.1z" fill="#CBA764"/>
      <path d="M8.8 0C3.9 0 0 3.9 0 8.8c0 1.1 0.2 2.1 0.6 3.2L7.9 29.4C8 29.8 8.4 30 8.8 30c0 0 0 0 0 0 0.4 0 0.8-0.2 0.9-0.6l7.3-17.5c0.4-1 0.6-2.1 0.6-3.1C17.5 3.9 13.6 0 8.8 0zM15.1 11.3L8.8 26.5 2.5 11.5l-0.1-0.3C2.1 10.4 2 9.6 2 8.8c0-3.8 3.1-6.8 6.8-6.8 3.8 0 6.8 3.1 6.8 6.8C15.6 9.6 15.4 10.4 15.1 11.3z" fill="#CBA764"/>
      </svg>);
    case 'instagram':
      return (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" className={className}>
      <circle cx="15" cy="15" r="15"/>
      <path d="M20.6 7H9.4c-1.3 0-2.4 0.9-2.4 2.1v11.8c0 1.2 1.1 2.1 2.4 2.1h11.3c1.3 0 2.4-0.9 2.4-2.1V9.1C23 7.9 22 7 20.6 7zM18.6 9.2c0-0.3 0.2-0.5 0.5-0.5h1.7c0.3 0 0.5 0.2 0.5 0.5v1.7c0 0.3-0.2 0.5-0.5 0.5h-1.7c-0.3 0-0.5-0.2-0.5-0.5V9.2zM17.7 11.7v0c0 0 0 0 0 0H17.7zM14.9 12c2 0 3.5 1.6 3.5 3.5 0 2-1.6 3.5-3.5 3.5 -2 0-3.5-1.6-3.5-3.5C11.4 13.6 13 12 14.9 12zM22 20.7c0 0.8-0.6 1.4-1.4 1.4H9.3c-0.8 0-1.4-0.6-1.4-1.4V13.3h2.9c-0.3 0.7-0.5 1.4-0.5 2.2 0 2.6 2.1 4.7 4.7 4.7 2.6 0 4.7-2.1 4.7-4.7 0-0.7-0.2-1.4-0.5-2h2.8V20.7z"/>
    </svg>);
    default:
      return (<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className={className}>
        <circle cx="15" cy="15" r="15"/>
        <path d="M16.6 25.1v-9.2h3.2l0.5-3.6h-3.7v-2.3c0-1 0.3-1.7 1.9-1.7l2 0V5.1c-0.3 0-1.5-0.1-2.9-0.1 -2.9 0-4.8 1.7-4.8 4.7v2.6H9.5v3.6h3.2v9.2H16.6z"/>
      </svg>);
        /*eslint-enable */
  }
}

export default class SVG extends React.Component {

  render() {
    return (renderItems(this.props.network, this.props.className));
  }
}

SVG.propTypes = {
  background: React.PropTypes.string,
  color: React.PropTypes.string,
  network: React.PropTypes.string,
  className: React.PropTypes.string,
};

export function getFacebookIcon(href, title, className) {
  return (<Link to={href} className={[style.fbIcon, (className || '')].join(' ')} target="_blank">
      {renderItems('facebook', style.facebook)}
      { title ? <span>{title}</span> : null}
    </Link>);
}
