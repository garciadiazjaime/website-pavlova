/* eslint max-len: [2, 600, 4] */
let scropllInProgress = false;

function getScrollTo(section, elementID) {
  const topElements = ['inicio', 'nosotros', 'equipo', 'servicios', 'contacto'];
  if (topElements.indexOf(elementID) !== -1 || section === 'contacto') {
    return 0;
  }
  return $('#' + elementID).offset().top - 220;
}

export default (location) => {
  // todo: get topElements from sitemap and improve exceptions "elementID"
  const bits = location.pathname.split('/');
  let elementID = location.pathname ? bits.pop() || 'inicio' : 'inicio';
  if ($('.menu_trigger').is(':visible') && bits.length === 1) {
    elementID = 'inicio';
  }
  if (bits[1] === 'contacto') {
    elementID = 'contacto';
  }
  if ($('#' + elementID).length && !scropllInProgress) {
    scropllInProgress = true;
    const scrollTo = getScrollTo(bits[1], elementID);
    const srolltime = 100;
    const rootTag = typeof document.body.scrollTop !== 'undefined' ? 'body' : 'html, body';
    $(rootTag).animate({
      scrollTop: scrollTo,
    }, srolltime, 'swing', () => {
      scropllInProgress = false;
    });
  }
};
