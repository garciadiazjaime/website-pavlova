/* eslint max-len: [2, 500, 4] */
import React from 'react';
import _ from 'lodash';

import sitemap from '../config/sitemap';
import MainMenu from './layout/menu/menu1';
import Footer from './layout/footer/footer3';
import scrollUtil from '../utils/scroll';
import menuUtil from '../utils/menu';
import restClient from '../../server/helpers/rest-client';


export default class AppHandler extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: context.data && context.data.blocks ? context.data.blocks : window._data.blocks,
      cache: {},
    };
  }

  componentDidMount() {
    this.scrollHandler(true);
    // window.addEventListener('scroll', this.onScroll, false);
    // this.googleAnalytics();
    if (_.isEmpty(this.state.data)) {
      this.loadData();
      const width = window.innerWidth;
      if (width < 768) {
        $('#menu_wrapper').addClass('navbar-fixed-top');
        $('.navbar-brand').css('display', 'block');
        $('.navbar-icons').css('display', 'block');
      }
    }
  }

  componentWillReceiveProps() {
    this.setState({
      data: {},
    });
    this.loadData();
  }

  componentDidUpdate() {
    this.scrollHandler();
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll() {
    const offset = window.pageYOffset;
    const width = window.innerWidth;
    if (width < 768) {
      $('#menu_wrapper').addClass('navbar-fixed-top');
      $('.navbar-brand').css('display', 'block');
      $('.navbar-icons').css('display', 'block');
    } else {
      if (offset > 386) {
        $('#menu_wrapper').addClass('navbar-fixed-top');
        $('.navbar-brand').css('display', 'block');
        $('.navbar-icons').css('display', 'block');
      } else {
        $('#menu_wrapper').removeClass('navbar-fixed-top');
        $('.navbar-brand').css('display', 'none');
        $('.navbar-icons').css('display', 'none');
      }
    }
  }

  getBlocksData(data) {
    const properties = ['slides', 'buttons', 'images', 'paragraphs', 'titles'];
    const response = {};
    if (_.isArray(data) && data.length) {
      data.map((item, index) => {
        const key = 'block' + (index + 1);
        response[key] = {};
        properties.map((prop) => {
          if (_.isArray(item[prop]) && item[prop].length) {
            response[key][prop] = prop === 'slides' ? item[prop] : this.getDataLevelTwo(prop, item[prop]);
          }
        });
      });
    }
    return response;
  }

  getDataLevelTwo(props, data) {
    const response = {};
    const prop = props.substring(0, props.length - 1);
    if (_.isArray(data) && data.length) {
      data.map((item, index) => {
        response[prop + (index + 1)] = item;
      });
    }
    return response;
  }

  getSectionId(data, url) {
    if (_.isObject(data.items) && !_.isEmpty(data.items) && _.isArray(data.items.children) && data.items.children.length) {
      for (let i = 0, len = data.items.children.length; i < len; i++) {
        if (data.items.children[i].url === '/' + url) {
          return data.items.children[i].id;
        }
      }
    }
    return 0;
  }

  loadData() {
    const promises = [];
    const bits = window.location.pathname.split('/');
    const url = bits[1] || 'inicio';
    const sectionId = this.getSectionId(sitemap, url);
    if (_.isEmpty(this.state.cache[sectionId])) {
      promises.push(restClient({
        path: window._apiUrl + 'api/block/?section_id=' + sectionId,
      }));

      if (promises.length) {
        Promise.all(promises).then((data) => {
          const blocks = this.getBlocksData(data[0].entity);
          const state = this.state;
          state.data = blocks;
          state.cache[sectionId] = blocks;
          this.setState(state);
        });
      }
    } else {
      this.setState({
        data: this.state.cache[sectionId],
      });
    }
  }

  googleAnalytics() {
    /*eslint-disable */
    // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    // })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    // ga('create', 'UA--', 'auto');
    // ga('send', 'pageview');
    /*eslint-enable */
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
      return React.cloneElement(child, { data: this.state.data });
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
  data: React.PropTypes.any,
};

AppHandler.contextTypes = {
  data: React.PropTypes.object,
};
