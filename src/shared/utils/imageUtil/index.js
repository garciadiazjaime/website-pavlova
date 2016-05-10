/* eslint max-len: [2, 500, 4] */
import _ from 'lodash';

export function getImageBackground(data) {
  let imgUrl = '';
  if (_.isObject(data) && data.src) {
    imgUrl = data.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  } else if (_.isString(data) && data) {
    imgUrl = data.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }
  return imgUrl ? {
    backgroundImage: 'url(' + imgUrl + ')',
  } : null;
}

export function normalizeImageUrl(data) {
  return data.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
}
