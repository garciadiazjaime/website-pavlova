
export default (elementID) => {
  $('.navbar-nav li.active').removeClass('active');
  $('.navbar-nav a#' + elementID).parent().addClass('active');
};
