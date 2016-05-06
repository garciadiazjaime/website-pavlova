export default (str) => {
  if (str && str.length) {
    let response = str.replace(/^\s+|\s+$/g, ''); // trim
    response = response.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';
    for (let i = 0, l = from.length; i < l; i++) {
      response = response.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    response = response.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return response;
  }
  return str;
};
