/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(3);

	var _reactRouter = __webpack_require__(4);

	var _bodyParser = __webpack_require__(5);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _dataWrapper = __webpack_require__(7);

	var _dataWrapper2 = _interopRequireDefault(_dataWrapper);

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	var _api = __webpack_require__(10);

	var _api2 = _interopRequireDefault(_api);

	var _routes = __webpack_require__(12);

	var _routes2 = _interopRequireDefault(_routes);

	var _restClient = __webpack_require__(27);

	var _restClient2 = _interopRequireDefault(_restClient);

	var _sitemap = __webpack_require__(15);

	var _sitemap2 = _interopRequireDefault(_sitemap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* eslint max-len: [2, 500, 4] */


	var app = (0, _express2.default)();
	var _data = {};
	var apiUrl = _config2.default.get('apiUrl');

	function getSectionId(data, url) {
	  if (_lodash2.default.isObject(data.items) && !_lodash2.default.isEmpty(data.items) && _lodash2.default.isArray(data.items.children) && data.items.children.length) {
	    for (var i = 0, len = data.items.children.length; i < len; i++) {
	      if (data.items.children[i].url === '/' + url) {
	        return data.items.children[i].id;
	      }
	    }
	  }
	  return 0;
	}

	function getDataLevelTwo(props, data) {
	  var response = {};
	  var prop = props.substring(0, props.length - 1);
	  if (_lodash2.default.isArray(data) && data.length) {
	    data.map(function (item, index) {
	      response[prop + (index + 1)] = item;
	    });
	  }
	  return response;
	}

	function getBlocksData(data) {
	  var properties = ['slides', 'buttons', 'images', 'paragraphs', 'titles'];
	  var response = {};
	  if (_lodash2.default.isArray(data) && data.length) {
	    data.map(function (item, index) {
	      var key = 'block' + (index + 1);
	      response[key] = {};
	      properties.map(function (prop) {
	        if (_lodash2.default.isArray(item[prop]) && item[prop].length) {
	          response[key][prop] = prop === 'slides' ? item[prop] : getDataLevelTwo(prop, item[prop]);
	        }
	      });
	    });
	  }
	  return response;
	}

	app.set('views', './views');
	app.set('view engine', 'jade');

	app.use(_bodyParser2.default.json());
	app.use(_bodyParser2.default.urlencoded({
	  extended: false
	}));

	app.use(_express2.default.static('static'));

	app.use('/api/', _api2.default);

	app.get('/*', function (req, res, next) {
	  var bits = req.url.split('/');
	  var url = bits[1] || 'inicio';
	  var sectionId = getSectionId(_sitemap2.default, url);
	  if (sectionId) {
	    var promises = [];
	    promises.push(new Promise(function (resolve, reject) {
	      (0, _restClient2.default)({
	        path: apiUrl + 'api/block/?section_id=' + sectionId
	      }).then(function (response) {
	        resolve(response.entity);
	      }, function (response) {
	        reject(response);
	      });
	    }));

	    if (promises.length) {
	      Promise.all(promises).then(function (data) {
	        var blocks = getBlocksData(data[0]);
	        _data.blocks = blocks;
	        next();
	      });
	    } else {
	      next();
	    }
	  } else {
	    next();
	  }
	}, function (req, res) {
	  (0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (error, redirectLocation, renderProps) {
	    if (error) {
	      res.status(500).send(error.message);
	    } else if (redirectLocation) {
	      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
	    } else if (renderProps) {
	      var props = {
	        blocks: _data.blocks
	      };
	      var content = (0, _server.renderToString)(_react2.default.createElement(
	        _dataWrapper2.default,
	        { data: props },
	        _react2.default.createElement(_reactRouter.RoutingContext, renderProps)
	      ));
	      res.render('index', { content: content, props: props, apiUrl: apiUrl });
	    } else {
	      res.status(404).send('Not found');
	    }
	  });
	});

	app.set('ipaddress', _config2.default.get('ipaddress'));
	app.set('port', _config2.default.get('port'));

	var server = app.listen(app.get('port'), app.get('ipaddress'), function (err) {
	  if (err) {
	    console.log(err);
	  }

	  var host = server.address().address;
	  var port = server.address().port;
	  console.log('Example app listening at http://%s:%s', host, port);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DataWrapper = function (_React$Component) {
	  _inherits(DataWrapper, _React$Component);

	  function DataWrapper() {
	    _classCallCheck(this, DataWrapper);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataWrapper).apply(this, arguments));
	  }

	  _createClass(DataWrapper, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return {
	        data: this.props.data
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.props.children;
	    }
	  }]);

	  return DataWrapper;
	}(_react2.default.Component);

	exports.default = DataWrapper;


	DataWrapper.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired,
	  children: _react2.default.PropTypes.any
	};

	DataWrapper.childContextTypes = {
	  data: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var convict = __webpack_require__(9);

	var config = convict({
	  email: {
	    doc: 'default contact email',
	    format: String,
	    default: 'info@mintitmedia.com'
	  },
	  ipaddress: {
	    doc: 'IP the application runs on',
	    format: 'ipaddress',
	    default: '127.0.0.1',
	    env: 'OPENSHIFT_NODEJS_IP'
	  },
	  port: {
	    doc: 'Port the application listens on',
	    format: 'port',
	    default: '3030',
	    env: 'OPENSHIFT_NODEJS_PORT'
	  },
	  sendgrid: {
	    doc: 'Sendrid API KEY',
	    format: String,
	    default: '',
	    env: 'SENDGRID_API_KEY'
	  },
	  apiUrl: {
	    doc: 'API URL',
	    format: String,
	    default: '',
	    env: 'API_URL'
	  },
	});

	config.validate();

	module.exports = config;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("convict");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var express = __webpack_require__(1);
	/*eslint-disable */
	var router = express.Router();
	/*eslint-enable */
	var conf = __webpack_require__(8);
	var sendgrid = __webpack_require__(11)(conf.get('sendgrid'));

	router.post('/send_email', function (req, res) {
	  var fromname = req.body.fromname;
	  var replyto = req.body.replyto;
	  var subject = req.body.subject;
	  var html = req.body.html;

	  var email = new sendgrid.Email({
	    to: conf.get('email'),
	    from: conf.get('email'),
	    fromname: fromname,
	    replyto: replyto,
	    subject: subject,
	    bcc: ['info@mintitmedia.com'],
	    html: html
	  });

	  sendgrid.send(email, function (err) {
	    var response = true;
	    if (err) {
	      console.error(err);
	      response = false;
	    }
	    res.send({
	      status: response
	    });
	  });
	});

	exports.default = router;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("sendgrid");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _createBrowserHistory = __webpack_require__(14);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	var _sitemap = __webpack_require__(15);

	var _sitemap2 = _interopRequireDefault(_sitemap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var items = _sitemap2.default.items;

	var routes = items.children.map(function (item, index) {
	  return _react2.default.createElement(_reactRouter.Route, { path: item.url, component: item.component, key: index });
	});
	var history = process.env.TIER === 'FE' ? (0, _createBrowserHistory2.default)() : null;

	exports.default = _react2.default.createElement(
	  _reactRouter.Router,
	  { history: history },
	  _react2.default.createElement(
	    _reactRouter.Route,
	    { path: '/', component: items.component },
	    _react2.default.createElement(_reactRouter.IndexRoute, { component: items.default }),
	    routes,
	    _react2.default.createElement(_reactRouter.Route, { path: 'escuela/:showListItem', component: items.showListItem })
	  )
	);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("history/lib/createBrowserHistory");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _AppHandler = __webpack_require__(16);

	var _AppHandler2 = _interopRequireDefault(_AppHandler);

	var _home = __webpack_require__(31);

	var _home2 = _interopRequireDefault(_home);

	var _about = __webpack_require__(39);

	var _about2 = _interopRequireDefault(_about);

	var _products = __webpack_require__(58);

	var _products2 = _interopRequireDefault(_products);

	var _contact = __webpack_require__(66);

	var _contact2 = _interopRequireDefault(_contact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  items: {
	    component: _AppHandler2.default,
	    default: _home2.default,
	    showListItem: _about2.default,
	    children: [{
	      id: 1,
	      title: 'Inicio',
	      url: '/inicio',
	      component: _home2.default
	    }, {
	      id: 2,
	      title: 'Escuela',
	      url: '/escuela',
	      component: _about2.default
	    }, {
	      id: 3,
	      title: 'Clases',
	      url: '/clases',
	      component: _products2.default
	    }, {
	      id: 5,
	      title: 'Contacto',
	      url: '/contacto',
	      component: _contact2.default
	    }]
	  },
	  icons: [{
	    title: 'facebook',
	    url: 'https://www.facebook.com/'
	  }],
	  addresses: [{
	    titles: {
	      title1: 'UBICACIÓN',
	      title2: 'LLÁMANOS',
	      title3: 'CLASES',
	      title4: 'DESCARGABLES'
	    },
	    texts: {
	      text1: 'Av. Allende #38',
	      text2: 'Col. Hipódromo',
	      text3: 'Tijuana, B.C.',
	      text4: 'info@pavlovahipodromo.com',
	      text5: '664 686.27.87',
	      text6: 'http://facebook.com',
	      text7: 'Síguenos en Facebook'
	    },
	    links: {
	      link1: {
	        title: 'BALLET',
	        href: '/clases/ballet'
	      },
	      link2: {
	        title: 'JAZZ',
	        href: '/clases/jazz'
	      },
	      link3: {
	        title: 'FLAMENCO',
	        href: '/clases/flamenco'
	      },
	      link4: {
	        title: 'CARDIO DANZA',
	        href: '/clases/cardio-danza'
	      },
	      link5: {
	        title: 'BARRÉ',
	        href: '/clases/barre'
	      },
	      link6: {
	        title: 'HORARIOS',
	        href: '/docs/horarios.pdf'
	      },
	      link7: {
	        title: 'FICHA DE INSCRIPCIÓN',
	        href: '/docs/ficha-inscripcion.pdf'
	      },
	      link8: {
	        title: 'REGLAMENTO',
	        href: '/docs/reglamento.pdf'
	      }
	    }
	  }]
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _sitemap = __webpack_require__(15);

	var _sitemap2 = _interopRequireDefault(_sitemap);

	var _menu = __webpack_require__(17);

	var _menu2 = _interopRequireDefault(_menu);

	var _footer = __webpack_require__(20);

	var _footer2 = _interopRequireDefault(_footer);

	var _scroll = __webpack_require__(25);

	var _scroll2 = _interopRequireDefault(_scroll);

	var _menu3 = __webpack_require__(26);

	var _menu4 = _interopRequireDefault(_menu3);

	var _restClient = __webpack_require__(27);

	var _restClient2 = _interopRequireDefault(_restClient);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var AppHandler = function (_React$Component) {
	  _inherits(AppHandler, _React$Component);

	  function AppHandler(props, context) {
	    _classCallCheck(this, AppHandler);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AppHandler).call(this, props, context));

	    _this.state = {
	      data: context.data && context.data.blocks ? context.data.blocks : window._data.blocks,
	      cache: {}
	    };
	    return _this;
	  }

	  _createClass(AppHandler, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.scrollHandler(true);
	      window.addEventListener('scroll', this.onScroll, false);
	      // this.googleAnalytics();
	      if (_lodash2.default.isEmpty(this.state.data)) {
	        this.loadData();
	        var width = window.innerWidth;
	        if (width < 768) {
	          $('#menu_wrapper').addClass('navbar-fixed-top');
	          $('.navbar-brand').css('display', 'block');
	          $('.navbar-icons').css('display', 'block');
	        }
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps() {
	      this.setState({
	        data: {}
	      });
	      this.loadData();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this.scrollHandler();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      window.removeEventListener('scroll', this.onScroll, false);
	    }
	  }, {
	    key: 'onScroll',
	    value: function onScroll() {
	      var offset = window.pageYOffset;
	      var width = window.innerWidth;
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
	  }, {
	    key: 'getBlocksData',
	    value: function getBlocksData(data) {
	      var _this2 = this;

	      var properties = ['slides', 'buttons', 'images', 'paragraphs', 'titles'];
	      var response = {};
	      if (_lodash2.default.isArray(data) && data.length) {
	        data.map(function (item, index) {
	          var key = 'block' + (index + 1);
	          response[key] = {};
	          properties.map(function (prop) {
	            if (_lodash2.default.isArray(item[prop]) && item[prop].length) {
	              response[key][prop] = prop === 'slides' ? item[prop] : _this2.getDataLevelTwo(prop, item[prop]);
	            }
	          });
	        });
	      }
	      return response;
	    }
	  }, {
	    key: 'getDataLevelTwo',
	    value: function getDataLevelTwo(props, data) {
	      var response = {};
	      var prop = props.substring(0, props.length - 1);
	      if (_lodash2.default.isArray(data) && data.length) {
	        data.map(function (item, index) {
	          response[prop + (index + 1)] = item;
	        });
	      }
	      return response;
	    }
	  }, {
	    key: 'getSectionId',
	    value: function getSectionId(data, url) {
	      if (_lodash2.default.isObject(data.items) && !_lodash2.default.isEmpty(data.items) && _lodash2.default.isArray(data.items.children) && data.items.children.length) {
	        for (var i = 0, len = data.items.children.length; i < len; i++) {
	          if (data.items.children[i].url === '/' + url) {
	            return data.items.children[i].id;
	          }
	        }
	      }
	      return 0;
	    }
	  }, {
	    key: 'loadData',
	    value: function loadData() {
	      var _this3 = this;

	      var promises = [];
	      var bits = window.location.pathname.split('/');
	      var url = bits[1] || 'inicio';
	      var sectionId = this.getSectionId(_sitemap2.default, url);
	      if (_lodash2.default.isEmpty(this.state.cache[sectionId])) {
	        promises.push((0, _restClient2.default)({
	          path: window._apiUrl + 'api/block/?section_id=' + sectionId
	        }));

	        if (promises.length) {
	          Promise.all(promises).then(function (data) {
	            var blocks = _this3.getBlocksData(data[0].entity);
	            var state = _this3.state;
	            state.data = blocks;
	            state.cache[sectionId] = blocks;
	            _this3.setState(state);
	          });
	        }
	      } else {
	        this.setState({
	          data: this.state.cache[sectionId]
	        });
	      }
	    }
	  }, {
	    key: 'googleAnalytics',
	    value: function googleAnalytics() {
	      /*eslint-disable */
	      // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	      // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	      // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	      // })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	      // ga('create', 'UA--', 'auto');
	      // ga('send', 'pageview');
	      /*eslint-enable */
	    }
	  }, {
	    key: 'scrollHandler',
	    value: function scrollHandler(isFirstTime) {
	      var location = this.props.location;

	      (0, _scroll2.default)(location);
	      if (!isFirstTime) {
	        var bits = location.pathname.split('/');
	        (0, _menu4.default)(bits[1] || 'inicio');
	      }
	    }
	  }, {
	    key: 'clickHandler',
	    value: function clickHandler() {
	      if ($('.navbar-header button').is(':visible')) {
	        $('.navbar-header button').click();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      var children = _react2.default.Children.map(this.props.children, function (child) {
	        return _react2.default.cloneElement(child, { data: _this4.state.data });
	      });
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_menu2.default, { items: _sitemap2.default.items.children, icons: _sitemap2.default.icons, onClick: this.clickHandler }),
	        children,
	        _react2.default.createElement(_footer2.default, { items: _sitemap2.default.items.children, addresses: _sitemap2.default.addresses, icons: _sitemap2.default.icons })
	      );
	    }
	  }]);

	  return AppHandler;
	}(_react2.default.Component);

	exports.default = AppHandler;


	AppHandler.propTypes = {
	  children: _react2.default.PropTypes.object.isRequired,
	  location: _react2.default.PropTypes.any,
	  context: _react2.default.PropTypes.any,
	  data: _react2.default.PropTypes.any
	};

	AppHandler.contextTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var style = __webpack_require__(19);

	var MainMenu = function (_React$Component) {
	  _inherits(MainMenu, _React$Component);

	  function MainMenu() {
	    _classCallCheck(this, MainMenu);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(MainMenu).apply(this, arguments));
	  }

	  _createClass(MainMenu, [{
	    key: 'getItems',
	    value: function getItems(data) {
	      var _this2 = this;

	      return data.map(function (item, index) {
	        var title = item.title;
	        var url = item.url;

	        var elementID = url.replace('/', '');
	        var className = style.navbarNavAnchor;
	        var onClick = _this2.props.onClick;

	        return _react2.default.createElement(
	          'li',
	          { key: index },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: url, className: className, id: elementID, onClick: onClick },
	            title
	          )
	        );
	      });
	    }
	  }, {
	    key: 'getIcons',
	    value: function getIcons(data) {
	      return data.map(function (item, index) {
	        return _react2.default.createElement(
	          'li',
	          { key: index },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: item.url, className: style.sm_icon, id: item.url, target: '_blank' },
	            _react2.default.createElement(_svg2.default, { network: item.title, className: style[item.title] })
	          )
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      /*eslint-disable */
	      return _react2.default.createElement(
	        'div',
	        { className: style.navbarWrapper },
	        _react2.default.createElement(
	          'nav',
	          { className: style.navbarDefault + ' navbar navbar navbar-fixed-top', id: 'menu_wrapper' },
	          _react2.default.createElement(
	            'div',
	            { className: 'container-fluid' },
	            _react2.default.createElement(
	              'div',
	              { className: 'row' },
	              _react2.default.createElement(
	                'div',
	                { className: style.navbarHeader + ' navbar-header' },
	                _react2.default.createElement(
	                  'button',
	                  { type: 'button', className: 'navbar-toggle collapsed menu_trigger ' + style.toggleButton, 'data-toggle': 'collapse', 'data-target': '#mainmenu', 'aria-expanded': 'false' },
	                  _react2.default.createElement(
	                    'span',
	                    { className: 'sr-only' },
	                    'Toggle navigation'
	                  ),
	                  _react2.default.createElement('span', { className: 'icon-bar ' + style.iconBar }),
	                  _react2.default.createElement('span', { className: 'icon-bar ' + style.iconBar }),
	                  _react2.default.createElement('span', { className: 'icon-bar ' + style.iconBar })
	                ),
	                _react2.default.createElement(_reactRouter.Link, { className: style.navbarBrand + ' navbar-brand', to: '/inicio' })
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: style.navbarCollapse + ' collapse navbar-collapse', id: 'mainmenu' },
	                _react2.default.createElement(
	                  'ul',
	                  { className: style.navbarIcons },
	                  this.getIcons(this.props.icons)
	                ),
	                _react2.default.createElement(
	                  'ul',
	                  { className: style.navbarNav + ' nav navbar-nav' },
	                  this.getItems(this.props.items)
	                )
	              )
	            )
	          )
	        )
	      );
	      /*eslint-enable */
	    }
	  }]);

	  return MainMenu;
	}(_react2.default.Component);

	exports.default = MainMenu;


	MainMenu.propTypes = {
	  items: _react2.default.PropTypes.array.isRequired,
	  icons: _react2.default.PropTypes.array,
	  location: _react2.default.PropTypes.any,
	  onClick: _react2.default.PropTypes.func.isRequired
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var SVG = function (_React$Component) {
	  _inherits(SVG, _React$Component);

	  function SVG() {
	    _classCallCheck(this, SVG);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SVG).apply(this, arguments));
	  }

	  _createClass(SVG, [{
	    key: 'renderItems',
	    value: function renderItems(network, className) {
	      switch (network) {
	        case 'facebook':
	          /*eslint-disable */
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '22', height: '22', viewBox: '0 0 30 30', className: className },
	            _react2.default.createElement('circle', { cx: '15', cy: '15', r: '15' }),
	            _react2.default.createElement('path', { transform: 'scale(.8) translate(4, 4)', d: 'M16.6 25.1v-9.2h3.2l0.5-3.6h-3.7v-2.3c0-1 0.3-1.7 1.9-1.7l2 0V5.1c-0.3 0-1.5-0.1-2.9-0.1 -2.9 0-4.8 1.7-4.8 4.7v2.6H9.5v3.6h3.2v9.2H16.6z' })
	          );
	          break;
	        case 'twitter':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '30', height: '30', viewBox: '0 0 30 30', className: className },
	            _react2.default.createElement('circle', { cx: '15', cy: '15', r: '15' }),
	            _react2.default.createElement('path', { d: 'M23.5 9.7c-0.6 0.3-1.3 0.5-2 0.5 0.7-0.4 1.3-1.1 1.5-1.9 -0.7 0.4-1.4 0.7-2.2 0.8 -0.6-0.7-1.5-1.1-2.5-1.1 -1.9 0-3.5 1.6-3.5 3.5 0 0.3 0 0.5 0.1 0.8 -2.9-0.1-5.5-1.5-7.2-3.6 -0.3 0.5-0.5 1.1-0.5 1.8 0 1.2 0.6 2.3 1.6 2.9 -0.6 0-1.1-0.2-1.6-0.4 0 0 0 0 0 0 0 1.7 1.2 3.1 2.8 3.4 -0.3 0.1-0.6 0.1-0.9 0.1 -0.2 0-0.4 0-0.7-0.1 0.4 1.4 1.7 2.4 3.3 2.4 -1.2 0.9-2.7 1.5-4.3 1.5 -0.3 0-0.6 0-0.8 0 1.5 1 3.4 1.6 5.3 1.6 6.4 0 9.9-5.3 9.9-9.9 0-0.1 0-0.3 0-0.4C22.4 11 23 10.4 23.5 9.7z' })
	          );
	          break;
	        case 'pinterest':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '30', height: '30', viewBox: '0 0 30 30', className: className },
	            _react2.default.createElement('circle', { className: this.props.background, cx: '15', cy: '15', r: '15' }),
	            _react2.default.createElement('path', { d: 'M14.4 18.1c-0.5 2.6-1.1 5.1-2.9 6.4 -0.6-4 0.8-6.9 1.5-10.1 -1.1-1.8 0.1-5.5 2.4-4.6 2.8 1.1-2.4 6.8 1.1 7.5 3.7 0.8 5.2-6.4 2.9-8.8 -3.3-3.4-9.7-0.1-8.9 4.8 0.2 1.2 1.4 1.5 0.5 3.2 -2.1-0.5-2.8-2.1-2.7-4.4 0.1-3.7 3.3-6.2 6.5-6.6 4-0.4 7.8 1.5 8.3 5.2 0.6 4.2-1.8 8.8-6.1 8.5C15.8 19.2 15.4 18.6 14.4 18.1' })
	          );
	          break;
	        case 'instagram':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '30', height: '30', viewBox: '0 0 30 30', className: className },
	            _react2.default.createElement('circle', { cx: '15', cy: '15', r: '15' }),
	            _react2.default.createElement('path', { d: 'M20.6 7H9.4c-1.3 0-2.4 0.9-2.4 2.1v11.8c0 1.2 1.1 2.1 2.4 2.1h11.3c1.3 0 2.4-0.9 2.4-2.1V9.1C23 7.9 22 7 20.6 7zM18.6 9.2c0-0.3 0.2-0.5 0.5-0.5h1.7c0.3 0 0.5 0.2 0.5 0.5v1.7c0 0.3-0.2 0.5-0.5 0.5h-1.7c-0.3 0-0.5-0.2-0.5-0.5V9.2zM17.7 11.7v0c0 0 0 0 0 0H17.7zM14.9 12c2 0 3.5 1.6 3.5 3.5 0 2-1.6 3.5-3.5 3.5 -2 0-3.5-1.6-3.5-3.5C11.4 13.6 13 12 14.9 12zM22 20.7c0 0.8-0.6 1.4-1.4 1.4H9.3c-0.8 0-1.4-0.6-1.4-1.4V13.3h2.9c-0.3 0.7-0.5 1.4-0.5 2.2 0 2.6 2.1 4.7 4.7 4.7 2.6 0 4.7-2.1 4.7-4.7 0-0.7-0.2-1.4-0.5-2h2.8V20.7z' })
	          );
	          break;
	        case 'brand':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '27', height: '29', viewBox: '0 0 26.8 29.1', className: className },
	            _react2.default.createElement('path', { d: 'M10.7 0v12L0 5.3v13.7l1.4 0.9v-2.3l0 0V7.8l9.3 5.9v0l3.9 2.5v10.4 0l0 1.7 1.4 0.9v-12.1l10.7 6.8v-13.8L10.7 0zM25.4 21.3l-9.3-5.9 -3.9-2.5V2.5l13.2 8.3V21.3z', fill: '#c59f67' })
	          );
	          break;
	        case 'double_arrow_down':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '15', height: '20', viewBox: '0 0 14.6 19.9', className: className },
	            _react2.default.createElement('polygon', { points: '7.3 8.7 0 1.4 1.4 0 7.3 5.9 13.2 0 14.6 1.4 ', fill: '#FFF' }),
	            _react2.default.createElement('polygon', { points: '7.3 19.9 0 12.6 1.4 11.2 7.3 17.1 13.2 11.2 14.6 12.6 ', fill: '#FFF' })
	          );
	          break;
	        case 'circled_brand':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '94', height: '94', viewBox: '0 0 94.5 94.5', className: className },
	            _react2.default.createElement('circle', { cx: '47.2', cy: '47.2', r: '47.2', fill: '#CBA764' }),
	            _react2.default.createElement('path', { d: 'M44 27.7v15.7l-14-8.8v17.9l1.8 1.1v-2.9l0 0V37.9l12.1 7.6v0l5.1 3.2V62.3v-0.1l0 2.2 1.8 1.1V49.9l14 8.8V40.8L44 27.7zM63 55.4l-12.1-7.7L45.8 44.5V31l17.2 10.8V55.4z', fill: '#FFF' })
	          );
	          break;
	        case 'circled_diseno':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '125', height: '122', viewBox: '0 0 125 121.8', className: className },
	            _react2.default.createElement('circle', { cx: '63', cy: '59.7', r: '59.3', fill: '#CBA764' }),
	            _react2.default.createElement('path', { d: 'M50 69.9c-2.3-2.9-3.5-6.4-3.5-10.2 0-9.1 7.4-16.5 16.5-16.5 9.1 0 16.5 7.4 16.5 16.5 0 3.6-1.2 7.1-3.3 10l-2-1.5c1.9-2.4 2.8-5.4 2.8-8.4 0-7.7-6.3-14-14-14 -7.7 0-14 6.3-14 14 0 3.2 1 6.1 3 8.6L50 69.9z', fill: '#fff' }),
	            _react2.default.createElement('path', { d: 'M50.6 82c-8.1-4.5-13.1-13.1-13.1-22.3 0-10.3 6.1-19.5 15.6-23.5l1 2.3c-8.5 3.6-14.1 11.9-14.1 21.2 0 8.3 4.5 16.1 11.8 20.1L50.6 82z', fill: '#fff' }),
	            _react2.default.createElement('path', { d: 'M63 85.2v-2.5c12.7 0 23-10.3 23-23s-10.3-23-23-23v-2.5c14.1 0 25.5 11.5 25.5 25.5C88.5 73.8 77.1 85.2 63 85.2z', fill: '#fff' }),
	            _react2.default.createElement('path', { d: 'M63 94.6c-8.9 0-17.3-3.3-23.8-9.4 -6.8-6.4-10.7-15-11-24.3 -0.6-19.2 14.5-35.4 33.8-36l0.1 2.5c-17.9 0.6-31.9 15.6-31.3 33.4 0.3 8.6 3.9 16.7 10.2 22.6 6.3 5.9 14.5 9 23.2 8.7 17.9-0.6 31.9-15.6 31.3-33.4l2.5-0.1c0.6 19.2-14.5 35.4-33.8 36C63.7 94.6 63.3 94.6 63 94.6z', fill: '#fff' }),
	            _react2.default.createElement('path', { d: 'M94.3 51.3C91.1 39.5 81.3 30.3 69.3 27.9l0.5-2.5c12.9 2.6 23.5 12.5 26.9 25.2L94.3 51.3z', fill: '#fff' }),
	            _react2.default.createElement('path', { d: 'M63 67.5c-4.3 0-7.8-3.5-7.8-7.8 0-4.3 3.5-7.8 7.8-7.8 4.3 0 7.8 3.5 7.8 7.8C70.8 64 67.3 67.5 63 67.5zM63 54.4c-2.9 0-5.3 2.4-5.3 5.3 0 2.9 2.4 5.3 5.3 5.3 2.9 0 5.3-2.4 5.3-5.3C68.3 56.8 65.9 54.4 63 54.4z', fill: '#fff' }),
	            _react2.default.createElement('path', { d: 'M63 76.2c-3.6 0-6.9-1.1-9.8-3.2l1.5-2c2.6 1.9 5.6 2.8 8.8 2.7 2.8-0.1 5.5-1 7.7-2.6l1.5 2c-2.7 1.9-5.8 3-9.1 3.1C63.3 76.2 63.2 76.2 63 76.2z', fill: '#fff' })
	          );
	          break;
	        case 'circled_coordinacion':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '125', height: '122', viewBox: '0 0 125 121.8', className: className },
	            _react2.default.createElement('circle', { cx: '62.5', cy: '60.9', r: '59.3', fill: '#CBA764' }),
	            _react2.default.createElement('path', { d: 'M62.5 68.2c-1.9 0-3.8-0.8-5.2-2.1 -2.8-2.8-2.8-7.5 0-10.3 1.4-1.4 3.2-2.1 5.2-2.1 1.9 0 3.8 0.8 5.2 2.1 2.8 2.8 2.8 7.5 0 10.3C66.3 67.5 64.4 68.2 62.5 68.2zM62.5 56.1c-1.3 0-2.5 0.5-3.4 1.4 -1.9 1.9-1.9 4.9 0 6.8 0.9 0.9 2.1 1.4 3.4 1.4 1.3 0 2.5-0.5 3.4-1.4 1.9-1.9 1.9-4.9 0-6.8C65 56.6 63.8 56.1 62.5 56.1z', fill: '#FFF' }),
	            _react2.default.createElement('polygon', { points: '83.9 48.5 82.1 50.3 91.6 59.7 76 59.7 76 62.2 91.5 62.2 82.1 71.7 83.9 73.4 96.3 61 ', fill: '#FFF' }),
	            _react2.default.createElement('polygon', { points: '74.9 39.6 62.5 27.1 50 39.6 51.8 41.3 61.2 31.9 61.2 47.4 63.7 47.4 63.7 31.9 73.2 41.3 ', fill: '#FFF' }),
	            _react2.default.createElement('polygon', { points: '49 59.6 33.5 59.6 42.9 50.2 41.1 48.4 28.7 60.9 41.1 73.3 42.9 71.6 33.4 62.1 49 62.1 ', fill: '#FFF' }),
	            _react2.default.createElement('polygon', { points: '73.3 80.5 63.8 90 63.8 74.4 61.3 74.4 61.3 90 51.8 80.5 50.1 82.3 62.5 94.8 75 82.3 ', fill: '#FFF' })
	          );
	          break;
	        case 'circled_calidad':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '125', height: '122', viewBox: '0 0 125 121.8', className: className },
	            _react2.default.createElement('circle', { cx: '62.5', cy: '61.1', r: '59.3', fill: '#CBA764' }),
	            _react2.default.createElement('polygon', { points: '80.5 88.5 62.5 75.4 44.5 88.5 51.4 67.3 33.3 54.2 55.6 54.2 62.5 33 68.3 50.9 65.9 51.7 62.5 41.1 57.4 56.7 41 56.7 54.3 66.3 49.2 81.9 62.5 72.3 75.8 81.9 70.7 66.3 84 56.7 75.1 56.7 75.1 54.2 91.7 54.2 73.6 67.3 ', fill: '#FFF' }),
	            _react2.default.createElement('polygon', { points: '61.8 68 55.9 60.9 57.8 59.3 61.8 64 83.3 37.3 85.2 38.9 ', fill: '#FFF' })
	          );
	          break;
	        case 'carousel_left':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '10', height: '14', viewBox: '0 0 7.9 14.1', className: className },
	            _react2.default.createElement('polyline', { points: '7.4 0.5 0.8 7.1 7.5 13.7 ', fill: 'none', stroke: '#CBA764', strokeWidth: '2' })
	          );
	          break;
	        case 'carousel_right':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '10', height: '14', viewBox: '0 0 7.9 14.1', className: className },
	            _react2.default.createElement('polyline', { points: '0.9 13.7 7.5 7.1 0.8 0.5 ', fill: 'none', stroke: '#CBA764', strokeWidth: '2' })
	          );
	          break;
	        case 'servicios_entrevista':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '119', height: '119', viewBox: '0 0 118.6 118.6', className: className },
	            _react2.default.createElement('circle', { cx: '59.3', cy: '59.3', r: '59.3', fill: '#FFB69F' }),
	            _react2.default.createElement('rect', { x: '27', y: '28.5', width: '64.6', height: '61.6', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('circle', { cx: '38.4', cy: '59.3', r: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('circle', { cx: '80.2', cy: '59.3', r: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('circle', { cx: '59.3', cy: '78.7', r: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('circle', { cx: '59.3', cy: '39.9', r: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' })
	          );
	          break;
	        case 'servicios_conceptualizacion':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '119', height: '119', viewBox: '0 0 118.6 118.6', className: className },
	            _react2.default.createElement('circle', { cx: '59.3', cy: '59.3', r: '59.3', fill: '#FFB69F' }),
	            _react2.default.createElement('rect', { x: '28.5', y: '28.1', width: '61.6', height: '62', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '56.3', y: '70.1', width: '25.8', height: '10.9', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '35.8', y: '36.1', width: '11.4', height: '26.7', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '35.8', y: '70.1', width: '11.4', height: '10.9', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '56.3', y: '36.1', width: '25.8', height: '26.7', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '82.1', y1: '62.7', x2: '56.3', y2: '36.1', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '82.1', y1: '51.2', x2: '67.5', y2: '36.1', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '71', y1: '62.7', x2: '56.3', y2: '47.6', fill: 'none', strokeWidth: '3', stroke: '#fff' })
	          );
	          break;
	        case 'servicios_proyecto':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '119', height: '119', viewBox: '0 0 118.6 118.6', className: className },
	            _react2.default.createElement('circle', { cx: '59.2', cy: '59.3', r: '59.3', fill: '#FFB69F' }),
	            _react2.default.createElement('polyline', { points: '90.7 45.8 90.7 90.8 27.6 90.8 27.6 29.2 90.7 29.2 90.7 34.1 ', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('polyline', { points: '73.8 68.2 90.7 68.2 90.7 90.8 57.2 90.8 57.2 68.2 61 68.2 ', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('polyline', { points: '27.6 68.2 46.4 68.2 46.4 81.4 ', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '90.7', y1: '59.5', x2: '56.1', y2: '59.5', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '46.9', y1: '28.8', x2: '46.9', y2: '59.1', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '54.8', y: '37.5', width: '27.8', height: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '64.8', y: '73.8', width: '17.8', height: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '33.3', y: '73.8', width: '7.9', height: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '33.3', y: '37.5', width: '7.9', height: '11.4', fill: 'none', strokeWidth: '3', stroke: '#fff' })
	          );
	          break;
	        case 'servicios_ejecucion':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '119', height: '119', viewBox: '0 0 118.6 118.6', className: className },
	            _react2.default.createElement('circle', { cx: '59.3', cy: '59.3', r: '59.3', fill: '#FFB69F' }),
	            _react2.default.createElement('rect', { x: '28.5', y: '28.3', width: '61.6', height: '62', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '55.9', y: '66.7', width: '6.9', height: '12.2', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '56.1', y1: '78.9', x2: '56.1', y2: '83', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('line', { x1: '76.8', y1: '78.9', x2: '76.8', y2: '83', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '66.3', y: '38.2', width: '16', height: '20.1', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('rect', { x: '71.2', y: '68.5', width: '18.9', height: '10.4', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('path', { d: 'M77.8 72.8c0.5 0 0.9 0.4 0.9 0.9s-0.4 0.9-0.9 0.9 -0.9-0.4-0.9-0.9S77.3 72.8 77.8 72.8M77.8 71.5c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2S79 71.5 77.8 71.5L77.8 71.5z', fill: '#FFF' }),
	            _react2.default.createElement('polyline', { points: '56.1 78.9 28.5 78.9 28.5 70.9 55.7 70.9', fill: 'none', strokeWidth: '3', stroke: '#fff' }),
	            _react2.default.createElement('polyline', { points: '56.1 70.9 28.5 70.9 28.5 58.3 59.3 58.3 59.3 66.7', fill: 'none', strokeWidth: '3', stroke: '#fff' })
	          );
	          break;
	        case 'location':
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '18', height: '30', viewBox: '0 0 17.5 30', className: className },
	            _react2.default.createElement('path', { d: 'M8.8 5.4c-1.8 0-3.3 1.5-3.3 3.3 0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3C12.1 6.9 10.6 5.4 8.8 5.4zM8.8 10.1c-0.8 0-1.4-0.6-1.4-1.4 0-0.8 0.6-1.4 1.4-1.4 0.8 0 1.4 0.6 1.4 1.4C10.1 9.5 9.5 10.1 8.8 10.1z', fill: '#CBA764' }),
	            _react2.default.createElement('path', { d: 'M8.8 0C3.9 0 0 3.9 0 8.8c0 1.1 0.2 2.1 0.6 3.2L7.9 29.4C8 29.8 8.4 30 8.8 30c0 0 0 0 0 0 0.4 0 0.8-0.2 0.9-0.6l7.3-17.5c0.4-1 0.6-2.1 0.6-3.1C17.5 3.9 13.6 0 8.8 0zM15.1 11.3L8.8 26.5 2.5 11.5l-0.1-0.3C2.1 10.4 2 9.6 2 8.8c0-3.8 3.1-6.8 6.8-6.8 3.8 0 6.8 3.1 6.8 6.8C15.6 9.6 15.4 10.4 15.1 11.3z', fill: '#CBA764' })
	          );
	          break;
	        default:
	          return _react2.default.createElement(
	            'svg',
	            { xmlns: 'http://www.w3.org/2000/svg', width: '30', height: '30', viewBox: '0 0 30 30', className: className },
	            _react2.default.createElement('circle', { cx: '15', cy: '15', r: '15' }),
	            _react2.default.createElement('path', { d: 'M16.6 25.1v-9.2h3.2l0.5-3.6h-3.7v-2.3c0-1 0.3-1.7 1.9-1.7l2 0V5.1c-0.3 0-1.5-0.1-2.9-0.1 -2.9 0-4.8 1.7-4.8 4.7v2.6H9.5v3.6h3.2v9.2H16.6z' })
	          );
	        /*eslint-enable */
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.renderItems(this.props.network, this.props.className);
	    }
	  }]);

	  return SVG;
	}(_react2.default.Component);

	exports.default = SVG;

	SVG.propTypes = {
	  background: _react2.default.PropTypes.string,
	  color: _react2.default.PropTypes.string,
	  network: _react2.default.PropTypes.string,
	  className: _react2.default.PropTypes.string
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___cfX-h","vCenter":"style__vCenter___ZA14l","navbarBrand":"style__navbarBrand___2rqc0","toggleButton":"style__toggleButton___3q8M1","navbarNavAnchor":"style__navbarNavAnchor___37QYF","vCenterRel":"style__vCenterRel___1GkYt","navbarIcons":"style__navbarIcons___jZlWo","sm_icon":"style__sm_icon___3hlQn","hCenter":"style__hCenter___2Rj-i","inheritHeight":"style__inheritHeight___2LMcf","hideOverflow":"style__hideOverflow___3olA9","icon-sprites":"style__icon-sprites___1xY5y","navbarWrapper":"style__navbarWrapper___VqN0H","navbarDefault":"style__navbarDefault___aolZK","navbarHeader":"style__navbarHeader___2FrdS","iconBar":"style__iconBar___1hD4n","navbarCollapse":"style__navbarCollapse___3blFh","navbarNav":"style__navbarNav___1r3v1","facebook":"style__facebook___5X5oX"};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _powered = __webpack_require__(21);

	var _powered2 = _interopRequireDefault(_powered);

	var _simplecontact = __webpack_require__(23);

	var _simplecontact2 = _interopRequireDefault(_simplecontact);

	var _simplesitemap = __webpack_require__(24);

	var _simplesitemap2 = _interopRequireDefault(_simplesitemap);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var style = __webpack_require__(22);

	var FooterAAA = function (_React$Component) {
	  _inherits(FooterAAA, _React$Component);

	  function FooterAAA() {
	    _classCallCheck(this, FooterAAA);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FooterAAA).apply(this, arguments));
	  }

	  _createClass(FooterAAA, [{
	    key: 'getIcons',
	    value: function getIcons(data) {
	      return data.map(function (item, index) {
	        return _react2.default.createElement(
	          'div',
	          { key: index, className: 'col-xs-6 col-md-3' },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: item.url, className: style.sm_icon, id: item.url, target: '_blank' },
	            _react2.default.createElement(_svg2.default, { network: item.title, className: style[item.title] })
	          )
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: style.footerWrapper },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid ' + style.container },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-md-2' },
	              _react2.default.createElement(_simplesitemap2.default, { data: this.props.items })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-6' },
	              _react2.default.createElement(_simplecontact2.default, null)
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-4' },
	              _react2.default.createElement(
	                'div',
	                { className: 'row' },
	                this.getIcons(this.props.icons)
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(_powered2.default, null)
	      );
	    }
	  }]);

	  return FooterAAA;
	}(_react2.default.Component);

	exports.default = FooterAAA;


	FooterAAA.propTypes = {
	  items: _react2.default.PropTypes.array.isRequired,
	  addresses: _react2.default.PropTypes.array,
	  icons: _react2.default.PropTypes.array
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var style = __webpack_require__(22);

	var Powered = function (_React$Component) {
	  _inherits(Powered, _React$Component);

	  function Powered() {
	    _classCallCheck(this, Powered);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Powered).apply(this, arguments));
	  }

	  _createClass(Powered, [{
	    key: 'render',
	    value: function render() {
	      var data = [{
	        name: 'POOL',
	        url: 'http://somospool.com',
	        title: 'somos pool'
	      }, {
	        name: 'MINT',
	        url: 'http://mintitmedia.com',
	        title: 'Diseño y Desarrollo Web en Tijuana'
	      }];

	      return _react2.default.createElement(
	        'div',
	        { className: style.powered },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-6' },
	              'Todos los derechos reservados © Lasermedica'
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-6' },
	              'Un proyecto de: ',
	              _react2.default.createElement(
	                'a',
	                { href: data[0].url, title: data[0].title, target: '_blank' },
	                data[0].name
	              ),
	              '   Código por: ',
	              _react2.default.createElement(
	                'a',
	                { href: data[1].url, title: data[1].title, target: '_blank' },
	                data[1].name
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Powered;
	}(_react2.default.Component);

	exports.default = Powered;

/***/ },
/* 22 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3sp06","vCenter":"style__vCenter___2G-_B","vCenterRel":"style__vCenterRel___3pk1i","hCenter":"style__hCenter___uDimH","inheritHeight":"style__inheritHeight___1W6vZ","hideOverflow":"style__hideOverflow___1oOYw","icon-sprites":"style__icon-sprites___3Wvbf","footerWrapper":"style__footerWrapper___LwV_7","container":"style__container___1CyCK","sitemap":"style__sitemap___130Ar","facebook":"style__facebook___3bmod","contact_info":"style__contact_info___pUiM_","powered":"style__powered___3yTUa","serviceTitle":"style__serviceTitle___3QrAo"};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var style = __webpack_require__(22);

	var SimpleContact = function (_React$Component) {
	  _inherits(SimpleContact, _React$Component);

	  function SimpleContact() {
	    _classCallCheck(this, SimpleContact);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SimpleContact).apply(this, arguments));
	  }

	  _createClass(SimpleContact, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: style.contact_info },
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: 'contacto', title: 'Contáctanos' },
	          'Contáctanos'
	        ),
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: 'mailto:info@mintitmedia.com', title: 'Contáctanos' },
	          'info@mintitmedia.com'
	        ),
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: 'contacto', title: 'Contáctanos' },
	          '(664)308-2240'
	        ),
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: 'https://www.google.com.mx/maps/@32.5019264,-116.9870849,17.44z?hl=en', title: 'Contáctanos' },
	          'Calle Sacramento #4872, Col. El Paraíso, Tijuana B. C. México'
	        )
	      );
	    }
	  }]);

	  return SimpleContact;
	}(_react2.default.Component);

	exports.default = SimpleContact;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var style = __webpack_require__(22);

	var SiteMap = function (_React$Component) {
	  _inherits(SiteMap, _React$Component);

	  function SiteMap() {
	    _classCallCheck(this, SiteMap);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SiteMap).apply(this, arguments));
	  }

	  _createClass(SiteMap, [{
	    key: 'getItems',
	    value: function getItems(data) {
	      var _this2 = this;

	      var items = data.map(function (item, index) {
	        var children = item.children ? _this2.getItems(item.children) : null;

	        return _react2.default.createElement(
	          'li',
	          { key: index },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: item.url },
	            item.title
	          ),
	          children
	        );
	      }, this);
	      return _react2.default.createElement(
	        'ul',
	        { className: style.sitemap },
	        items
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.getItems(this.props.data);
	    }
	  }]);

	  return SiteMap;
	}(_react2.default.Component);

	exports.default = SiteMap;


	SiteMap.propTypes = {
	  data: _react2.default.PropTypes.array.isRequired
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* eslint max-len: [2, 600, 4] */
	var scropllInProgress = false;

	function getScrollTo(section, elementID) {
	  var topElements = ['inicio', 'nosotros', 'equipo', 'servicios', 'contacto'];
	  if (topElements.indexOf(elementID) !== -1 || section === 'contacto') {
	    return 0;
	  }
	  return $('#' + elementID).offset().top - 220;
	}

	exports.default = function (location) {
	  // todo: get topElements from sitemap and improve exceptions "elementID"
	  var bits = location.pathname.split('/');
	  var elementID = location.pathname ? bits.pop() || 'inicio' : 'inicio';
	  if ($('.menu_trigger').is(':visible') && bits.length === 1) {
	    elementID = 'inicio';
	  }
	  if (bits[1] === 'contacto') {
	    elementID = 'contacto';
	  }
	  if ($('#' + elementID).length && !scropllInProgress) {
	    scropllInProgress = true;
	    var scrollTo = getScrollTo(bits[1], elementID);
	    var srolltime = 100;
	    var rootTag = typeof document.body.scrollTop !== 'undefined' ? 'body' : 'html, body';
	    $(rootTag).animate({
	      scrollTop: scrollTo
	    }, srolltime, 'swing', function () {
	      scropllInProgress = false;
	    });
	  }
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (elementID) {
	  $('.navbar-nav li.active').removeClass('active');
	  $('.navbar-nav a#' + elementID).parent().addClass('active');
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rest = __webpack_require__(28);

	var _rest2 = _interopRequireDefault(_rest);

	var _mime = __webpack_require__(29);

	var _mime2 = _interopRequireDefault(_mime);

	var _errorCode = __webpack_require__(30);

	var _errorCode2 = _interopRequireDefault(_errorCode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _rest2.default.wrap(_mime2.default, { mime: 'application/json' }).wrap(_errorCode2.default, { code: 300 });

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("rest");

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require("rest/interceptor/mime");

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("rest/interceptor/errorCode");

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(32);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(34);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(35);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(36);

	var _block8 = _interopRequireDefault(_block7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HomeSection = function (_React$Component) {
	  _inherits(HomeSection, _React$Component);

	  function HomeSection() {
	    _classCallCheck(this, HomeSection);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(HomeSection).apply(this, arguments));
	  }

	  _createClass(HomeSection, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var block1 = _props$data.block1;
	      var block2 = _props$data.block2;
	      var block3 = _props$data.block3;
	      var block4 = _props$data.block4;


	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2 }),
	        _react2.default.createElement(_block6.default, { data: block3 }),
	        _react2.default.createElement(_block8.default, { data: block4 })
	      ) : null;
	    }
	  }]);

	  return HomeSection;
	}(_react2.default.Component);

	exports.default = HomeSection;


	HomeSection.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _imageUtil = __webpack_require__(33);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	// const style = require('./style.scss');

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block1).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var buttons = _props$data.buttons;
	      var images = _props$data.images;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-10 col-xs-12' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button1.href },
	                buttons.button1.title
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block1;
	}(_react2.default.Component);

	exports.default = Block1;


	Block1.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getImageBackground = getImageBackground;
	exports.normalizeImageUrl = normalizeImageUrl;

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getImageBackground(data) {
	  var imgUrl = '';
	  if (_lodash2.default.isObject(data) && data.src) {
	    imgUrl = data.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
	  } else if (_lodash2.default.isString(data) && data) {
	    imgUrl = data.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
	  }
	  return imgUrl ? {
	    backgroundImage: 'url(' + imgUrl + ')'
	  } : null;
	} /* eslint max-len: [2, 500, 4] */


	function normalizeImageUrl(data) {
	  return data.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// const style = require('./style.scss');

	var Block2 = function (_React$Component) {
	  _inherits(Block2, _React$Component);

	  function Block2() {
	    _classCallCheck(this, Block2);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block2).apply(this, arguments));
	  }

	  _createClass(Block2, [{
	    key: 'render',
	    value: function render() {
	      var buttons = this.props.data.buttons;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement('div', { className: 'col-sm1' }),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-2 col-xs-12' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button1.href },
	                buttons.button1.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-2 col-xs-12' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button2.href },
	                buttons.button2.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-2 col-xs-12' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button3.href },
	                buttons.button3.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-2 col-xs-12' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button4.href },
	                buttons.button4.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-2 col-xs-12' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button5.href },
	                buttons.button5.title
	              )
	            ),
	            _react2.default.createElement('div', { className: 'col-sm1' })
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block2;
	}(_react2.default.Component);

	exports.default = Block2;


	Block2.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _imageUtil = __webpack_require__(33);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	// const style = require('./style.scss');

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block3).apply(this, arguments));
	  }

	  _createClass(Block3, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var buttons = _props$data.buttons;
	      var images = _props$data.images;
	      var paragraphs = _props$data.paragraphs;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-10 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                null,
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'p',
	                null,
	                paragraphs.paragraph1
	              ),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button1.href },
	                buttons.button1.title
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block3;
	}(_react2.default.Component);

	exports.default = Block3;


	Block3.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _carousel = __webpack_require__(37);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(38);

	var Block4 = function (_React$Component) {
	  _inherits(Block4, _React$Component);

	  function Block4() {
	    _classCallCheck(this, Block4);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block4).apply(this, arguments));
	  }

	  _createClass(Block4, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className + ' ' + (style.item || ''), key: index },
	            _react2.default.createElement('img', { src: item.image, alt: item.title })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var slides = _props$data.slides;
	      var paragraphs = _props$data.paragraphs;
	      var buttons = _props$data.buttons;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        }
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                null,
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'p',
	                null,
	                paragraphs.paragraph1
	              ),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button1.href },
	                buttons.button1.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                _carousel2.default,
	                { id: 'carousel-home-block-4', interval: 8000, indicators: false, classes: carouselClasses },
	                this.renderItems(slides)
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block4;
	}(_react2.default.Component);

	exports.default = Block4;


	Block4.propTypes = {
	  data: _react2.default.PropTypes.object,
	  classes: _react2.default.PropTypes.object
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var Carousel = function (_React$Component) {
	  _inherits(Carousel, _React$Component);

	  function Carousel() {
	    _classCallCheck(this, Carousel);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Carousel).apply(this, arguments));
	  }

	  _createClass(Carousel, [{
	    key: 'getIndicators',
	    value: function getIndicators(data, flag, sliderId) {
	      var indicators = [];
	      if (flag !== false && _lodash2.default.isArray(data) && data.length) {
	        indicators = data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          return _react2.default.createElement('li', { 'data-target': '#' + sliderId, 'data-slide-to': index, className: className, key: index });
	        });
	      }
	      return _react2.default.createElement(
	        'ol',
	        { className: 'carousel-indicators' },
	        indicators
	      );
	    }
	  }, {
	    key: 'getControls',
	    value: function getControls(flag, id, classes) {
	      var base = classes.base;
	      var prev = classes.prev;
	      var next = classes.next;
	      var arrow = classes.arrow;

	      if (flag !== false) {
	        return _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'a',
	            { className: 'left carousel-control ' + (base || '') + ' ' + (prev || ''), href: '#' + id, role: 'button', 'data-slide': 'prev' },
	            _react2.default.createElement(_svg2.default, { network: 'carousel_left', className: arrow }),
	            _react2.default.createElement(
	              'span',
	              { className: 'sr-only' },
	              'Previous'
	            )
	          ),
	          _react2.default.createElement(
	            'a',
	            { className: 'right carousel-control ' + (base || '') + ' ' + (next || ''), href: '#' + id, role: 'button', 'data-slide': 'next' },
	            _react2.default.createElement(_svg2.default, { network: 'carousel_right', className: arrow }),
	            _react2.default.createElement(
	              'span',
	              { className: 'sr-only' },
	              'Next'
	            )
	          )
	        );
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var id = _props.id;
	      var interval = _props.interval;
	      var children = _props.children;
	      var indicators = _props.indicators;
	      var controls = _props.controls;
	      var classes = _props.classes;

	      return _react2.default.createElement(
	        'div',
	        { id: id, className: 'carousel slide', 'data-ride': 'carousel', 'data-interval': interval || 5000 },
	        _react2.default.createElement(
	          'div',
	          { className: 'carousel-inner ' + (classes.inner || ''), role: 'listbox' },
	          this.getIndicators(children, indicators, id),
	          children,
	          this.getControls(controls, id, classes.controls)
	        )
	      );
	    }
	  }]);

	  return Carousel;
	}(_react2.default.Component);

	exports.default = Carousel;


	Carousel.propTypes = {
	  id: _react2.default.PropTypes.string.isRequired,
	  interval: _react2.default.PropTypes.number.isRequired,
	  children: _react2.default.PropTypes.any,
	  indicators: _react2.default.PropTypes.bool,
	  controls: _react2.default.PropTypes.bool,
	  classes: _react2.default.PropTypes.object
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___2Xb8X","vCenter":"style__vCenter___hmun0","vCenterRel":"style__vCenterRel___2lPVo","hCenter":"style__hCenter___1JZnn","inheritHeight":"style__inheritHeight___1rILl","hideOverflow":"style__hideOverflow___1Q2PJ","icon-sprites":"style__icon-sprites___38gIr","wrapper1":"style__wrapper1___3ANK2","wrapper2":"style__wrapper2___2RaJ7","sideSwipe":"style__sideSwipe___2Dk6P","button1":"style__button1___1hNj-","button2":"style__button2___1PxHI","button3":"style__button3___1BqYh","title1":"style__title1___25IAx","title2":"style__title2___wfjef","title4":"style__title4____YoIR","title5":"style__title5___T2PV8","title6":"style__title6___G7Bi3","title3":"style__title3___EBeus","title7":"style__title7___18HEf","title8":"style__title8___1HuLF","image1":"style__image1___3Iegh","image":"style__image___t1t90","paragraph1":"style__paragraph1___1KYt4","paragraph2":"style__paragraph2___2j4Qo","paragraph3":"style__paragraph3___29XST","paragraph4":"style__paragraph4___3QuOc","paragraph5":"style__paragraph5___39V90"};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(40);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(43);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(45);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(47);

	var _block8 = _interopRequireDefault(_block7);

	var _block9 = __webpack_require__(49);

	var _block10 = _interopRequireDefault(_block9);

	var _block11 = __webpack_require__(54);

	var _block12 = _interopRequireDefault(_block11);

	var _block13 = __webpack_require__(56);

	var _block14 = _interopRequireDefault(_block13);

	var _data = __webpack_require__(57);

	var _data2 = _interopRequireDefault(_data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// const style = require('./style.scss');

	var AboutSection = function (_React$Component) {
	  _inherits(AboutSection, _React$Component);

	  function AboutSection() {
	    _classCallCheck(this, AboutSection);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(AboutSection).apply(this, arguments));
	  }

	  _createClass(AboutSection, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var params = _props.params;
	      var data = _props.data;
	      var block1 = data.block1;
	      var block2 = data.block2;
	      var block3 = data.block3;
	      var block4 = data.block4;
	      var block5 = data.block5;
	      var block7 = data.block7;
	      var block8 = data.block8;
	      var showListItem = params.showListItem;

	      var block3Variations = {
	        variation1: 'class1'
	      };
	      var block5Variations = {
	        variation1: 'class1'
	      };

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2 }),
	        _react2.default.createElement(_block6.default, { data: block3, variations: block3Variations }),
	        _react2.default.createElement(_block8.default, { data: block4 }),
	        _react2.default.createElement(_block6.default, { data: block5, variations: block5Variations }),
	        _react2.default.createElement(_block10.default, { data: _data2.default, showListItem: showListItem }),
	        _react2.default.createElement(_block12.default, { data: block7 }),
	        _react2.default.createElement(_block14.default, { data: block8 })
	      ) : null;
	    }
	  }]);

	  return AboutSection;
	}(_react2.default.Component);

	exports.default = AboutSection;


	AboutSection.propTypes = {
	  data: _react2.default.PropTypes.object,
	  params: _react2.default.PropTypes.any
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactRouter = __webpack_require__(4);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _imageUtil = __webpack_require__(33);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(42);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block1).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'render',
	    value: function render() {
	      var styles = this.props.style;
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var paragraphs = _props$data.paragraphs;
	      var images = _props$data.images;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle, className: style.mainbanner + ' ' + (styles ? styles.wrapper : '') },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-6 col-sm-offset-3' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title3 },
	                titles.title1
	              ),
	              _react2.default.createElement('p', { className: style.paragraph3, dangerouslySetInnerHTML: (0, _sanitize2.default)(paragraphs.paragraph1) }),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: '/inicio' },
	                _react2.default.createElement(_svg2.default, { network: 'double_arrow_down', className: style.svg })
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block1;
	}(_react2.default.Component);

	exports.default = Block1;


	Block1.propTypes = {
	  data: _react2.default.PropTypes.object,
	  style: _react2.default.PropTypes.object
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (data) {
	  return {
	    __html: data
	  };
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___31Hcb","vCenter":"style__vCenter___1vIHp","vCenterRel":"style__vCenterRel___370S2","hCenter":"style__hCenter___35qeO","inheritHeight":"style__inheritHeight___1sRB4","hideOverflow":"style__hideOverflow___3Yokh","icon-sprites":"style__icon-sprites___1i1iv","sideSwipe":"style__sideSwipe___3OFJQ","button1":"style__button1___knh5C","button2":"style__button2___3rlK3","button3":"style__button3___2KaTC","title1":"style__title1___1LlDm","title2":"style__title2___3ep2l","title4":"style__title4___1U9Z2","title5":"style__title5___1Vr2v","title6":"style__title6___2K-qx","title3":"style__title3___1URy1","title7":"style__title7___3y_yN","title8":"style__title8___1urYo","paragraph1":"style__paragraph1___8Df9P","paragraph2":"style__paragraph2___KQkCk","paragraph3":"style__paragraph3___2Y3uZ","paragraph4":"style__paragraph4___2iSO1","paragraph5":"style__paragraph5___iOq2N","mainbanner":"style__mainbanner___3hjPv","svg":"style__svg___29LI3"};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactRouter = __webpack_require__(4);

	var _imageUtil = __webpack_require__(33);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	var _carousel = __webpack_require__(37);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(44);

	var Block2 = function (_React$Component) {
	  _inherits(Block2, _React$Component);

	  function Block2() {
	    _classCallCheck(this, Block2);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block2).apply(this, arguments));
	  }

	  _createClass(Block2, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className, key: index },
	            _react2.default.createElement(
	              'h3',
	              null,
	              item.title
	            ),
	            _react2.default.createElement('div', { dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content) })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var images = _props$data.images;
	      var buttons = _props$data.buttons;
	      var slides = _props$data.slides;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        }
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle, className: style.mainbanner },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                _carousel2.default,
	                { id: 'carousel-about-block-2', interval: 8000, controls: false, classes: carouselClasses },
	                this.renderItems(slides)
	              ),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: buttons.button1.href },
	                buttons.button1.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title3 },
	                titles.title1
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block2;
	}(_react2.default.Component);

	exports.default = Block2;


	Block2.propTypes = {
	  data: _react2.default.PropTypes.object,
	  style: _react2.default.PropTypes.object
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___xP6Z-","vCenter":"style__vCenter___3EDwH","vCenterRel":"style__vCenterRel___1d1I_","hCenter":"style__hCenter___3LKuT","inheritHeight":"style__inheritHeight___11OVE","hideOverflow":"style__hideOverflow___1koJ0","icon-sprites":"style__icon-sprites___2uiLf","sideSwipe":"style__sideSwipe___19HIU","button1":"style__button1___ma4vA","button2":"style__button2___1Fwzx","button3":"style__button3___3p2Pg","title1":"style__title1___2c1PC","title2":"style__title2___U0Za7","title4":"style__title4___c-0OO","title5":"style__title5___XOjHY","title6":"style__title6___2E_cG","title3":"style__title3___qpZuD","title7":"style__title7___21JO_","title8":"style__title8___36gBQ","paragraph1":"style__paragraph1___1m33N","paragraph2":"style__paragraph2___3OtNY","paragraph3":"style__paragraph3___3qs1J","paragraph4":"style__paragraph4___3oqJH","paragraph5":"style__paragraph5___akVWK","mainbanner":"style__mainbanner___37cO7","svg":"style__svg___25w61"};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _imageUtil = __webpack_require__(33);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(46);

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block3).apply(this, arguments));
	  }

	  _createClass(Block3, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var data = _props.data;
	      var variations = _props.variations;
	      var titles = data.titles;
	      var images = data.images;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle, className: style.mainbanner },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-12 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title3 + ' ' + variations.variation1 },
	                titles.title1
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block3;
	}(_react2.default.Component);

	exports.default = Block3;


	Block3.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired,
	  variations: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1cV0K","vCenter":"style__vCenter___36W6o","vCenterRel":"style__vCenterRel___1YqGI","hCenter":"style__hCenter___3Rsy5","inheritHeight":"style__inheritHeight___2L2YW","hideOverflow":"style__hideOverflow___R7Nky","icon-sprites":"style__icon-sprites___1R2yV","sideSwipe":"style__sideSwipe___1wQDY","button1":"style__button1___ysj8P","button2":"style__button2___3T26W","button3":"style__button3___1B5ky","title1":"style__title1___36WkF","title2":"style__title2___21MoW","title4":"style__title4___3vPE_","title5":"style__title5___1hZAj","title6":"style__title6___3ZgkO","title3":"style__title3___WdO4l","title7":"style__title7___3fXSj","title8":"style__title8___zKD-A","paragraph1":"style__paragraph1___227GM","paragraph2":"style__paragraph2___1thX2","paragraph3":"style__paragraph3___2HqvV","paragraph4":"style__paragraph4___N1_Zr","paragraph5":"style__paragraph5___c7_OI","mainbanner":"style__mainbanner___2J7_D","svg":"style__svg___6prOk"};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	var _carousel = __webpack_require__(37);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(48);

	var Block4 = function (_React$Component) {
	  _inherits(Block4, _React$Component);

	  function Block4() {
	    _classCallCheck(this, Block4);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block4).apply(this, arguments));
	  }

	  _createClass(Block4, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className, key: index },
	            _react2.default.createElement(
	              'h3',
	              null,
	              item.title
	            ),
	            _react2.default.createElement('div', { dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content) })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var images = _props$data.images;
	      var slides = _props$data.slides;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        }
	      };
	      var imgUrl = images.image1.src ? images.image1.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : images.image1.src;
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: 'container-fluid' },
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-12' },
	            _react2.default.createElement('img', { className: style.image, src: imgUrl, alt: images.image1.alt })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-12' },
	            _react2.default.createElement(
	              _carousel2.default,
	              { id: 'carousel-about-block-4', interval: 8000, controls: false, classes: carouselClasses },
	              this.renderItems(slides)
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block4;
	}(_react2.default.Component);

	exports.default = Block4;


	Block4.propTypes = {
	  data: _react2.default.PropTypes.object,
	  style: _react2.default.PropTypes.object
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3P8Pp","vCenter":"style__vCenter___2Et1N","vCenterRel":"style__vCenterRel___3DCRz","hCenter":"style__hCenter___wKyoU","inheritHeight":"style__inheritHeight___1zL8U","hideOverflow":"style__hideOverflow___3ZV71","icon-sprites":"style__icon-sprites___8RQVq","sideSwipe":"style__sideSwipe___13jwX","button1":"style__button1___1pbIc","button2":"style__button2___1FucC","button3":"style__button3___1uWcc","title1":"style__title1___1w9oV","title2":"style__title2___2-ry2","title4":"style__title4___2yc3s","title5":"style__title5___TtpHn","title6":"style__title6___eDkzQ","title3":"style__title3___L0OLC","title7":"style__title7___1eGbP","title8":"style__title8___3UdhB","paragraph1":"style__paragraph1___3QbsS","paragraph2":"style__paragraph2___26NJ4","paragraph3":"style__paragraph3___3Uj57","paragraph4":"style__paragraph4___3ImpF","paragraph5":"style__paragraph5___3cZ7N","mainbanner":"style__mainbanner___21nfH","svg":"style__svg___3Smom"};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _listShow = __webpack_require__(50);

	var _listShow2 = _interopRequireDefault(_listShow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var Block6 = function (_React$Component) {
	  _inherits(Block6, _React$Component);

	  function Block6() {
	    _classCallCheck(this, Block6);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block6).apply(this, arguments));
	  }

	  _createClass(Block6, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var data = _props.data;
	      var showListItem = _props.showListItem;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: 'container-fluid' },
	        _react2.default.createElement(_listShow2.default, { data: data, item: showListItem })
	      ) : null;
	    }
	  }]);

	  return Block6;
	}(_react2.default.Component);

	exports.default = Block6;


	Block6.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired,
	  showListItem: _react2.default.PropTypes.string
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _list = __webpack_require__(51);

	var _list2 = _interopRequireDefault(_list);

	var _show = __webpack_require__(53);

	var _show2 = _interopRequireDefault(_show);

	var _slug = __webpack_require__(52);

	var _slug2 = _interopRequireDefault(_slug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ListShow = function (_React$Component) {
	  _inherits(ListShow, _React$Component);

	  function ListShow() {
	    _classCallCheck(this, ListShow);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ListShow).apply(this, arguments));
	  }

	  _createClass(ListShow, [{
	    key: 'getItemInfo',
	    value: function getItemInfo(data, itemUrl) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        if (!itemUrl) {
	          return data[0];
	        }
	        return _lodash2.default.find(data, function (item) {
	          return (0, _slug2.default)(item.title) === itemUrl;
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var data = _props.data;
	      var item = _props.item;

	      var itemInfo = this.getItemInfo(data.items, item);
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-6' },
	            _react2.default.createElement(
	              'h2',
	              null,
	              'Conoce a nuestro staff'
	            ),
	            _react2.default.createElement(_list2.default, { data: data, item: item })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-6' },
	            _react2.default.createElement(_show2.default, { data: itemInfo })
	          )
	        )
	      );
	    }
	  }]);

	  return ListShow;
	}(_react2.default.Component);

	exports.default = ListShow;


	ListShow.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired,
	  item: _react2.default.PropTypes.string
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _slug = __webpack_require__(52);

	var _slug2 = _interopRequireDefault(_slug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	var List = function (_React$Component) {
	  _inherits(List, _React$Component);

	  function List() {
	    _classCallCheck(this, List);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(List).apply(this, arguments));
	  }

	  _createClass(List, [{
	    key: 'renderItems',
	    value: function renderItems(data, sectionUrl, itemUrl) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var slug = (0, _slug2.default)(item.title);
	          var className = slug === itemUrl ? 'active' : '';
	          return _react2.default.createElement(
	            'div',
	            { key: index },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { className: className, to: '/' + sectionUrl + '/' + slug, title: item.title },
	              item.title
	            )
	          );
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var data = _props.data;
	      var item = _props.item;

	      return _react2.default.createElement(
	        'div',
	        null,
	        this.renderItems(data.items, data.sectionUrl, item)
	      );
	    }
	  }]);

	  return List;
	}(_react2.default.Component);

	exports.default = List;


	List.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired,
	  item: _react2.default.PropTypes.string
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (str) {
	  if (str && str.length) {
	    var response = str.replace(/^\s+|\s+$/g, ''); // trim
	    response = response.toLowerCase();

	    // remove accents, swap ñ for n, etc
	    var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
	    var to = 'aaaaeeeeiiiioooouuuunc------';
	    for (var i = 0, l = from.length; i < l; i++) {
	      response = response.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	    }

	    response = response.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
	    .replace(/\s+/g, '-') // collapse whitespace and replace by -
	    .replace(/-+/g, '-'); // collapse dashes

	    return response;
	  }
	  return str;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Show = function (_React$Component) {
	  _inherits(Show, _React$Component);

	  function Show() {
	    _classCallCheck(this, Show);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Show).apply(this, arguments));
	  }

	  _createClass(Show, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          return _react2.default.createElement(
	            'p',
	            { key: index },
	            item
	          );
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var data = this.props.data;

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-12' },
	            _react2.default.createElement('img', { src: data.image, alt: data.title })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-12' },
	            _react2.default.createElement(
	              'h3',
	              null,
	              data.subtitle
	            ),
	            _react2.default.createElement(
	              'p',
	              null,
	              data.intro
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              this.renderItems(data.content)
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Show;
	}(_react2.default.Component);

	exports.default = Show;


	Show.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _carousel = __webpack_require__(37);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(55);

	var Block7 = function (_React$Component) {
	  _inherits(Block7, _React$Component);

	  function Block7() {
	    _classCallCheck(this, Block7);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block7).apply(this, arguments));
	  }

	  _createClass(Block7, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className, key: index },
	            _react2.default.createElement('div', { dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content) })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var slides = _props$data.slides;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        }
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: 'container-fluid' },
	        _react2.default.createElement(
	          'h2',
	          null,
	          titles.title1
	        ),
	        _react2.default.createElement(
	          _carousel2.default,
	          { id: 'carousel-about-block-7', interval: 8000, controls: false, indicators: false, classes: carouselClasses },
	          this.renderItems(slides)
	        )
	      ) : null;
	    }
	  }]);

	  return Block7;
	}(_react2.default.Component);

	exports.default = Block7;


	Block7.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	// const style = require('./style.scss');

	var Block7 = function (_React$Component) {
	  _inherits(Block7, _React$Component);

	  function Block7() {
	    _classCallCheck(this, Block7);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block7).apply(this, arguments));
	  }

	  _createClass(Block7, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var buttons = _props$data.buttons;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: 'container-fluid' },
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-4 col-xs-12' },
	            _react2.default.createElement(
	              'h3',
	              null,
	              titles.title1
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: buttons.button1.href, title: buttons.button1.title, target: '_blank' },
	              'DESCARGAR'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-4 col-xs-12' },
	            _react2.default.createElement(
	              'h3',
	              null,
	              titles.title2
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: buttons.button2.href, title: buttons.button2.title, target: '_blank' },
	              'DESCARGAR'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-4 col-xs-12' },
	            _react2.default.createElement(
	              'h3',
	              null,
	              titles.title3
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: buttons.button3.href, title: buttons.button3.title, target: '_blank' },
	              'DESCARGAR'
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block7;
	}(_react2.default.Component);

	exports.default = Block7;


	Block7.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* eslint max-len: [2, 500, 4] */
	exports.default = {
	  title: 'Conoce a nuestro staff',
	  sectionUrl: 'escuela',
	  items: [{
	    title: 'GLORIA ZUÑIGA',
	    subtitle: 'GLORIA ZUÑIGA DE WHEBER',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'ALICIA LUNA',
	    subtitle: 'ALICIA LUNA',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'MILY WEHBER',
	    subtitle: 'MILY WEHBER',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'ALEJANDRA GUTIERRÉZ',
	    subtitle: 'ALEJANDRA GUTIERRÉZ',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'GABY LUNA',
	    subtitle: 'GABY LUNA',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'TANIA ADAME',
	    subtitle: 'TANIA ADAME',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'RHONAL RUVALCABA',
	    subtitle: 'RHONAL RUVALCABA',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'DELIA DE LA TORRE',
	    subtitle: 'DELIA DE LA TORRE',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'CORINA PERAZA',
	    subtitle: 'CORINA PERAZA',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'CLAUDIA LUNA',
	    subtitle: 'CLAUDIA LUNA',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'JESSICA TAMEZ',
	    subtitle: 'JESSICA TAMEZ',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'BÁRBARA MARTÍNEZ',
	    subtitle: 'BÁRBARA MARTÍNEZ',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'MAYRA JIMÉNEZ',
	    subtitle: 'MAYRA JIMÉNEZ',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'LILIAN ARMENTA',
	    subtitle: 'LILIAN ARMENTA',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'VICKY SAENZ',
	    subtitle: 'VICKY SAENZ',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'ROSALINA CAZAREZ',
	    subtitle: 'ROSALINA CAZAREZ',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'VERÓNICA FLORES',
	    subtitle: 'VERÓNICA FLORES',
	    intro: '15 años de experiencia',
	    image: '/images/placeholder.png',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }]
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(59);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(40);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(61);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(63);

	var _block8 = _interopRequireDefault(_block7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(65);

	var ProductsSection = function (_React$Component) {
	  _inherits(ProductsSection, _React$Component);

	  function ProductsSection() {
	    _classCallCheck(this, ProductsSection);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ProductsSection).apply(this, arguments));
	  }

	  _createClass(ProductsSection, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var block1 = _props$data.block1;
	      var block2 = _props$data.block2;
	      var block3 = _props$data.block3;
	      var block4 = _props$data.block4;
	      var block5 = _props$data.block5;
	      var block6 = _props$data.block6;

	      var block2Styles = {
	        wrapper: style.wrapper
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2, classes: 'col-xs-12 col-sm-8 col-sm-offset-2', style: block2Styles }),
	        _react2.default.createElement(_block6.default, { data: block3, sliderId: 'main-carousel-livingroom' }),
	        _react2.default.createElement(_block6.default, { data: block4, sliderId: 'main-carousel-dining' }),
	        _react2.default.createElement(_block6.default, { data: block5, sliderId: 'main-carousel-bedroom' }),
	        _react2.default.createElement(_block8.default, { data: block6 })
	      ) : null;
	    }
	  }]);

	  return ProductsSection;
	}(_react2.default.Component);

	exports.default = ProductsSection;


	ProductsSection.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactRouter = __webpack_require__(4);

	var _carousel = __webpack_require__(37);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(60);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block1).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          var imgUrl = item.image.length ? item.image.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : '/images/demo.png';

	          return _react2.default.createElement('div', { className: 'item ' + style.slide + ' ' + className + ' ' + (style.item || ''), key: index, style: { backgroundImage: 'url("' + imgUrl + '");"' } });
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var slides = _props$data.slides;
	      var titles = _props$data.titles;
	      var paragraphs = _props$data.paragraphs;
	      var buttons = _props$data.buttons;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next,
	          arrow: style.arrow
	        }
	      };
	      return _lodash2.default.isArray(slides) && slides.length && titles ? _react2.default.createElement(
	        'div',
	        { className: style.bannerContainer },
	        _react2.default.createElement(
	          _carousel2.default,
	          { id: 'main-carousel2', interval: 8000, indicators: false, classes: carouselClasses },
	          this.renderItems(slides)
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-5' },
	              _react2.default.createElement(
	                'div',
	                { className: style.overbanner },
	                _react2.default.createElement(
	                  'div',
	                  { className: style.vCenter },
	                  _react2.default.createElement(
	                    'h1',
	                    { className: style.title },
	                    titles.title1
	                  ),
	                  _react2.default.createElement(
	                    'h2',
	                    { className: style.subtitle },
	                    titles.title2
	                  ),
	                  _react2.default.createElement('p', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(paragraphs.paragraph1) }),
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { className: style.button, to: buttons.button1.href, title: buttons.button1.title },
	                    buttons.button1.title
	                  )
	                )
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block1;
	}(_react2.default.Component);

	exports.default = Block1;


	Block1.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1j0pv","vCenter":"style__vCenter___2KQFQ","vCenterRel":"style__vCenterRel___34eYy","hCenter":"style__hCenter___1Lkdf","inheritHeight":"style__inheritHeight___1q40G","hideOverflow":"style__hideOverflow___DrxCZ","icon-sprites":"style__icon-sprites___3tV9U","sideSwipe":"style__sideSwipe___1FVlo","button1":"style__button1___3ZmPV","button":"style__button___1lbNE","button2":"style__button2___2shnn","button3":"style__button3___3VbYO","title1":"style__title1___1gW4S","title2":"style__title2___2Tj1e","title4":"style__title4___3J4Je","title5":"style__title5___2Nimp","title6":"style__title6___1J_L3","title":"style__title___SyWrl","title3":"style__title3___1HOPW","title7":"style__title7___2tzA4","subtitle":"style__subtitle___28u9N","title8":"style__title8___2p7DZ","paragraph1":"style__paragraph1___3jelK","paragraph2":"style__paragraph2___3QqbA","paragraph":"style__paragraph___2nuu4","paragraph3":"style__paragraph3___2muKz","paragraph4":"style__paragraph4___1geTk","paragraph5":"style__paragraph5___30-m9","slide":"style__slide___1g7hl","overbanner":"style__overbanner___2RmA_","controls":"style__controls___MnoRe","bannerContainer":"style__bannerContainer___1enrP"};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactRouter = __webpack_require__(4);

	var _carousel = __webpack_require__(37);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(62);

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block3).apply(this, arguments));
	  }

	  _createClass(Block3, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          var imgUrl = item.image.length ? item.image.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : '/images/demo.png';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className + ' ' + (style.item || ''), key: index },
	            _react2.default.createElement(
	              'div',
	              { className: 'container-fluid ' + style.wrapper },
	              _react2.default.createElement(
	                'div',
	                { className: 'row' },
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-xs-12 col-sm-8 col-sm-offset-2 col-md-10 col-md-offset-1 ' },
	                  _react2.default.createElement('img', { className: style.image, src: imgUrl, alt: item.title }),
	                  _react2.default.createElement('hr', { className: style.hr })
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-xs-12 col-sm-4 col-sm-offset-2 col-md-5 col-md-offset-1' },
	                  _react2.default.createElement(
	                    'h3',
	                    { className: style.subtitle },
	                    item.title
	                  ),
	                  _react2.default.createElement('p', { dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content), className: style.paragraph })
	                ),
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-xs-12 col-sm-4 col-md-5' },
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: item.button_url, title: item.button_title, className: style.button },
	                    item.button_title
	                  )
	                )
	              )
	            )
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var sliderId = this.props.sliderId;
	      var _props$data = this.props.data;
	      var slides = _props$data.slides;
	      var titles = _props$data.titles;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next,
	          arrow: style.arrow
	        }
	      };
	      return _lodash2.default.isArray(slides) && slides.length && titles ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'h2',
	            { className: style.title },
	            titles.title1
	          )
	        ),
	        _react2.default.createElement(
	          _carousel2.default,
	          { id: sliderId, interval: 8000, indicators: false, classes: carouselClasses },
	          this.renderItems(slides)
	        )
	      ) : null;
	    }
	  }]);

	  return Block3;
	}(_react2.default.Component);

	exports.default = Block3;


	Block3.propTypes = {
	  data: _react2.default.PropTypes.object,
	  sliderId: _react2.default.PropTypes.string.isRequired
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___zkvoI","arrow":"style__arrow___YRQ8M","vCenter":"style__vCenter___1amrF","vCenterRel":"style__vCenterRel___dRIh_","hCenter":"style__hCenter___3ATdP","inheritHeight":"style__inheritHeight___35WI7","hideOverflow":"style__hideOverflow___1PqV_","icon-sprites":"style__icon-sprites___1wvNu","image1":"style__image1___1XYmO","image":"style__image___3La5m","paragraph1":"style__paragraph1___GDSgG","paragraph2":"style__paragraph2___YHIz0","paragraph":"style__paragraph___altZf","paragraph3":"style__paragraph3___3TUGd","paragraph4":"style__paragraph4___36NX-","paragraph5":"style__paragraph5___1IKiM","sideSwipe":"style__sideSwipe___10nak","button1":"style__button1___1wRom","button":"style__button___f4bc2","button2":"style__button2___2IfG_","button3":"style__button3___90xKI","title1":"style__title1___1ALfY","subtitle":"style__subtitle___2oUeT","title2":"style__title2___1rAMk","title4":"style__title4___2PoEp","title5":"style__title5___3oOGE","title6":"style__title6___3AN-Q","title":"style__title___2mlf9","title3":"style__title3___3_np7","title7":"style__title7___JQtWA","title8":"style__title8___1nNSa","wrapper":"style__wrapper___1BJ7Q","hr":"style__hr___37AfO","controls":"style__controls___1nXQ8"};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _sanitize = __webpack_require__(41);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(64);

	var Block4 = function (_React$Component) {
	  _inherits(Block4, _React$Component);

	  function Block4() {
	    _classCallCheck(this, Block4);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block4).apply(this, arguments));
	  }

	  _createClass(Block4, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var images = _props$data.images;
	      var paragraphs = _props$data.paragraphs;
	      var buttons = _props$data.buttons;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid ' + style.wrapper },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-4 col-sm-offset-2 col-md-5 col-md-offset-1 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement('p', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(paragraphs.paragraph1) }),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button, to: buttons.button1.href },
	                buttons.button1.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement('img', { className: style.image, src: images.image1.src, alt: images.image1.alt })
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block4;
	}(_react2.default.Component);

	exports.default = Block4;


	Block4.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___2OwT_","vCenter":"style__vCenter___2CepC","vCenterRel":"style__vCenterRel___3KKir","hCenter":"style__hCenter___3pCCD","inheritHeight":"style__inheritHeight___8XMfg","hideOverflow":"style__hideOverflow___3CRd7","icon-sprites":"style__icon-sprites___xUhFv","image1":"style__image1___s6jf9","image":"style__image___3_x2J","wrapper1":"style__wrapper1___QX2J1","wrapper2":"style__wrapper2___17lUu","paragraph1":"style__paragraph1___dfw1j","paragraph2":"style__paragraph2___338-V","paragraph":"style__paragraph___2V_vx","paragraph3":"style__paragraph3___3UGDB","paragraph4":"style__paragraph4___2cXGH","paragraph5":"style__paragraph5___O7bBq","sideSwipe":"style__sideSwipe___2-mAi","button1":"style__button1___BIa7T","button":"style__button___3VSSK","button2":"style__button2___3QGUS","button3":"style__button3___1UDFh","title1":"style__title1___3cDQX","title2":"style__title2___m8Ozm","title4":"style__title4___3niwQ","title5":"style__title5___21xX0","title6":"style__title6___2KofO","title":"style__title___1d6P1","title3":"style__title3___2xYWi","title7":"style__title7___Vrojr","title8":"style__title8___23y-T","wrapper":"style__wrapper___TskVX"};

/***/ },
/* 65 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1Q73D","vCenter":"style__vCenter___3XNrH","vCenterRel":"style__vCenterRel___1YeFJ","hCenter":"style__hCenter___1mVF7","inheritHeight":"style__inheritHeight___23Hgw","hideOverflow":"style__hideOverflow___25XXq","icon-sprites":"style__icon-sprites___2Iyi8","title1":"style__title1___1LBCJ","title2":"style__title2___ww8Lf","title4":"style__title4___1hQD3","title5":"style__title5___3wxeQ","title6":"style__title6___1W4EN","title3":"style__title3___1rrjg","title7":"style__title7___2cEVO","title8":"style__title8___2jhdQ","paragraph1":"style__paragraph1___3dDFe","paragraph2":"style__paragraph2___1bVFj","paragraph3":"style__paragraph3___3RtTB","paragraph4":"style__paragraph4___2KvJl","paragraph5":"style__paragraph5___32RKi","wrapper":"style__wrapper___2hxyL"};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(67);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(69);

	var _block4 = _interopRequireDefault(_block3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ContactSection = function (_React$Component) {
	  _inherits(ContactSection, _React$Component);

	  function ContactSection() {
	    _classCallCheck(this, ContactSection);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContactSection).apply(this, arguments));
	  }

	  _createClass(ContactSection, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var block1 = _props$data.block1;
	      var block2 = _props$data.block2;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2 })
	      ) : null;
	    }
	  }]);

	  return ContactSection;
	}(_react2.default.Component);

	exports.default = ContactSection;


	ContactSection.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	var style = __webpack_require__(68);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block1).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var images = _props$data.images;
	      var buttons = _props$data.buttons;

	      var imgUrl = images && images.image1 && images.image1.src ? images.image1.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : '/images/contacto_map.png';
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement('img', { cassName: style.image, src: imgUrl, alt: images.image1.alt }),
	        _react2.default.createElement(
	          'a',
	          { className: style.button, href: buttons.button1.href, target: '_blank' },
	          buttons.button1.title
	        )
	      ) : null;
	    }
	  }]);

	  return Block1;
	}(_react2.default.Component);

	exports.default = Block1;


	Block1.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3WsSe","vCenter":"style__vCenter___3G_X_","vCenterRel":"style__vCenterRel___2rlOE","hCenter":"style__hCenter___3ARcP","inheritHeight":"style__inheritHeight___1YsqB","hideOverflow":"style__hideOverflow___ps_Tr","icon-sprites":"style__icon-sprites___2f7vT","image1":"style__image1___1oYSl","paragraph1":"style__paragraph1___3JnQd","paragraph2":"style__paragraph2___3M3qm","paragraph3":"style__paragraph3___6lKhK","paragraph4":"style__paragraph4___1Z42s","paragraph5":"style__paragraph5___1v105","sideSwipe":"style__sideSwipe___50l2S","button1":"style__button1___1iQls","button":"style__button___6iE0P","button2":"style__button2___2nT5Y","button3":"style__button3___1WIju","title1":"style__title1___3f0o0","title2":"style__title2___XQgLg","title4":"style__title4___BpZsL","title5":"style__title5___hKWjC","title6":"style__title6___2GSXY","title3":"style__title3___2f5QU","title7":"style__title7___3_kU1","title8":"style__title8___2cLGW","image":"style__image___mSywh"};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _form = __webpack_require__(70);

	var _form2 = _interopRequireDefault(_form);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(72);

	var Block2 = function (_React$Component) {
	  _inherits(Block2, _React$Component);

	  function Block2() {
	    _classCallCheck(this, Block2);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Block2).apply(this, arguments));
	  }

	  _createClass(Block2, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var paragraphs = _props$data.paragraphs;
	      var buttons = _props$data.buttons;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title },
	                titles.title1,
	                _react2.default.createElement(_svg2.default, { network: 'location', className: style.svg })
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph1
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph2
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.gmap, href: buttons.button1.href, target: '_blank' },
	                buttons.button1.title
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph3
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph4
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.paragraph, href: buttons.button2.href, target: '_blank' },
	                buttons.button2.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title },
	                titles.title2
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph6
	              ),
	              _react2.default.createElement(_form2.default, null)
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block2;
	}(_react2.default.Component);

	exports.default = Block2;


	Block2.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _restClient = __webpack_require__(27);

	var _restClient2 = _interopRequireDefault(_restClient);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 600, 4] */

	var style = __webpack_require__(71);

	var Form1 = function (_React$Component) {
	  _inherits(Form1, _React$Component);

	  function Form1(props) {
	    _classCallCheck(this, Form1);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Form1).call(this, props));

	    _this2.state = {
	      formData: _this2.getInitialFormState(),
	      requiredFields: _this2.getRequiredFields(_this2.getInitialFormState()),
	      showLoading: false
	    };

	    _this2.submitFormHandler = _this2.submitFormHandler.bind(_this2);
	    _this2.onChangeHandler = _this2.onChangeHandler.bind(_this2);
	    return _this2;
	  }

	  _createClass(Form1, [{
	    key: 'onChangeHandler',
	    value: function onChangeHandler(event) {
	      var formData = this.state.formData;
	      var _event$target = event.target;
	      var name = _event$target.name;
	      var value = _event$target.value;

	      formData[name].value = value;
	      this.setState({ formData: formData });
	    }
	  }, {
	    key: 'getRequiredFields',
	    value: function getRequiredFields(data) {
	      var fields = {};
	      _lodash2.default.map(data, function (item, index) {
	        if (item.require) {
	          fields[index] = item;
	        }
	      });
	      return fields;
	    }
	  }, {
	    key: 'getInitialFormState',
	    value: function getInitialFormState() {
	      return {
	        name: {
	          title: 'Nombre',
	          value: '',
	          require: true
	        },
	        email: {
	          title: 'Correo',
	          value: '',
	          require: true
	        },
	        tel: {
	          title: 'Tel&eacute;fono',
	          value: '',
	          require: true
	        },
	        message: {
	          title: 'Mensaje',
	          value: '',
	          require: true
	        }
	      };
	    }
	  }, {
	    key: 'getHTMLMessage',
	    value: function getHTMLMessage(data) {
	      var response = _lodash2.default.map(data, function (item) {
	        return item.title + ': ' + item.value + '<br />';
	      });
	      return response.join('');
	    }
	  }, {
	    key: 'validateForm',
	    value: function validateForm(data, requiredFields) {
	      var response = true;
	      _lodash2.default.map(requiredFields, function (item, property) {
	        var labelElement = $('#lab_' + property);
	        if (!data.hasOwnProperty(property) || !data[property].value.length) {
	          if (response) {
	            response = false;
	          }
	          labelElement.addClass(style.errorCSSClass);
	        } else {
	          labelElement.removeClass(style.errorCSSClass);
	        }
	      });
	      return response;
	    }

	    /*
	    Handler function to validate form and send data
	    */

	  }, {
	    key: 'submitFormHandler',
	    value: function submitFormHandler(event) {
	      var _this3 = this;

	      event.preventDefault();
	      var formData = this.state.formData;
	      var isFormValid = this.validateForm(formData, this.state.requiredFields);
	      var msgElement = $('#msg');
	      msgElement.removeClass(style.errorCSSClass + ' ' + style.successCSSClass);
	      msgElement.html('');

	      if (isFormValid) {
	        (function () {
	          _this3.setState({
	            showLoading: true
	          });
	          msgElement.html('Enviando...');
	          var _this = _this3;
	          var html = _this3.getHTMLMessage(formData);
	          var data = {
	            fromname: formData.name.value,
	            replyto: formData.email.value,
	            subject: 'Forma de Contacto Website: NOTABLE',
	            html: html
	          };

	          (0, _restClient2.default)({
	            path: '/api/send_email',
	            method: 'POST',
	            entity: data
	          }).then(function (response) {
	            var state = {
	              showLoading: false
	            };
	            if (response.entity.status) {
	              state.formData = _this.getInitialFormState();
	            }
	            _this.setState(state);
	            msgElement.addClass(response.entity.status ? style.successCSSClass : style.errorCSSClass);
	            msgElement.html(response.entity.status ? 'Información enviada de manera exitosa, gracias.' : 'Lo sentimos, favor de intentar más tarde.');
	          });
	        })();
	      } else {
	        msgElement.addClass(style.errorCSSClass);
	      }
	      msgElement.html(!isFormValid ? 'Favor de llenar los campos en rojo.' : '');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state$formData = this.state.formData;
	      var name = _state$formData.name;
	      var email = _state$formData.email;
	      var tel = _state$formData.tel;
	      var message = _state$formData.message;


	      return _react2.default.createElement(
	        'form',
	        { id: 'form', className: style.form + ' form-horizontal' },
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group ' + style.formGroup },
	          _react2.default.createElement(
	            'label',
	            { id: 'lab_name', className: 'col-xs-2 control-label' },
	            'Nombre:'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-xs-10' },
	            _react2.default.createElement('input', { type: 'text', name: 'name', onChange: this.onChangeHandler, value: name.value })
	          ),
	          _react2.default.createElement('div', { className: style.borderBottom2 })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group ' + style.formGroup },
	          _react2.default.createElement(
	            'label',
	            { id: 'lab_email', className: 'col-xs-2 control-label' },
	            'Correo:'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-xs-10' },
	            _react2.default.createElement('input', { type: 'text', name: 'email', onChange: this.onChangeHandler, value: email.value })
	          ),
	          _react2.default.createElement('div', { className: style.borderBottom2 })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group ' + style.formGroup },
	          _react2.default.createElement(
	            'label',
	            { id: 'lab_tel', className: 'col-xs-2 control-label' },
	            'Teléfono:'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-xs-10' },
	            _react2.default.createElement('input', { type: 'tel', name: 'tel', onChange: this.onChangeHandler, value: tel.value })
	          ),
	          _react2.default.createElement('div', { className: style.borderBottom2 })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group ' + style.formGroup },
	          _react2.default.createElement(
	            'label',
	            { id: 'lab_message', className: 'col-sm-12 control-label' },
	            'Mensaje:'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-12 col-sm-offset-1' },
	            _react2.default.createElement('input', { type: 'text', name: 'message', onChange: this.onChangeHandler, value: message.value })
	          ),
	          _react2.default.createElement('div', { className: style.borderBottom2 })
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement('span', { id: 'msg' })
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          this.state.showLoading ? _react2.default.createElement(
	            'span',
	            { className: style.loader },
	            'Cargando'
	          ) : null
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'pull-right' },
	          _react2.default.createElement(
	            'a',
	            { className: style.submit, onClick: this.submitFormHandler },
	            'ENVIAR'
	          )
	        )
	      );
	    }
	  }]);

	  return Form1;
	}(_react2.default.Component);

	exports.default = Form1;

/***/ },
/* 71 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___365qk","vCenter":"style__vCenter___9LFiT","vCenterRel":"style__vCenterRel___27ebh","hCenter":"style__hCenter___3MSN5","inheritHeight":"style__inheritHeight___20X8j","hideOverflow":"style__hideOverflow___1e_Sa","icon-sprites":"style__icon-sprites___SBb6q","image1":"style__image1___20ULB","paragraph1":"style__paragraph1___1Iuas","paragraph2":"style__paragraph2___XLNUn","paragraph3":"style__paragraph3___cQhzG","paragraph4":"style__paragraph4___3o8-x","paragraph5":"style__paragraph5___-5J8a","sideSwipe":"style__sideSwipe___3Jh_M","button1":"style__button1___QW0Tv","submit":"style__submit___2YBRa","button2":"style__button2___3fzL1","button3":"style__button3___1LtgP","title1":"style__title1___2DL5-","title2":"style__title2___3etcM","title4":"style__title4___33kmt","title5":"style__title5___2k_sU","title6":"style__title6___1dv-o","title3":"style__title3___8tZ0C","title7":"style__title7___OUaen","title8":"style__title8___1LvKh","form":"style__form___1nnSk","formGroup":"style__formGroup___1VfYe"};

/***/ },
/* 72 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___YPy8K","vCenter":"style__vCenter___32xVO","vCenterRel":"style__vCenterRel___29zgs","hCenter":"style__hCenter___2lorl","inheritHeight":"style__inheritHeight___VvRBI","hideOverflow":"style__hideOverflow___2GeSp","icon-sprites":"style__icon-sprites___3vhaB","image1":"style__image1___2KQtF","paragraph1":"style__paragraph1___21zOk","paragraph2":"style__paragraph2___1ISwm","paragraph3":"style__paragraph3___34fOz","paragraph4":"style__paragraph4___1tgYT","paragraph5":"style__paragraph5___BDRxV","paragraph":"style__paragraph___29758","sideSwipe":"style__sideSwipe___1IOUP","button1":"style__button1___1cwjy","button2":"style__button2___hQ_-V","button3":"style__button3___3HwaY","gmap":"style__gmap___1uAlR","title1":"style__title1___OAVsV","title2":"style__title2___3iVlU","title4":"style__title4___JohwZ","title5":"style__title5___3Apbg","title6":"style__title6___8Y1Ek","title":"style__title___31zi9","title3":"style__title3___173Gl","title7":"style__title7___5Kp7I","title8":"style__title8___3uCuH","svg":"style__svg___38pi8"};

/***/ }
/******/ ]);