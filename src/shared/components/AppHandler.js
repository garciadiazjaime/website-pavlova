/* eslint max-len: [2, 500, 4] */
import React from 'react';

import sitemap from '../config/sitemap';
import MainMenu from './layout/menu/menu1';
import Footer from './layout/footer/footer3';
import scrollUtil from '../utils/scroll';
import menuUtil from '../utils/menu';


export default class AppHandler extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.scrollHandler(true);

    const width = window.innerWidth;
    if (width < 768) {
      $('#menu_wrapper').addClass('navbar-fixed-top');
      $('.navbar-brand').css('display', 'block');
      $('.navbar-icons').css('display', 'block');
    }
  }

  componentDidUpdate() {
    this.scrollHandler();
  }

  scrollHandler(isFirstTime) {
    const { location } = this.props;
    scrollUtil(location);
    if (!isFirstTime) {
      const bits = location.pathname.split('/');
      menuUtil(bits[1] || 'inicio');
    }
  }

  clickHandler() {
    if ($('.navbar-header button').is(':visible')) {
      $('.navbar-header button').click();
    }
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child);
    });
    return (<div>
      <MainMenu items={sitemap.items.children} icons={sitemap.icons} onClick={this.clickHandler} />
      {children}
      <Footer items={sitemap.items.children} addresses={sitemap.addresses} icons={sitemap.icons}/>
    </div>);
  }
}

AppHandler.propTypes = {
  children: React.PropTypes.object.isRequired,
  location: React.PropTypes.any,
  context: React.PropTypes.any,
};
