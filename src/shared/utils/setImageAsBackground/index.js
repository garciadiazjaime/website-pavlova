/* eslint max-len: [2, 500, 4] */
import _ from 'lodash';

export default (data) => {
  let imgUrl = '/images/demo.png';
  if (_.isObject(data) && data.src) {
    imgUrl = data.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  } else if (_.isString(data)) {
    imgUrl = data.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }
  return {
    backgroundImage: 'url(' + imgUrl + ')',
  };
};
