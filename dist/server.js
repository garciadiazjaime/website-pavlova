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
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("react-dom/server");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("react-router");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = require("lodash");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

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

	    return _possibleConstructorReturn(this, (DataWrapper.__proto__ || Object.getPrototypeOf(DataWrapper)).apply(this, arguments));
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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	const convict = __webpack_require__(9);

	const config = convict({
	  email: {
	    doc: 'default contact email',
	    format: String,
	    default: 'info@mintitmedia.com',
	    env: 'CONTACT_EMAIL',
	  },
	  ipaddress: {
	    doc: 'IP the application runs on',
	    format: 'ipaddress',
	    default: '0.0.0.0',
	  },
	  port: {
	    doc: 'Port the application listens on',
	    format: 'port',
	    default: '3072',
	  },
	  sendgrid: {
	    doc: 'Sendrid API KEY',
	    format: String,
	    default: '',
	    env: 'SENDGRID_API_KEY',
	  },
	  apiUrl: {
	    doc: 'API URL',
	    format: String,
	    default: '',
	    env: 'API_URL',
	  },
	});

	config.validate();

	module.exports = config;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = require("convict");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("sendgrid");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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
	    _react2.default.createElement(_reactRouter.Route, { path: 'escuela/:showListItem', component: items.showListItem }),
	    _react2.default.createElement(_reactRouter.Route, { path: 'clases/:service', component: items.service })
	  )
	);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
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
	    var timeout = runTimeout(cleanUpNextTick);
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
	    runClearTimeout(timeout);
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
	        runTimeout(drainQueue);
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
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = require("history/lib/createBrowserHistory");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _AppHandler = __webpack_require__(16);

	var _AppHandler2 = _interopRequireDefault(_AppHandler);

	var _home = __webpack_require__(31);

	var _home2 = _interopRequireDefault(_home);

	var _about = __webpack_require__(44);

	var _about2 = _interopRequireDefault(_about);

	var _products = __webpack_require__(65);

	var _products2 = _interopRequireDefault(_products);

	var _contact = __webpack_require__(73);

	var _contact2 = _interopRequireDefault(_contact);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  items: {
	    component: _AppHandler2.default,
	    default: _home2.default,
	    showListItem: _about2.default,
	    service: _products2.default,
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
	      id: 4,
	      title: 'Contacto',
	      url: '/contacto',
	      component: _contact2.default
	    }]
	  },
	  icons: [{
	    title: 'facebook',
	    url: 'https://www.facebook.com/pavlova.hipodromo/'
	  }]
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _footer = __webpack_require__(21);

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

	    var _this = _possibleConstructorReturn(this, (AppHandler.__proto__ || Object.getPrototypeOf(AppHandler)).call(this, props, context));

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
	      // window.addEventListener('scroll', this.onScroll, false);
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
	      // window.removeEventListener('scroll', this.onScroll, false);
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

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

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

	var style = __webpack_require__(20);

	var MainMenu = function (_React$Component) {
	  _inherits(MainMenu, _React$Component);

	  function MainMenu() {
	    _classCallCheck(this, MainMenu);

	    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).apply(this, arguments));
	  }

	  _createClass(MainMenu, [{
	    key: 'getItems',
	    value: function getItems(data) {
	      var _this2 = this;

	      return data.map(function (item, index) {
	        var title = item.title,
	            url = item.url;

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
	          { className: style.navbarDefault + ' navbar navbar-fixed-top', id: 'menu_wrapper' },
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

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.getFacebookIcon = getFacebookIcon;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _style = __webpack_require__(19);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	function renderItems(network, className) {
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
	    case 'square_arrow':
	      return _react2.default.createElement(
	        'svg',
	        { xmlns: 'http://www.w3.org/2000/svg', width: '31', height: '31', viewBox: '0 0 31.4 31.3', className: className },
	        _react2.default.createElement('path', { d: 'M1 30.9c-0.3 0-0.5-0.2-0.5-0.5V1c0-0.3 0.2-0.5 0.5-0.5h29.4c0.3 0 0.5 0.2 0.5 0.5v29.4c0 0.3-0.2 0.5-0.5 0.5H1z', fill: '#221f1f' }),
	        _react2.default.createElement('path', { d: 'M30.4 1v29.4H1V1H30.4M30.4 0H1c-0.6 0-1 0.4-1 1v29.4c0 0.6 0.4 1 1 1h29.4c0.6 0 1-0.4 1-1V1C31.4 0.4 31 0 30.4 0L30.4 0z', fill: '#FFF' }),
	        _react2.default.createElement('polyline', { points: ' 13.2 9.1 19.7 15.6 13.1 22.2 ', fill: 'none', stroke: '#fff' })
	      );
	      break;
	    case 'arrow_right':
	      return _react2.default.createElement(
	        'svg',
	        { xmlns: 'http://www.w3.org/2000/svg', width: '8', height: '14', viewBox: '0 0 7.7 13.8', className: className },
	        _react2.default.createElement('polyline', { points: '0.5 0.4 7 6.9 0.4 13.5 ', fill: 'none', stroke: '#FFF' })
	      );
	      break;
	    case 'arrow_down':
	      return _react2.default.createElement(
	        'svg',
	        { xmlns: 'http://www.w3.org/2000/svg', width: '15', height: '8', viewBox: '0 0 14.6 8', className: className },
	        _react2.default.createElement('polyline', { points: '13.8 0.8 7.3 7.3 0.7 0.7 ', fill: 'none', stroke: '#FFF' })
	      );
	      break;
	    case 'carousel_right':
	      return _react2.default.createElement(
	        'svg',
	        { xmlns: 'http://www.w3.org/2000/svg', width: '10', height: '18', viewBox: '0 0 10.1 18', className: className },
	        _react2.default.createElement('polyline', { points: ' 1.1 1.1 9 9 1.1 16.9 ', fill: 'none', strokeLinejoin: 'round', strokeWidth: '2', stroke: '#010101' })
	      );
	      break;
	    case 'carousel_left':
	      return _react2.default.createElement(
	        'svg',
	        { xmlns: 'http://www.w3.org/2000/svg', width: '10', height: '18', viewBox: '0 0 10.1 18', className: className },
	        _react2.default.createElement('polyline', { points: ' 9 16.9 1.1 9 9 1.1 ', fill: 'none', strokeLinejoin: 'round', strokeWidth: '2', stroke: '#010101' })
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

	var SVG = function (_React$Component) {
	  _inherits(SVG, _React$Component);

	  function SVG() {
	    _classCallCheck(this, SVG);

	    return _possibleConstructorReturn(this, (SVG.__proto__ || Object.getPrototypeOf(SVG)).apply(this, arguments));
	  }

	  _createClass(SVG, [{
	    key: 'render',
	    value: function render() {
	      return renderItems(this.props.network, this.props.className);
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

	function getFacebookIcon(href, title, className) {
	  return _react2.default.createElement(
	    _reactRouter.Link,
	    { to: href, className: [_style2.default.fbIcon, className || ''].join(' '), target: '_blank' },
	    renderItems('facebook', _style2.default.facebook),
	    title ? _react2.default.createElement(
	      'span',
	      null,
	      title
	    ) : null
	  );
	}

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___eofHt","vCenter":"style__vCenter___3ydwB","vCenterRel":"style__vCenterRel___1Xcj8","hCenter":"style__hCenter___2IrLV","inheritHeight":"style__inheritHeight___XdU0Q","hideOverflow":"style__hideOverflow___1wNkm","icon-sprites":"style__icon-sprites___33LTB","paragraph1":"style__paragraph1___105nn","paragraph1b":"style__paragraph1b___2EzhZ","paragraph2":"style__paragraph2___1RbUN","paragraph3":"style__paragraph3___1Vukg","paragraph4":"style__paragraph4___2u3F_","paragraph5":"style__paragraph5___1bu0t","fbIcon":"style__fbIcon___3C8wt","facebook":"style__facebook___5cRlv"};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___cfX-h","vCenter":"style__vCenter___ZA14l","navbarBrand":"style__navbarBrand___2rqc0","toggleButton":"style__toggleButton___3q8M1","navbarNavAnchor":"style__navbarNavAnchor___37QYF","vCenterRel":"style__vCenterRel___1GkYt","navbarIcons":"style__navbarIcons___jZlWo","sm_icon":"style__sm_icon___3hlQn","hCenter":"style__hCenter___2Rj-i","inheritHeight":"style__inheritHeight___2LMcf","hideOverflow":"style__hideOverflow___3olA9","icon-sprites":"style__icon-sprites___1xY5y","navbarWrapper":"style__navbarWrapper___VqN0H","navbarDefault":"style__navbarDefault___aolZK","navbarHeader":"style__navbarHeader___2FrdS","iconBar":"style__iconBar___1hD4n","navbarCollapse":"style__navbarCollapse___3blFh","navbarNav":"style__navbarNav___1r3v1","facebook":"style__facebook___5X5oX"};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(4);

	var _powered = __webpack_require__(22);

	var _powered2 = _interopRequireDefault(_powered);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _data = __webpack_require__(24);

	var _data2 = _interopRequireDefault(_data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(23);

	var FooterAAA = function (_React$Component) {
	  _inherits(FooterAAA, _React$Component);

	  function FooterAAA() {
	    _classCallCheck(this, FooterAAA);

	    return _possibleConstructorReturn(this, (FooterAAA.__proto__ || Object.getPrototypeOf(FooterAAA)).apply(this, arguments));
	  }

	  _createClass(FooterAAA, [{
	    key: 'getIcons',
	    value: function getIcons(data) {
	      return data.map(function (item, index) {
	        return _react2.default.createElement(
	          _reactRouter.Link,
	          { key: index, to: item.url, className: style.sm_icon, id: item.url, target: '_blank' },
	          _react2.default.createElement(_svg2.default, { network: item.title, className: style[item.title] })
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var icons = this.props.icons;
	      var titles = _data2.default.titles,
	          paragraphs = _data2.default.paragraphs,
	          buttons = _data2.default.buttons;

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
	              { className: 'col-xs-12' },
	              _react2.default.createElement('div', { className: style.footerBrand })
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-3 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'ul',
	                { className: style.list },
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  paragraphs.paragraph1
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  paragraphs.paragraph2
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  paragraphs.paragraph3
	                ),
	                _react2.default.createElement('br', null),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  paragraphs.paragraph4
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-3 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title2
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph5
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                '664 200.3031'
	              ),
	              this.getIcons(icons),
	              _react2.default.createElement(
	                'a',
	                { className: style.paragraph, href: buttons.button1.href, title: buttons.button1.title, target: '_blank' },
	                buttons.button1.title
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-3 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title3
	              ),
	              _react2.default.createElement(
	                'ul',
	                { className: style.list },
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button2.href, title: buttons.button2.title },
	                    buttons.button2.title
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button3.href, title: buttons.button3.title },
	                    buttons.button3.title
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button4.href, title: buttons.button4.title },
	                    buttons.button4.title
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button5.href, title: buttons.button5.title },
	                    buttons.button5.title
	                  )
	                )
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-3 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title4
	              ),
	              _react2.default.createElement(
	                'ul',
	                { className: style.list },
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button7.href, title: buttons.button7.title, target: '_blank' },
	                    buttons.button7.title
	                  )
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button8.href, title: buttons.button8.title, target: '_blank' },
	                    buttons.button8.title
	                  )
	                )
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
	  icons: _react2.default.PropTypes.array
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

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

	var style = __webpack_require__(23);

	var Powered = function (_React$Component) {
	  _inherits(Powered, _React$Component);

	  function Powered() {
	    _classCallCheck(this, Powered);

	    return _possibleConstructorReturn(this, (Powered.__proto__ || Object.getPrototypeOf(Powered)).apply(this, arguments));
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
	              'Todos los derechos reservados \xA9 Pavlova'
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-6 ' + style.wrapperBy },
	              'Un proyecto de:\xA0',
	              _react2.default.createElement(
	                'a',
	                { href: data[0].url, title: data[0].title, target: '_blank' },
	                data[0].name
	              ),
	              '\xA0\xA0 C\xF3digo por:\xA0',
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

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3sp06","vCenter":"style__vCenter___2G-_B","vCenterRel":"style__vCenterRel___3pk1i","hCenter":"style__hCenter___uDimH","inheritHeight":"style__inheritHeight___1W6vZ","hideOverflow":"style__hideOverflow___1oOYw","icon-sprites":"style__icon-sprites___3Wvbf","footerWrapper":"style__footerWrapper___LwV_7","footerBrand":"style__footerBrand___1BcOo","title":"style__title___3vTD3","paragraph":"style__paragraph___v5jSt","list":"style__list___2_aVL","container":"style__container___1CyCK","powered":"style__powered___3yTUa","wrapperBy":"style__wrapperBy___2KG7E","serviceTitle":"style__serviceTitle___3QrAo","facebook":"style__facebook___3bmod"};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  titles: {
	    title1: 'UBICACIÓN',
	    title2: 'LLÁMANOS',
	    title3: 'CLASES',
	    title4: 'DESCARGABLES'
	  },
	  paragraphs: {
	    paragraph1: 'Av. Allende #38',
	    paragraph2: 'Col. Hipódromo',
	    paragraph3: 'Tijuana, B.C.',
	    paragraph4: 'pavlovahipodromo@gmail.com',
	    paragraph5: '664 686.27.87'
	  },
	  buttons: {
	    button1: {
	      title: 'Síguenos en Facebook',
	      href: 'http://facebook.com'
	    },
	    button2: {
	      title: 'BALLET',
	      href: '/clases/ballet'
	    },
	    button3: {
	      title: 'JAZZ',
	      href: '/clases/jazz'
	    },
	    button4: {
	      title: 'FLAMENCO',
	      href: '/clases/flamenco'
	    },
	    button5: {
	      title: 'CARDIO DANZA',
	      href: '/clases/kardio-danza'
	    },
	    button7: {
	      title: 'HORARIOS',
	      href: 'http://www.pavlovahipodromo.com/docs/Pavlova-Horarios-2016.pdf'
	    },
	    button8: {
	      title: 'FICHA DE INSCRIPCIÓN',
	      href: 'http://www.pavlovahipodromo.com/docs/Pavlova-FichaInscripcion.pdf'
	    },
	    button9: {
	      title: 'REGLAMENTO',
	      href: 'http://www.pavlovahipodromo.com/docs/Pavlova-Reglamento.pdf'
	    }
	  }
	};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

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

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (elementID) {
	  $('.navbar-nav li.active').removeClass('active');
	  $('.navbar-nav a#' + elementID).parent().addClass('active');
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = require("rest");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = require("rest/interceptor/mime");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = require("rest/interceptor/errorCode");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _block3 = __webpack_require__(36);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(38);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(40);

	var _block8 = _interopRequireDefault(_block7);

	var _block9 = __webpack_require__(42);

	var _block10 = _interopRequireDefault(_block9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HomeSection = function (_React$Component) {
	  _inherits(HomeSection, _React$Component);

	  function HomeSection() {
	    _classCallCheck(this, HomeSection);

	    return _possibleConstructorReturn(this, (HomeSection.__proto__ || Object.getPrototypeOf(HomeSection)).apply(this, arguments));
	  }

	  _createClass(HomeSection, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          block1 = _props$data.block1,
	          block2 = _props$data.block2,
	          block3 = _props$data.block3,
	          block4 = _props$data.block4;


	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2 }),
	        _react2.default.createElement(_block6.default, { data: block3 }),
	        _react2.default.createElement(_block8.default, { data: block4 }),
	        _react2.default.createElement(_block10.default, null)
	      ) : null;
	    }
	  }]);

	  return HomeSection;
	}(_react2.default.Component);

	exports.default = HomeSection;


	HomeSection.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	var style = __webpack_require__(35);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, (Block1.__proto__ || Object.getPrototypeOf(Block1)).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      $('#carousel-home-block-1').carousel();
	    }
	  }, {
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var divStyle = (0, _imageUtil.getImageBackground)(item.image);
	          var className = index === 0 ? 'active' : '';
	          className += index === 1 ? style.darkBG : '';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + (style.item || '') + ' ' + className, key: index, style: divStyle },
	            _react2.default.createElement(
	              'div',
	              { className: 'container-fluid' },
	              _react2.default.createElement(
	                'div',
	                { className: 'row' },
	                _react2.default.createElement(
	                  'div',
	                  { className: 'col-xs-12' },
	                  _react2.default.createElement(
	                    _reactRouter.Link,
	                    { to: item.button_url },
	                    item.button_title,
	                    _react2.default.createElement(_svg2.default, { network: 'arrow_right' })
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
	      var slides = this.props.data.slides;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next,
	          arrow: style.arrow
	        }
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _carousel2.default,
	          { id: 'carousel-home-block-1', interval: 8000, indicators: false, classes: carouselClasses },
	          this.renderItems(slides)
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

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

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

	    return _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).apply(this, arguments));
	  }

	  _createClass(Carousel, [{
	    key: 'getIndicators',
	    value: function getIndicators(sliderId, isVisible, data, indicatorClass) {
	      var indicators = [];
	      if (isVisible !== false && _lodash2.default.isArray(data) && data.length) {
	        var activeClassName = indicatorClass && indicatorClass.active ? 'active ' + indicatorClass.active : 'active';
	        indicators = data.map(function (item, index) {
	          var className = index === 0 ? activeClassName : '';
	          return _react2.default.createElement('li', { 'data-target': '#' + sliderId, 'data-slide-to': index, className: className, key: index });
	        });
	        return _react2.default.createElement(
	          'ol',
	          { className: 'carousel-indicators ' + (indicatorClass.base || '') },
	          indicators
	        );
	      }
	      return null;
	    }
	  }, {
	    key: 'getControls',
	    value: function getControls(sliderId, isVisible, classes) {
	      var base = classes.base,
	          prev = classes.prev,
	          next = classes.next,
	          arrow = classes.arrow;

	      if (isVisible !== false) {
	        return _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'a',
	            { className: 'left carousel-control ' + (base || '') + ' ' + (prev || ''), href: '#' + sliderId, role: 'button', 'data-slide': 'prev' },
	            _react2.default.createElement(_svg2.default, { network: 'carousel_left', className: arrow }),
	            _react2.default.createElement(
	              'span',
	              { className: 'sr-only' },
	              'Previous'
	            )
	          ),
	          _react2.default.createElement(
	            'a',
	            { className: 'right carousel-control ' + (base || '') + ' ' + (next || ''), href: '#' + sliderId, role: 'button', 'data-slide': 'next' },
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
	      var _props = this.props,
	          id = _props.id,
	          interval = _props.interval,
	          children = _props.children,
	          indicators = _props.indicators,
	          controls = _props.controls,
	          classes = _props.classes;

	      return _react2.default.createElement(
	        'div',
	        { id: id, className: 'carousel slide', 'data-ride': 'carousel', 'data-interval': interval || 8000 },
	        this.getIndicators(id, indicators, children, classes.indicator),
	        _react2.default.createElement(
	          'div',
	          { className: 'carousel-inner ' + (classes.inner || ''), role: 'listbox' },
	          children
	        ),
	        this.getControls(id, controls, classes.controls)
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

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1IAv0","vCenter":"style__vCenter___3op1c","button1":"style__button1___3teya","button2":"style__button2___3emCl","item":"style__item___1hdp3","darkBG":"style__darkBG___3_r4I","button2b":"style__button2b___1gkLu","vCenterRel":"style__vCenterRel___3rmpk","hCenter":"style__hCenter___bN1_x","inheritHeight":"style__inheritHeight___3EV0T","hideOverflow":"style__hideOverflow___1jYcy","icon-sprites":"style__icon-sprites___113mW","button3":"style__button3___1egvE","button3v1":"style__button3v1___e8Puv","button3v2":"style__button3v2___aYpPW","button3v3":"style__button3v3___18OJd","button3v4":"style__button3v4___347NJ","wrapper1":"style__wrapper1___3LV9m","wrapper2":"style__wrapper2___3Do_q","title1":"style__title1___1fgRn","title2":"style__title2___3VQJ-","title3":"style__title3___15G1J","title4":"style__title4___GbpGB","title5":"style__title5___21deO","title6":"style__title6___2x7FO","title7":"style__title7___1Pacu","title8":"style__title8___1BoeB","sideSwipe":"style__sideSwipe___1_Jvs","bottomSwipe":"style__bottomSwipe___2qtvt","arrow":"style__arrow___3-Hu9"};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(37);

	var Block2 = function (_React$Component) {
	  _inherits(Block2, _React$Component);

	  function Block2() {
	    _classCallCheck(this, Block2);

	    return _possibleConstructorReturn(this, (Block2.__proto__ || Object.getPrototypeOf(Block2)).apply(this, arguments));
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
	            _react2.default.createElement(
	              'div',
	              { className: style.customCol + ' col-xs-6' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button3v1 + ' row', to: buttons.button1.href },
	                buttons.button1.title,
	                _react2.default.createElement(_svg2.default, { network: 'square_arrow', className: style.svg })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: style.customCol + ' col-xs-6' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button3v2 + ' row', to: buttons.button2.href },
	                buttons.button2.title,
	                _react2.default.createElement(_svg2.default, { network: 'square_arrow', className: style.svg })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: style.customCol + ' col-xs-6' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button3v3 + ' row', to: buttons.button3.href },
	                buttons.button3.title,
	                _react2.default.createElement(_svg2.default, { network: 'square_arrow', className: style.svg })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: style.customCol + ' col-xs-6' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button3v4 + ' row', to: buttons.button4.href },
	                buttons.button4.title,
	                _react2.default.createElement(_svg2.default, { network: 'square_arrow', className: style.svg })
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
	  data: _react2.default.PropTypes.object
	};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___ByilZ","vCenter":"style__vCenter___1v0oL","button1":"style__button1___3Mc_g","button2":"style__button2___2zikt","button2b":"style__button2b___UKCOY","vCenterRel":"style__vCenterRel___r367-","hCenter":"style__hCenter___35AKo","inheritHeight":"style__inheritHeight___GkUeM","hideOverflow":"style__hideOverflow___30PJL","icon-sprites":"style__icon-sprites___1crXd","button3":"style__button3___3KWNZ","button3v1":"style__button3v1___3BT_T","button3v2":"style__button3v2___1cST3","button3v3":"style__button3v3___1O1XL","button3v4":"style__button3v4___1ekHt","image1":"style__image1___4P84q","paragraph1":"style__paragraph1___2Ov3F","paragraph1b":"style__paragraph1b___3CQIB","paragraph2":"style__paragraph2___10FLO","paragraph3":"style__paragraph3___3kGpq","paragraph4":"style__paragraph4___15kjh","paragraph5":"style__paragraph5___3EMdx","sideSwipe":"style__sideSwipe___2tbA2","bottomSwipe":"style__bottomSwipe___3tj3d","title1":"style__title1___3Lp7y","title2":"style__title2___1Nebh","title3":"style__title3___2cBjs","title4":"style__title4___90ELg","title5":"style__title5___3p9GA","title6":"style__title6___1cWpF","title7":"style__title7___1hdkz","title8":"style__title8___4sMWt","button3v5":"style__button3v5___m7eJK","customCol":"style__customCol___3nRYv"};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	var style = __webpack_require__(39);

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, (Block3.__proto__ || Object.getPrototypeOf(Block3)).apply(this, arguments));
	  }

	  _createClass(Block3, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          buttons = _props$data.buttons,
	          paragraphs = _props$data.paragraphs;

	      var divStyle = (0, _imageUtil.getImageBackground)('/images/home/pas-de-chat.jpg');
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle, className: style.passeDeChat },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph1
	              ),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button, to: buttons.button1.href },
	                buttons.button1.title,
	                _react2.default.createElement(_svg2.default, { network: 'arrow_right' })
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

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1UpIU","vCenter":"style__vCenter___1YV9g","button1":"style__button1___100rH","button2":"style__button2___SbKZT","button":"style__button____i21N","button2b":"style__button2b___1z6B8","vCenterRel":"style__vCenterRel___1D8tj","hCenter":"style__hCenter___2TvfM","inheritHeight":"style__inheritHeight___3jids","hideOverflow":"style__hideOverflow___16pkQ","icon-sprites":"style__icon-sprites___3x6uL","button3":"style__button3___wn-mV","button3v1":"style__button3v1___2JRum","button3v2":"style__button3v2___1HD5h","button3v3":"style__button3v3___X_IwQ","button3v4":"style__button3v4___2gUdl","passeDeChat":"style__passeDeChat___3lcIC","wrapper1":"style__wrapper1___11dmn","wrapper2":"style__wrapper2___btSte","title1":"style__title1___3QBup","title2":"style__title2___19ma5","title3":"style__title3___17GG-","title4":"style__title4___1kzHe","title5":"style__title5___w6HV2","title":"style__title___2uzOV","title6":"style__title6___8k-iy","title7":"style__title7___3kWyz","title8":"style__title8___3tkZ-","sideSwipe":"style__sideSwipe___M8sba","bottomSwipe":"style__bottomSwipe____fcIm","paragraph1":"style__paragraph1___mOtQ_","paragraph1b":"style__paragraph1b___1l31N","paragraph2":"style__paragraph2___34cYP","paragraph3":"style__paragraph3___pE0dO","paragraph":"style__paragraph___1CprJ","paragraph4":"style__paragraph4___2Bqj7","paragraph5":"style__paragraph5___8lnUF"};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(41);

	var Block4 = function (_React$Component) {
	  _inherits(Block4, _React$Component);

	  function Block4() {
	    _classCallCheck(this, Block4);

	    return _possibleConstructorReturn(this, (Block4.__proto__ || Object.getPrototypeOf(Block4)).apply(this, arguments));
	  }

	  _createClass(Block4, [{
	    key: 'renderItems',
	    value: function renderItems() {
	      return Array.apply(null, Array(7)).map(function (item, index) {
	        var className = index === 0 ? 'active' : '';
	        return _react2.default.createElement(
	          'div',
	          { className: 'item ' + className + ' ' + (style.item || ''), key: index },
	          _react2.default.createElement('img', { className: style.carrouselImg, src: '/images/home-escuela/img-slider-escuela-0' + (index + 1) + '.jpg', alt: 'pavlova hipodromo escuela' })
	        );
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          paragraphs = _props$data.paragraphs,
	          buttons = _props$data.buttons;

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
	          { className: 'container-fluid ' + style.wrapper },
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph1
	              ),
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button, to: buttons.button1.href },
	                buttons.button1.title,
	                _react2.default.createElement(_svg2.default, { network: 'arrow_right' })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                _carousel2.default,
	                { id: 'carousel-home-block-4', interval: 8000, indicators: false, classes: carouselClasses },
	                this.renderItems()
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

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___2Xb8X","vCenter":"style__vCenter___hmun0","button1":"style__button1___1hNj-","button2":"style__button2___1PxHI","button":"style__button___2WejV","button2b":"style__button2b___3PsG1","controls":"style__controls___20l_V","vCenterRel":"style__vCenterRel___2lPVo","hCenter":"style__hCenter___1JZnn","inheritHeight":"style__inheritHeight___1rILl","hideOverflow":"style__hideOverflow___1Q2PJ","icon-sprites":"style__icon-sprites___38gIr","button3":"style__button3___1BqYh","button3v1":"style__button3v1___rymdE","button3v2":"style__button3v2___3AaDs","button3v3":"style__button3v3___313Qy","button3v4":"style__button3v4___3NRPp","wrapper1":"style__wrapper1___3ANK2","wrapper2":"style__wrapper2___2RaJ7","sideSwipe":"style__sideSwipe___2Dk6P","bottomSwipe":"style__bottomSwipe___1PfSR","title1":"style__title1___25IAx","title2":"style__title2___wfjef","title3":"style__title3___EBeus","title4":"style__title4____YoIR","title5":"style__title5___T2PV8","title6":"style__title6___G7Bi3","title":"style__title___3PYI0","title7":"style__title7___18HEf","title8":"style__title8___1HuLF","image1":"style__image1___3Iegh","image":"style__image___t1t90","paragraph1":"style__paragraph1___1KYt4","paragraph1b":"style__paragraph1b___3FINH","paragraph":"style__paragraph___2ThL6","paragraph2":"style__paragraph2___2j4Qo","paragraph3":"style__paragraph3___29XST","paragraph4":"style__paragraph4___3QuOc","paragraph5":"style__paragraph5___39V90","wrapper":"style__wrapper___17dlG","carrouselImg":"style__carrouselImg___1peuz"};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

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


	var style = __webpack_require__(43);

	var Block5 = function (_React$Component) {
	  _inherits(Block5, _React$Component);

	  function Block5() {
	    _classCallCheck(this, Block5);

	    return _possibleConstructorReturn(this, (Block5.__proto__ || Object.getPrototypeOf(Block5)).apply(this, arguments));
	  }

	  _createClass(Block5, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
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
	              { className: 'col-sm-12 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title },
	                'Recorrido Virtual Pavlova Escuela de Danza'
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                '\xA1Conoce nuestras instalaciones!'
	              ),
	              _react2.default.createElement('iframe', { src: 'https://www.google.com/maps/embed?pb=!4v1541182910595!6m8!1m7!1sCAoSLEFGMVFpcE5qXzV5WUk1bnN4OHhtYUdfSDkzVGExa2RDMzRELTZWZXp4aldF!2m2!1d32.504544235447!2d-116.9994770827!3f34.500004!4f0!5f0.7820865974627469', width: '100%', height: '450', frameBorder: '0', allowFullScreen: true })
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Block5;
	}(_react2.default.Component);

	exports.default = Block5;


	Block5.propTypes = {
	  data: _react2.default.PropTypes.object,
	  classes: _react2.default.PropTypes.object
	};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter____Xii_","vCenter":"style__vCenter___1y14f","vCenterRel":"style__vCenterRel___24jA4","hCenter":"style__hCenter___Y4AN-","inheritHeight":"style__inheritHeight___21aOY","hideOverflow":"style__hideOverflow___3055I","icon-sprites":"style__icon-sprites___1DmEO","wrapper1":"style__wrapper1___3Sf2J","wrapper2":"style__wrapper2___2cdfa","title1":"style__title1___1xJzR","title2":"style__title2___1zpqe","title3":"style__title3___2P9aT","title4":"style__title4___2H0zb","title5":"style__title5___2k4qe","title6":"style__title6___1OLsu","title":"style__title___2hWLk","title7":"style__title7___AbXjb","title8":"style__title8___YMND7","paragraph1":"style__paragraph1___3S9mq","paragraph1b":"style__paragraph1b___3C0_Q","paragraph":"style__paragraph___hyObP","paragraph2":"style__paragraph2___3o3XQ","paragraph3":"style__paragraph3___2QU4m","paragraph4":"style__paragraph4___oQEgF","paragraph5":"style__paragraph5___1-rXW","wrapper":"style__wrapper___2AmaT"};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(45);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(48);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(50);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(52);

	var _block8 = _interopRequireDefault(_block7);

	var _block9 = __webpack_require__(54);

	var _block10 = _interopRequireDefault(_block9);

	var _block11 = __webpack_require__(60);

	var _block12 = _interopRequireDefault(_block11);

	var _block13 = __webpack_require__(62);

	var _block14 = _interopRequireDefault(_block13);

	var _data = __webpack_require__(64);

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

	    return _possibleConstructorReturn(this, (AboutSection.__proto__ || Object.getPrototypeOf(AboutSection)).apply(this, arguments));
	  }

	  _createClass(AboutSection, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          params = _props.params,
	          data = _props.data;
	      var block1 = data.block1,
	          block2 = data.block2,
	          block3 = data.block3,
	          block4 = data.block4,
	          block5 = data.block5,
	          block7 = data.block7,
	          block8 = data.block8;
	      var showListItem = params.showListItem;

	      var block3Variations = {
	        variation1: 'mainbannerC',
	        variation2: 'titleC'
	      };
	      var block5Variations = {
	        variation1: 'mainbannerE',
	        variation2: 'titleE'
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

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _imageUtil = __webpack_require__(33);

	var _sanitize = __webpack_require__(46);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(47);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, (Block1.__proto__ || Object.getPrototypeOf(Block1)).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'render',
	    value: function render() {
	      var styles = this.props.style;
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          paragraphs = _props$data.paragraphs;

	      var divStyle = (0, _imageUtil.getImageBackground)('/images/escuela/escuela-header.jpg');
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
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement('p', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(paragraphs.paragraph1) }),
	              _react2.default.createElement(_svg2.default, { network: 'arrow_down', className: style.svg })
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

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (data) {
	  return {
	    __html: data
	  };
	};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___31Hcb","vCenter":"style__vCenter___1vIHp","button1":"style__button1___knh5C","button2":"style__button2___3rlK3","button2b":"style__button2b___H0Brp","vCenterRel":"style__vCenterRel___370S2","hCenter":"style__hCenter___35qeO","inheritHeight":"style__inheritHeight___1sRB4","hideOverflow":"style__hideOverflow___3Yokh","icon-sprites":"style__icon-sprites___1i1iv","button3":"style__button3___2KaTC","button3v1":"style__button3v1___16SWp","button3v2":"style__button3v2___3N8UW","button3v3":"style__button3v3___2h7PD","button3v4":"style__button3v4___3p_tP","sideSwipe":"style__sideSwipe___3OFJQ","bottomSwipe":"style__bottomSwipe___3ltu-","title1":"style__title1___1LlDm","title":"style__title___JG5hq","title2":"style__title2___3ep2l","title3":"style__title3___1URy1","title4":"style__title4___1U9Z2","title5":"style__title5___1Vr2v","title6":"style__title6___2K-qx","title7":"style__title7___3y_yN","title8":"style__title8___1urYo","paragraph1":"style__paragraph1___8Df9P","paragraph1b":"style__paragraph1b___2_mfn","paragraph2":"style__paragraph2___KQkCk","paragraph3":"style__paragraph3___2Y3uZ","paragraph":"style__paragraph___1Wwqc","paragraph4":"style__paragraph4___2iSO1","paragraph5":"style__paragraph5___iOq2N","mainbanner":"style__mainbanner___3hjPv","svg":"style__svg___29LI3"};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _sanitize = __webpack_require__(46);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(49);

	var Block2 = function (_React$Component) {
	  _inherits(Block2, _React$Component);

	  function Block2() {
	    _classCallCheck(this, Block2);

	    return _possibleConstructorReturn(this, (Block2.__proto__ || Object.getPrototypeOf(Block2)).apply(this, arguments));
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
	              { className: style.title },
	              item.title
	            ),
	            _react2.default.createElement('div', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content) })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          buttons = _props$data.buttons,
	          slides = _props$data.slides;

	      var divStyle = (0, _imageUtil.getImageBackground)('/images/escuela/banner-flamenco.jpg');
	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        },
	        indicator: {
	          base: style.indicators,
	          active: style.active
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
	                { className: style.button, to: buttons.button1.href },
	                buttons.button1.title,
	                _react2.default.createElement(_svg2.default, { network: 'arrow_right' })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-4 col-xs-10 col-xs-offset-1' },
	              _react2.default.createElement(
	                'p',
	                { className: style.tagline },
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

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___xP6Z-","vCenter":"style__vCenter___3EDwH","button1":"style__button1___ma4vA","button2":"style__button2___1Fwzx","button":"style__button___15DCt","button2b":"style__button2b___GtnQK","vCenterRel":"style__vCenterRel___1d1I_","hCenter":"style__hCenter___3LKuT","inheritHeight":"style__inheritHeight___11OVE","hideOverflow":"style__hideOverflow___1koJ0","icon-sprites":"style__icon-sprites___2uiLf","button3":"style__button3___3p2Pg","button3v1":"style__button3v1____mMiu","button3v2":"style__button3v2___7-kje","button3v3":"style__button3v3___2-obj","button3v4":"style__button3v4___ldhG5","sideSwipe":"style__sideSwipe___19HIU","bottomSwipe":"style__bottomSwipe___3RO2M","title1":"style__title1___2c1PC","title2":"style__title2___U0Za7","title3":"style__title3___qpZuD","title4":"style__title4___c-0OO","title5":"style__title5___XOjHY","title6":"style__title6___2E_cG","title":"style__title___3-jmd","title7":"style__title7___21JO_","title8":"style__title8___36gBQ","paragraph1":"style__paragraph1___1m33N","paragraph1b":"style__paragraph1b___30nAD","paragraph":"style__paragraph___2dz5L","paragraph2":"style__paragraph2___3OtNY","paragraph3":"style__paragraph3___3qs1J","paragraph4":"style__paragraph4___3oqJH","paragraph5":"style__paragraph5___akVWK","tagline":"style__tagline___Dl43p","mainbanner":"style__mainbanner___37cO7","svg":"style__svg___25w61","inner":"style__inner___1SA8W","indicators":"style__indicators___1lG-t"};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

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


	var style = __webpack_require__(51);

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, (Block3.__proto__ || Object.getPrototypeOf(Block3)).apply(this, arguments));
	  }

	  _createClass(Block3, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          data = _props.data,
	          variations = _props.variations;
	      var titles = data.titles,
	          images = data.images;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { style: divStyle, className: style[variations.variation1] },
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
	                { className: style[variations.variation2] },
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

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1cV0K","vCenter":"style__vCenter___36W6o","button1":"style__button1___ysj8P","button2":"style__button2___3T26W","button2b":"style__button2b___2FwWn","vCenterRel":"style__vCenterRel___1YqGI","hCenter":"style__hCenter___3Rsy5","inheritHeight":"style__inheritHeight___2L2YW","hideOverflow":"style__hideOverflow___R7Nky","icon-sprites":"style__icon-sprites___1R2yV","button3":"style__button3___1B5ky","button3v1":"style__button3v1___1K2ga","button3v2":"style__button3v2___2cSYL","button3v3":"style__button3v3___2QAs0","button3v4":"style__button3v4___1yJWM","sideSwipe":"style__sideSwipe___1wQDY","bottomSwipe":"style__bottomSwipe___3FjOI","title1":"style__title1___36WkF","titleC":"style__titleC___3Juam","titleE":"style__titleE___3vfVE","title2":"style__title2___21MoW","title3":"style__title3___WdO4l","title4":"style__title4___3vPE_","title5":"style__title5___1hZAj","title6":"style__title6___3ZgkO","title7":"style__title7___3fXSj","title8":"style__title8___zKD-A","paragraph1":"style__paragraph1___227GM","paragraph1b":"style__paragraph1b___3yolC","paragraph2":"style__paragraph2___1thX2","paragraph3":"style__paragraph3___2HqvV","paragraph4":"style__paragraph4___N1_Zr","paragraph5":"style__paragraph5___c7_OI","mainbannerC":"style__mainbannerC___1dg2G","mainbannerE":"style__mainbannerE___2wqi4"};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _sanitize = __webpack_require__(46);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(53);

	var Block4 = function (_React$Component) {
	  _inherits(Block4, _React$Component);

	  function Block4() {
	    _classCallCheck(this, Block4);

	    return _possibleConstructorReturn(this, (Block4.__proto__ || Object.getPrototypeOf(Block4)).apply(this, arguments));
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
	              { className: style.title },
	              item.title
	            ),
	            _react2.default.createElement('div', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content) })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          images = _props$data.images,
	          slides = _props$data.slides;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        },
	        indicator: {
	          base: style.indicators,
	          active: style.active
	        }
	      };
	      var imgUrl = images.image1.src ? images.image1.src.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : images.image1.src;
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: style.wrapper },
	        _react2.default.createElement(
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

/***/ }),
/* 53 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3P8Pp","vCenter":"style__vCenter___2Et1N","button1":"style__button1___1pbIc","button2":"style__button2___1FucC","button2b":"style__button2b___2FsuG","vCenterRel":"style__vCenterRel___3DCRz","hCenter":"style__hCenter___wKyoU","inheritHeight":"style__inheritHeight___1zL8U","hideOverflow":"style__hideOverflow___3ZV71","icon-sprites":"style__icon-sprites___8RQVq","button3":"style__button3___1uWcc","button3v1":"style__button3v1___2s-Yj","button3v2":"style__button3v2___2VAH8","button3v3":"style__button3v3___iwEeg","button3v4":"style__button3v4___3wMtL","sideSwipe":"style__sideSwipe___13jwX","bottomSwipe":"style__bottomSwipe___2_85D","title1":"style__title1___1w9oV","title2":"style__title2___2-ry2","title3":"style__title3___L0OLC","title4":"style__title4___2yc3s","title5":"style__title5___TtpHn","title6":"style__title6___eDkzQ","title":"style__title___2_j9U","title7":"style__title7___1eGbP","title8":"style__title8___3UdhB","paragraph1":"style__paragraph1___3QbsS","paragraph1b":"style__paragraph1b___2rvU9","paragraph":"style__paragraph___2RMic","paragraph2":"style__paragraph2___26NJ4","paragraph3":"style__paragraph3___3Uj57","paragraph4":"style__paragraph4___3ImpF","paragraph5":"style__paragraph5___3cZ7N","wrapper":"style__wrapper___3B2lE","indicators":"style__indicators___3yzgC"};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _listShow = __webpack_require__(55);

	var _listShow2 = _interopRequireDefault(_listShow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(59);

	var Block6 = function (_React$Component) {
	  _inherits(Block6, _React$Component);

	  function Block6() {
	    _classCallCheck(this, Block6);

	    return _possibleConstructorReturn(this, (Block6.__proto__ || Object.getPrototypeOf(Block6)).apply(this, arguments));
	  }

	  _createClass(Block6, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          data = _props.data,
	          showListItem = _props.showListItem;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: style.wrapper },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(_listShow2.default, { data: data, item: showListItem, style: style })
	        )
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

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _list = __webpack_require__(56);

	var _list2 = _interopRequireDefault(_list);

	var _show = __webpack_require__(58);

	var _show2 = _interopRequireDefault(_show);

	var _slug = __webpack_require__(57);

	var _slug2 = _interopRequireDefault(_slug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ListShow = function (_React$Component) {
	  _inherits(ListShow, _React$Component);

	  function ListShow() {
	    _classCallCheck(this, ListShow);

	    return _possibleConstructorReturn(this, (ListShow.__proto__ || Object.getPrototypeOf(ListShow)).apply(this, arguments));
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
	      var _props = this.props,
	          data = _props.data,
	          item = _props.item,
	          style = _props.style;

	      var itemInfo = this.getItemInfo(data.items, item);
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-5 col-xs-12' },
	            _react2.default.createElement(
	              'h2',
	              { className: style.title },
	              'Conoce a nuestro staff'
	            ),
	            _react2.default.createElement(_list2.default, { data: data, item: item, style: style })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-sm-offset-1 col-xs-12' },
	            _react2.default.createElement(_show2.default, { items: data.items, data: itemInfo, style: style })
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
	  item: _react2.default.PropTypes.string,
	  style: _react2.default.PropTypes.object
	};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _slug = __webpack_require__(57);

	var _slug2 = _interopRequireDefault(_slug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	var List = function (_React$Component) {
	  _inherits(List, _React$Component);

	  function List() {
	    _classCallCheck(this, List);

	    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
	  }

	  _createClass(List, [{
	    key: 'renderItems',
	    value: function renderItems(data, sectionUrl, itemUrl, style) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var slug = (0, _slug2.default)(item.title);
	          var className = '';
	          if (!itemUrl && index === 0) {
	            className = style.active;
	          } else if (slug === itemUrl) {
	            className = style.active;
	          }
	          return _react2.default.createElement(
	            'div',
	            { key: index, className: style.item },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { className: className, to: '/' + sectionUrl + '/' + slug, title: item.title },
	              item.title,
	              _react2.default.createElement(_svg2.default, { network: 'arrow_right', className: style.svg })
	            )
	          );
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          data = _props.data,
	          item = _props.item,
	          style = _props.style;

	      return _react2.default.createElement(
	        'div',
	        null,
	        this.renderItems(data.items, data.sectionUrl, item, style)
	      );
	    }
	  }]);

	  return List;
	}(_react2.default.Component);

	exports.default = List;


	List.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired,
	  item: _react2.default.PropTypes.string,
	  style: _react2.default.PropTypes.object
	};

/***/ }),
/* 57 */
/***/ (function(module, exports) {

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

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _slug = __webpack_require__(57);

	var _slug2 = _interopRequireDefault(_slug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Show = function (_React$Component) {
	  _inherits(Show, _React$Component);

	  function Show() {
	    _classCallCheck(this, Show);

	    return _possibleConstructorReturn(this, (Show.__proto__ || Object.getPrototypeOf(Show)).apply(this, arguments));
	  }

	  _createClass(Show, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          if (_lodash2.default.isArray(item)) {
	            var bullets = item.map(function (line, index2) {
	              return _react2.default.createElement(
	                'li',
	                { key: index2 },
	                line
	              );
	            });
	            return _react2.default.createElement(
	              'ul',
	              { key: index },
	              bullets
	            );
	          }
	          return _react2.default.createElement(
	            'p',
	            { key: index },
	            item
	          );
	        });
	      }
	    }
	  }, {
	    key: 'renderIds',
	    value: function renderIds(data) {
	      return data.map(function (item, index) {
	        var id = (0, _slug2.default)(item.title);
	        return _react2.default.createElement('span', { id: id, key: index });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          data = _props.data,
	          style = _props.style,
	          items = _props.items;

	      var imgUrl = (0, _imageUtil.normalizeImageUrl)(data.image);
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.renderIds(items),
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-12' },
	            _react2.default.createElement('img', { className: style.image, src: imgUrl, alt: data.title })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs-12' },
	            _react2.default.createElement(
	              'h3',
	              { className: style.subtitle },
	              data.subtitle
	            ),
	            _react2.default.createElement(
	              'p',
	              { className: style.content },
	              data.intro
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-xs-12' },
	            _react2.default.createElement(
	              'div',
	              { className: style.content },
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
	  data: _react2.default.PropTypes.object.isRequired,
	  style: _react2.default.PropTypes.object,
	  items: _react2.default.PropTypes.array
	};

/***/ }),
/* 59 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___5Hdev","vCenter":"style__vCenter___2R7xI","item":"style__item___19454","svg":"style__svg___3EKSG","vCenterRel":"style__vCenterRel___1n4Yk","hCenter":"style__hCenter___3Hr8B","inheritHeight":"style__inheritHeight___1S0fd","hideOverflow":"style__hideOverflow___ABBe6","icon-sprites":"style__icon-sprites___3FKSV","title1":"style__title1___3gJwS","title2":"style__title2___2UYID","title3":"style__title3___AphF6","subtitle":"style__subtitle___eiDqf","title4":"style__title4___VjkpC","title5":"style__title5___1rO0v","title6":"style__title6___19b6v","title":"style__title___2v8uo","title7":"style__title7___3lYX3","title8":"style__title8___2nnP7","paragraph1":"style__paragraph1___27lCC","paragraph1b":"style__paragraph1b___kWEkR","content":"style__content___2WHKr","paragraph2":"style__paragraph2___1Cp7R","paragraph3":"style__paragraph3___1gcAp","paragraph4":"style__paragraph4___3OSxZ","paragraph5":"style__paragraph5___2ND05","wrapper":"style__wrapper___2dGti","active":"style__active___2EtVR","image":"style__image___2RETE"};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _sanitize = __webpack_require__(46);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(61);

	var Block7 = function (_React$Component) {
	  _inherits(Block7, _React$Component);

	  function Block7() {
	    _classCallCheck(this, Block7);

	    return _possibleConstructorReturn(this, (Block7.__proto__ || Object.getPrototypeOf(Block7)).apply(this, arguments));
	  }

	  _createClass(Block7, [{
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          return _react2.default.createElement(
	            'div',
	            { className: 'item col-sm-10 col-sm-offset-1 ' + className, key: index },
	            _react2.default.createElement('p', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(item.content) }),
	            _react2.default.createElement(
	              'p',
	              { className: style.author },
	              item.title
	            )
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          slides = _props$data.slides;

	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next,
	          arrow: style.arrow
	        }
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: 'container-fluid' },
	        _react2.default.createElement(
	          'h2',
	          { className: style.title },
	          titles.title1
	        ),
	        _react2.default.createElement(
	          _carousel2.default,
	          { id: 'carousel-about-block-7', interval: 8000, indicators: false, classes: carouselClasses },
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

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1YJUo","vCenter":"style__vCenter___1XSDF","vCenterRel":"style__vCenterRel___1J02z","hCenter":"style__hCenter___2Tdv3","inheritHeight":"style__inheritHeight___fdY-6","hideOverflow":"style__hideOverflow___GHITu","icon-sprites":"style__icon-sprites___1TCxk","title1":"style__title1___3raEq","title2":"style__title2___xWuEp","title3":"style__title3___2JND3","title4":"style__title4___3VrXj","title5":"style__title5___14ULg","title6":"style__title6___3Jlc3","title":"style__title___2FxDg","title7":"style__title7___1VsjO","title8":"style__title8___1VtVb","paragraph1":"style__paragraph1___CrxJb","paragraph1b":"style__paragraph1b___f3SZQ","paragraph":"style__paragraph___2hS_M","paragraph2":"style__paragraph2___2Dt1n","author":"style__author___fROZn","paragraph3":"style__paragraph3___NvRs3","paragraph4":"style__paragraph4___1DBvl","paragraph5":"style__paragraph5___3BI-s","arrow":"style__arrow___2yiv-"};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(63);

	var Block8 = function (_React$Component) {
	  _inherits(Block8, _React$Component);

	  function Block8() {
	    _classCallCheck(this, Block8);

	    return _possibleConstructorReturn(this, (Block8.__proto__ || Object.getPrototypeOf(Block8)).apply(this, arguments));
	  }

	  _createClass(Block8, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          buttons = _props$data.buttons;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: style.wrapper },
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
	                'h3',
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.button, href: (0, _imageUtil.normalizeImageUrl)('/docs/horarios-pavlova-2018-19.pdf'), title: buttons.button1.title, target: '_blank' },
	                'DESCARGAR',
	                _react2.default.createElement(_svg2.default, { network: 'arrow_down', className: style.svg })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-6 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title3
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.button, href: (0, _imageUtil.normalizeImageUrl)(buttons.button3.href), title: buttons.button3.title, target: '_blank' },
	                'DESCARGAR',
	                _react2.default.createElement(_svg2.default, { network: 'arrow_down', className: style.svg })
	              )
	            )
	          )
	        )
	      ) : null;
	    }
	  }]);

	  return Block8;
	}(_react2.default.Component);

	exports.default = Block8;


	Block8.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired
	};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1G5oi","vCenter":"style__vCenter___3eMr-","button1":"style__button1___3rP8P","button":"style__button___138RC","button2":"style__button2___A09os","button2b":"style__button2b___7okhD","vCenterRel":"style__vCenterRel___2FPbE","hCenter":"style__hCenter___273Vb","inheritHeight":"style__inheritHeight___2w5-4","hideOverflow":"style__hideOverflow___35OAp","icon-sprites":"style__icon-sprites___3gAB_","button3":"style__button3___2H38R","button3v1":"style__button3v1___2UPHY","button3v2":"style__button3v2___21LXu","button3v3":"style__button3v3___3aio2","button3v4":"style__button3v4___1E1O4","title1":"style__title1___2Hrv_","title2":"style__title2___14zdY","title3":"style__title3___wJv6I","title4":"style__title4___bi5rE","title5":"style__title5___1Jrqb","title6":"style__title6___3IfL7","title7":"style__title7___vVSgO","title8":"style__title8___23FzZ","title":"style__title___2GTcd","sideSwipe":"style__sideSwipe___2kJhL","bottomSwipe":"style__bottomSwipe___Iacpj","wrapper":"style__wrapper___3pHW-"};

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* eslint max-len: [2, 1000, 4] */
	exports.default = {
	  title: 'Conoce a nuestro staff',
	  sectionUrl: 'escuela',
	  items: [{
	    title: 'GLORIA ZUÑIGA',
	    subtitle: 'GLORIA ZUÑIGA DE WHEBER',
	    intro: '',
	    image: 'https://www.dropbox.com/s/s02dsqogkixpk4x/Img-Gloria-Zuniga.png?dl=0',
	    content: ['Gloria inició sus clases de baile a los 3 años de edad en las disciplinas de ballet y jazz con la maestra Sandra Araiza. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Técnica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certificó como Maestra de Aerobics por ISAT (Institute School of Aerobic Training) y en 1992 se graduó en la Universidad de San Diego State como Licenciada en Danza donde participó durante 4 años en la compañía de esta Universidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet "Cascanueces" en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que a tomado cursos como:', ['GUS (Giordiano Workshop) en Monterrey, N.L. en 2001', 'Curso para maestros en la escuela "Broadway Dance Center" de Nueva York en 2006.', 'The Pulse en los Angeles C.A EN 2009', 'Nuvo workshop en Long Beach en 2014', 'Jump workshop en Monterrey, Nuevo León en 2015', 'Curso de Anatomía aplicado a maestros de Danza en 2016', 'Dance Teacher Summit en Long Beach, CA. - 2016, 2017 y 2018'], 'En el año 2014 funda junto con Alicia Luna el grupo  Pas de Chat el cual tiene como objetivo identificar, proyectar y destacar el talento exigente de las alumnas de la Academia de Danza Pavlova para que las representen en competencias locales, regionales, nacionales e internacionales.', 'Gloria continúa tomando clases de ballet y asiste a cursos de jazz en la Academia de Performing Arts  en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.', 'Su trayectoria como maestra y directora en Pavlova ha estado marcada por la constancia y motivación que ha transmitido a sus alumnas durante 31 años.']
	  }, {
	    title: 'ALICIA LUNA',
	    subtitle: 'ALICIA LUNA',
	    intro: '',
	    image: 'https://www.dropbox.com/s/3b1zex2m6csljia/Img_Alicia-Luna.png?dl=0',
	    content: ['Lichita inició su preparación en la Academia de Sandra Araiza y posteriormente en la Escuela de Danza Gloria Campobello. Fue así que formó su destino en esta disciplina para convertirse en maestra de danza y posteriormente cofundadora y directora de la Escuela de Danza Pavlova fundada en el año de 1987.', 'Mientras estuvo en la escuela Campobello, disfrutaba al máximo sus clases como alumna y asistente, donde después de 3 años logró certificarse como Maestra en Técnica de Danza.', 'En el 2014 fundó, junto con Gloria Zuñiga, el grupo Pas de Chat. Este grupo esta integrado por alumnas destacadas de la escuela de danza Pavlova, quienes representan con orgullo y talento a la escuela en distintas competencias de nivel nacional e internacional.', 'Buscando siempre estar actualizada y comprometida con su carrera ha tomado cursos como:', ['Curso de Metodología de la Danza 2014 – Tijuana B.C.', 'Dance Teachers Summit 2015 – Irvine CA.', 'Dance Makers 2015 – Los Ángeles CA.', 'Iniciación a la Danza 2015 – Tijuana B.C.', 'Curso de Anatomía aplicado a maestros de Danza en 2016 – Tijuana B.C.', 'Curso Dance Teacher Summit en Long Beach, CA. –2016 y 2017', 'Actualmente se sigue preparando con clases de Ballet Clásico.'], 'El tiempo y la entrega que Lichita dedica a sus alumnas, representan la oportunidad de edificar y promover orden, disciplina y convivencia, teniendo como propósito el fomentar los valores que las acompañarán toda su vida, no sólo como un bonito recuerdo, sino como parte de su formación como personas.']
	  }, {
	    title: 'MILY WEHBER',
	    subtitle: 'MILY WEHBER',
	    intro: '',
	    image: 'https://www.dropbox.com/s/mdw3idb1vbek96z/Img-Mily-Wehber.png?dl=0',
	    content: ['Ana Emely Wehber Barreiro, inicia sus estudios a los 4 años de edad en la escuela de danza Gloria Campobello, logrando obtener el título de Técnico en Danza. A los 16 años empieza como asistente de maestra y un año mas tarde la escuela de danza "Nandielo", dandole la oportunidad de dar clases como maestra. Participó como alumna y maestra en la escuela de Danza "Betty Gándara" por 4 años, simultáneamente tomó clases de danza en San Diego State University con maestros como Kelly Grant (Jazz) , George Willis (Contemporáneo). Tomó cursos de Stage 7, Threes Compony y  APA, (Academy of Performing Arts). Workshop de Gus Giordano en Monterrey, ademéas de asistir en Los Angeles CA. con Joe Tremaines, Musicwork Shop, The Pulse. Recientemente participo en Palooza y Novu en Long Beach, CA. con el maestro Yannis Marshall y 24/7 Workshop.', 'Ha participado en el Carnaval Antifaz Fundación Luz, como coreógrafa en el 2012 y 2013, obteniendo el premio de la mejor coreografía en el 2012.', 'Empezó a dar clases en la escuela de danza Pavlova, desde que esta abrió sus puertas.', '"Mi gran pasión es ser maestra de danza... Ver a mis alumnas crecer, como bailarinas, como disfrutan sus clases, transmitirles el amor por la danza, la constancia , diciplina, ver como logran sus metas, y saber que tu eres parte de estos logros, es una de mis más grandes satisfacciones en la vida." – Miss Mily']
	  }, {
	    title: 'ALEJANDRA GUTIERRÉZ',
	    subtitle: 'ALEJANDRA GUTIERRÉZ',
	    intro: '',
	    image: 'https://www.dropbox.com/s/r81hjmxo9niz3pf/Img-Alejandra-Gutierrez.png?dl=0',
	    content: ['Inicio sus estudios a la edad de 3 años en el colegio de danza Sylvia bajo la dirección de la maestra Silvia Elena Martínez, estudio ahí por más de 15 años en las disciplinas de Jazz, Ballet y Tap, donde tuvo la oportunidad de asistir a varios cursos como NYCDA, Tremaine y Al Gilbert. Fue asistente en la disciplina de Tap.', 'A la edad de 16 años empezó siendo maestra y asistente en la escuela de danza Ancheyta dando clases de tap y jazz.', 'A los 19 empezó dando clases en la escuela de danza Pavlova Hipódromo en la disciplina de jazz. Se ha preparado en varios cursos como Dancemakers, Nuvo en long beach, Jump Monterrey, 24/7 en San diego, Dance Teacher Summit LB y DancerPalozza en Long beach.', 'Coreógrafa en la escuela de danza Coppelia donde sus alumnas obtuvieron varios primeros lugares en la competencia Dance Makers en la disciplina de lirico así como un premio especial por mejor coreografía.', 'Actualmente forma parte del equipo de trabajo de la escuela Pavlova Hipódromo y es coreógrafa del grupo de competencia Pasdechat by Pavlova con el cual ha viajado a varios concursos nacionales e internacionales, obteniendo varios primeros lugares por sus coreografías y reconocidas becas para sus alumnas, el curso más reconocido que han becado a sus alumnas es Dance Awards.', 'Es una maestra reconocida por sus coreografías tanto en jazz como en lírico en niveles intermedios y avanzados.']
	  }, {
	    title: 'GABY LUNA',
	    subtitle: 'GABY LUNA',
	    intro: '',
	    image: 'https://www.dropbox.com/s/j8xkmek0y87lfvd/Img_Gaby-Luna.png?dl=0',
	    content: ['Nació el 6 de Octubre de 1981 en Tijuana, inicio sus estudios de danza en la escuela de Danza Pavlova Hipódromo en 1986 a la edad de 5 años. En el año de 1998 inicio su carrera como maestra de ballet y Jazz en Pavlova. Del 2007 al 2009 fue directora y maestra de ballet y jazz en la escuela de danza Danzart – Tijuana.', 'Del 2009 al 2011 fue directora de y maestro de ballet y jazz en la escuela de danza Danzart Academy of Chula Vista Ca.', 'Cursos de Baile:', ['Gus Giordanos Workshops – Monterrey N.L. | Septiembre 2001', 'Broadway Dance Center – Nueva York  | Agosto 2007', 'Metodología de la Danza – Tijuana | Agosto 2013', 'Diversos cursos en Academy of Perdorming Arts (APA)', 'Diversos cursos en Culture Shock of San Diego Ca.']]
	  }, {
	    title: 'RHONAL RUVALCABA',
	    subtitle: 'RHONAL RUVALCABA',
	    intro: '',
	    image: 'https://www.dropbox.com/s/1qdunfgs9xl72b1/Rhonal-Ruvalcaba.png?dl=0',
	    content: ['Inicio sus estudios de danza a la edad de 14 años, descubriendo en ella su vocación! Su preparación abarca diversas ramas de esta disciplina, pero son el Jazz y el HipHop su mayor pasión, ganador del 1er lugar en la categoría de Jazz en Danzarte (concurso de Danza realizado anteriormente en Baja California hace ya algunos años).', 'Es Director de su propia Compañía de Danza, con la cual ha llevado su pasión y estilo a diversas partes del mundo desde Taiwan o Puerto Rico, así como a gran parte de México y E.U. como las Vegas, Miami y L.A. entre otros.']
	  }, {
	    title: 'DALIA DE LA TORRE',
	    subtitle: 'DALIA DE LA TORRE',
	    intro: '',
	    image: 'https://www.dropbox.com/s/alncb3qtjcflz5h/Dalia_delatorre.png?dl=0',
	    content: ['Nació el 25 de Febrero de 1984 en Tijuana, inicio sus estudios en 1988 en la Escuela de Danza Ericka, bajo la dirección de Ericka Moreno, en las disciplinas de ballet, jazz y tap. Teniendo la oportunidad de competir en Estados Unidos y Canadá desde los 9 años, en compañias como Dance America – Dance Olympus, Dance Educators of America, Danza Arte Coreografías entre otras. También a tenido la oportunidad de participar en cursos intensivos, clases magistrales, giras y clases en compañias como Dance Olympus, Tremaine, Malashock Summer Intensive, EDGE Performing Arts Center, Broadway Dance Center, West Coast Salsa Congress, Luz Boreal Summer Intensive.', 'Obtuvo varios reconocimientos y becas, de los cuales destacan "Dance of the year contestan" en Dance America 2001, 2003 y 2005, ganando una beca para asistir a Broadway Dance Center, así como el titulo Best Emotional Execution, Best Technical Execution y Overall High Score en San Diego CA y Nueva York.', '10 años de experiencia como maestra de ballet, jazz y tap, la respaldan. Actualmente es miembro de la organización Dance Educators of America, obteniendo la certificación compelta en la ciudad de de Las Vegas y Nueva York en los años 2007 y 2008, culminando en el 2010 con la certificación para impartir las diciplinas de ballet (escuela Cecchetti), tap, jazz, gimnasia y moderno.']
	  }, {
	    title: 'CORINA PERAZA',
	    subtitle: 'CORINA PERAZA',
	    intro: '',
	    image: 'https://www.dropbox.com/s/78ttm4iz875wtir/Img-Corina-Peraza.png?dl=0',
	    content: ['Corina es originaria de Tijuana y desde muy pequeña empezó a bailar Flamenco. Es hija de la famosa bailarina española Teresa Jaen, miembro del dueto "Teresa y Antonio Jaen". El tener a su madre como instructora, le ha ayudado a desarrollarse cada vez más a través de los años.', 'Lleva el arte en sus venas, es por ello que Corina comparte con sus estudiantes el mismo sentimiento y pasión por el baile Flamenco. Es sabido que cualquier forma de arte se transforma en comunicación, entonces, qué mejor manera de transmitirlo tan intensamente a sus estudiantes que a través del amor y pasión del baile Flamenco.']
	  }, {
	    title: 'CLAUDIA LUNA',
	    subtitle: 'CLAUDIA LUNA',
	    intro: '',
	    image: 'https://www.dropbox.com/s/u0fp0uwjuc220wq/Img_Claudia-Luna.png?dl=0',
	    content: ['Desde que tenia 4 años inicie en el ambito de la danza, en la Escuela de Danza Gloria Campobello. Obtuve el certificado de maestra en tecnica de danza a los 16 años.', 'La experiencia laboral ha sido en distintas instituciones como:', 'Escuela de danza Gloria  campobello,casino de Mexicali,escuela Felix de Jesus en Mexicali,Escuela Patria,escuela Francis Parker en san Diego;actualmente cuenta con 28 años de pertenecer a la escuela de danza Pavlova como maestra de Ballet.', 'Entre los certificados y cursos que obtenido son: Técnica en Danza, Gus Giordiano (2001), Music Workshop Unlimited de Al Gilbert, Tremaniine Dance convention (2004), Music workshop (2005), Stage 7 San Diego. Comparsa antifaz (2013), Escuela Nicte-Ha, Dance Teacher Summit (2015).', 'He tomado clases con diferentes profesores, como Raul Martinez Tadeo, Maria del Carmen Padron, Tatiana Chevchenko, Carla Mariscal, Alberto Terreros y Gustavo Nava.', '"El ser Maestra le permite transmitir a sus alumnas el amor a la danza por medio de la disciplina y constancia, además de sembrar en ellos la ilusión de ser bailarinas." – Miss Claudia.']
	  }, {
	    title: 'JESSICA TAMEZ',
	    subtitle: 'JESSICA TAMEZ',
	    intro: '',
	    image: 'https://www.dropbox.com/s/d5mojxozu8lvpgn/Img_Jessica-Temez.png?dl=0',
	    content: ['En 1988 empecé mis estudios en la Escuela de Danza Pavlova bajo la dirección de Gloria Zúñiga y Alicia Luna.  Durante 9 años. En el 2000 ingresé al Centro de Ballet y Arte, bajo la dirección de la Profesora Verónica Mendoza (Primera Bailarina de la Compañía de danza de Baja California) y Perla Orantes (Primera Solista CDBC)  En los años 2002 y 2003 participé con la Compañía de Danza de Baja California, presentándome con ellos en sus temporadas. Y en este mismo año me dieron la oportunidad de empezar a impartir clases en el Centro de Ballet y Arte a niñas de 4 a 6 años.', 'En  2003 y en el 2005 Participé como solista y en grupo  en una Competencia de Danza llevada a cabo en  la Universidad de San Diego," Spotlight Dance Cup"  calificando  para la final que se llevó a cabo en Las Vegas Nevada en esos mismos años. Del año 2006 al 2014 impartí clases en el Instituto México junto con la profesora Carmen García, combinando danza con gimnasia, a nivel primaria. 2005 al 2007 Clases de ballet en el Auditorio Municipal de Tijuana.', 'En el 2007  empiezo a ser parte del equipo Pavlova.', 'Experiencias y logros', 'Bailar en la Compañia de Baja California bajo la dirección de Raúl Martínez  Tadeo y participar en sus repertorios como: Cascanueces, Giselle, La raza de Bronce, Paquita, Orfeo, asi como El Lago de los Cisnes donde tuve la oportunidad de conocer a los   primeros bailarines de la Compañía Nacional de Danza Irma Morales y Raúl Fernández.', 'Participar en SpotLight Dance Cup, primero como bailarina, y unos años mas tarde  como coreógrafa. Asistir como alumna y maestra a los Cursos de Iniciación y Actualización de la Danza impartidos en las instalaciones del Centro de Ballet y Arte en los veranos.', 'Coordinación y participación como maestra de Ballet y Artes Plásticas del Programa Habitat de la Secretaría de Desarrollo Social Municipal de Tijuana, B.C. Octubre-enero 2006', 'Participé en el curso Internacional de danza Clásica Dance It Tijuana bajo la dirección de la maestra Nicte Ha Escobosa y tomando clases con maestros como Irma Morales y Frank Fisher', 'Asistir como coreógrafa  al festival de Gimnasia  en la Ciudad de Colima y en knott\'s Berry Farm en Dance & Cheer con las alumnas del Instituto México, así como en SpotLight dance Cup.']
	  }, {
	    title: 'BÁRBARA MARTÍNEZ',
	    subtitle: 'BÁRBARA MARTÍNEZ',
	    intro: '',
	    image: 'https://www.dropbox.com/s/fhuqvmm5vzkg4cd/Img-Barbara-Martinez.png?dl=0',
	    content: ['A partir de los 7años Barbara inicio sus clases de baile en la escuela Gloria Campobello. Posteriormente fue acreedora a algunos diplomas, obteniendo la Licenciatura en Danza en 1994.', 'Laboralmente cuenta con una amplia experiencia como maestra en las escuelas:  Sylvia,Gloria Campobello, Galina Ulanova,Dance Center, Academia de Ballet Playas, Marycarmen Profesionales en Danza, Mentor Mexicano, UABC, CETYS Universidad así como 14 años en Pavlova.', 'Además  de su participación  en varios cursos como: Dance Olimpus (1991), Cuballet- Mexico, Southwester, Youth Day of Dance, Cinderella (1993) Escuela Petrushka y Compañia de Danza de B.C. (1995) Gran Final DanzarteCoreografia(1996) Escuela Galina Ulanova (1996-2003), Summer Intensive City Ballet (1997), Summer Intensive Master Teachers City Ballet (1999), Gus Giordano Jazz World Congress (2001), Tremaine Dance Convention (2004) Music Works (2005) Especialidad en Pedagogía UNIVER (2005) Taller con Sofia Correa (2012) Palozza(2013)Nuvo(2014) Dance Teacher Summit(2015) Miembro AMA-Prodanza.']
	  }, {
	    title: 'MAYRA JIMÉNEZ',
	    subtitle: 'MAYRA JIMÉNEZ',
	    intro: '',
	    image: 'https://www.dropbox.com/s/1ubs0mhib2ca80a/Img_Mayra-Jimenez.png?dl=0',
	    content: ['Nacio el 4 de Junio del 1988. Mayra desde sus 4 años de edad comenzó a experimentar tomando clases de Jazz, y 2 años después comenzó tomando clases de ballet. Hasta la fecha sigue practicando la danza, habiendo tomado aparte de Ballet y Jazz,  clases de Contemporáneo con Miroslava Wilson y  Hip-Hop con el maestro Omar Silva dentro de la Escuela " Ballet Cámara de la Frontera" del Maestro Rafael Oseguera, habiéndose graduado como Bailarina Clásica y Contemporánea.', 'Tiene 9 años de experiencia como Maestra impartiendo clases de Jazz, Ballet, y Lirico. Habiendo concluido con cursos de Metodología para la Danza y pedagogía.', 'Asistiendo al 5to y 6to Congreso Nacional de Danza Jazz en Morelia Michoacán con maestros como: Guillermo Maldonado (barra al piso y pedagogía), Guillermina Gómez y John Lehrer (Jazz), Joshua Bergasse de Nueva York (jazz), Elvin Venegas de Nicaragua (técnica clásica – Ballet), Jermaine Browne de nueva York (hip-hop), Alexis Zanette de Cuba (danza moderna), entre otros. También a tomando el Curso Internacional de Danza Clásica "DANCE IT 2007 y 2008" con la primera Bailarina Irma Morales y Frank Fischer.', 'Posteriormente obteniendo una beca para formar parte de un grupo de baile de la escuela "Culture Shock Dance Center" en San Diego. Asistio Entre el 2014 y 2015 a un curso de Jazz  y "Hells" con Yanis Marshall (bailarin y maestro Internacional) y una Materclass de ballet con la maestra Elena Tokareva Baltovick; entre otros cursos locales.', 'Ha participado en varias obras musicales Infantiles como son "Cri-cri y la danza", "El mago de Oz", "Peter Pan", "Alicia en el país de las maravillas", como también en "La fille Mal Garde", "Graduados", "Cascanueces" y "Carmen" presentadas en el Teatro del Cecut.', 'Su objetivo es transmitir de la manera más correcta todo lo que ha aprendido de la danza, todo lo bueno que le ha dejado e inculcar en el alumnado una disciplina y amor a la danza, a la cultura, al arte, haciéndolas sentir que es una de las mejores maneras para expresar todo aquello que nuestro cuerpo siente.']
	  }, {
	    title: 'LILIAN ARMENTA',
	    subtitle: 'LILIAN ARMENTA',
	    intro: '',
	    image: 'https://www.dropbox.com/s/qi97pgj3mlmnaz5/Img_Lilian_Armenta.png?dl=0',
	    content: ['Coreografa y maestro con más de 23 años bailando, 8 años de experiencia como maestro de ballet, tap, jazz, hip-hop, lyrical, modern jazz, etc.', 'Certificada por el DEA (Dance Educators of America) en la ciudad de Las Vegas, Nevada.', 'Participante y ganadora de diversos premios en competencias internacionales en ciudades como: Las Vegas, Nueva York, Orlando, Los Ángeles, San Diego, San Francisco, etc. por compañias como West Coast Dance Explosion, Dance Olympus, Tremaine, Dance America y DEA.']
	  }, {
	    title: 'ELEANA FRANCO',
	    subtitle: 'ELEANA FRANCO',
	    intro: '',
	    image: 'https://www.dropbox.com/s/5eh2c3nmsi7le3g/Eleana-Franco.png?dl=0',
	    content: ['Bailarina, coreógrafa y maestra de danza nacida en Estados Unidos. Inicio sus estudios a la edad de 2 anos en el “Colegio de Danza Sylvia” donde aprendió ballet, tap, flamenco, jazz y hip hop. Varios años después se convirtió en asistente y próximamente en maestra.', 'Participo en varias importantes obras como es “el cascanueces” junto con la compañía “Moscow ballet” en el Civic Theatre en San Diego y también junto con la “Compañía de danza de Baja California” con Raul Tadeo. También fue participe de la obra infantil “pedro y el lobo” que fue presentada en el CECUT bajo la dirección de Norma Herrera. Continuo con sus estudios en Estados Unidos en la escuela “Coronado School of the Arts” donde estudio varios cursos de historia de la danza, nutrición, improvisación, critica de la danza, coreografía entre muchos otros.', 'Actualmente se encuentra aplicando estos conocimientos como maestra y busca seguir creciendo para compartir este conocimiento con sus alumnos.']
	  }, {
	    title: 'ADRIANA CORAL',
	    subtitle: 'ADRIANA CORAL',
	    intro: '',
	    image: 'https://www.dropbox.com/s/q4kedajs4rgdqe1/Adriana-Coral.png?dl=0',
	    content: ['Bailarina y maestra que se desarrolla profesionalmente  en el norte de México; miembro fundador de Subterráneo Danza Contemporánea desde hace 17 años, donde su misión es exponer su trabajo como intérprete y colaborador creativo en la realización de espectáculos escénicos. Mantiene una constante búsqueda del lenguaje propio a través de la investigación en diferentes técnicas dancísticas  así como la divulgación de sus conocimientos a través de la docencia, asimismo, busca mantener vínculos estrechos con otros artistas escénicos del país para fortalecer su quehacer  dancístico y contribuir a la difusión del arte.']
	  }, {
	    title: 'VICKY SAENZ',
	    subtitle: 'VICKY SAENZ',
	    intro: '',
	    image: 'https://www.dropbox.com/s/7ngb2v9j29d1xd2/Vicky-Saenz.png?dl=0',
	    content: []
	  }, {
	    title: 'ROSALINA CAZAREZ',
	    subtitle: 'ROSALINA CAZAREZ',
	    intro: '',
	    image: 'https://www.dropbox.com/s/le82urikib91xek/Rosalina_Cazarez.png?dl=0',
	    content: []
	  }, {
	    title: 'GIOVANI GONZÁLEZ ALARCÓN',
	    subtitle: 'GIOVANI GONZÁLEZ ALARCÓN',
	    intro: '',
	    image: '/images/escuela/staff/giovani-alarcon.jpg',
	    content: ['Egresado de la Lic. en Actividad Física y Deporte por la Universidad Autónoma de Baja California, con amplia experiencia en presentaciones profesionales incluyendo participación en shows de la cadena televisiva Telemundo, eventos masivos en Los Ángeles y en Baja California, incluyendo apertura de múltiples conciertos de artistas en la región.', 'Impartió clases de Cardio Dance y Cardio Hip Hop en diversos gimnasios de la Ciudad de Tijuana. Maestro de Hip-Jazz en los principales estudios de Danza en Tijuana.', 'Coreógrafo Profesional, forma parte de la compañía de Hip Hop "Culture Shock" en San Diego.']
	  }, {
	    title: 'MÓNICA ZITLALI GARZA MAYORAL',
	    subtitle: 'MÓNICA ZITLALI GARZA MAYORAL',
	    intro: '',
	    image: '/images/escuela/staff/monica-zitlali.png',
	    content: ['Técnico en Danza y Maestra en Educación egresada de CETYS Universidad, Licenciada en Filosofía y en Ciencias de la Educación, tiene una vasta experiencia en el ámbito docente de danza clásica y ballet, ejerciendo profesionalmente en organizaciones como el CEART, Hospital Infantil de las Californias, CECUTEC, estudios de danza y colegios en la región.']
	  }]
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(66);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(36);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(68);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(62);

	var _block8 = _interopRequireDefault(_block7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var balletData = __webpack_require__(70);
	var jazzData = __webpack_require__(71);
	var flamencoData = __webpack_require__(72);

	var ProductsSection = function (_React$Component) {
	  _inherits(ProductsSection, _React$Component);

	  function ProductsSection(props) {
	    _classCallCheck(this, ProductsSection);

	    var _this = _possibleConstructorReturn(this, (ProductsSection.__proto__ || Object.getPrototypeOf(ProductsSection)).call(this, props));

	    _this.state = {
	      types: ['SLIDER_CONTENT', 'CONTENT_SLIDER', 'SLIDER_CONTENT', 'CONTENT_SLIDER', 'SLIDER_CONTENT']
	    };
	    return _this;
	  }

	  _createClass(ProductsSection, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      /*eslint-disable */
	      this.setState({
	        types: ['CONTENT_SLIDER', 'CONTENT_SLIDER', 'CONTENT_SLIDER', 'CONTENT_SLIDER', 'CONTENT_SLIDER']
	      });
	      /*eslint-enable */
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          block1 = _props$data.block1,
	          block2 = _props$data.block2,
	          block8 = _props$data.block8;

	      var block3Variations = {
	        variation1: 'ballet'
	      };
	      var block4Variations = {
	        variation1: 'jazz'
	      };
	      var block5Variations = {
	        variation1: 'flamenco'
	      };
	      var types = this.state.types;


	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2 }),
	        _react2.default.createElement(_block6.default, { data: balletData, type: types[0], variations: block3Variations }),
	        _react2.default.createElement(_block6.default, { data: jazzData, type: types[1], variations: block4Variations }),
	        _react2.default.createElement(_block6.default, { data: flamencoData, type: types[2], variations: block5Variations }),
	        _react2.default.createElement(_block8.default, { data: block8 })
	      ) : null;
	    }
	  }]);

	  return ProductsSection;
	}(_react2.default.Component);

	exports.default = ProductsSection;


	ProductsSection.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _imageUtil = __webpack_require__(33);

	var _sanitize = __webpack_require__(46);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(67);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, (Block1.__proto__ || Object.getPrototypeOf(Block1)).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'render',
	    value: function render() {
	      var styles = this.props.style;
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          paragraphs = _props$data.paragraphs;

	      var divStyle = (0, _imageUtil.getImageBackground)('/images/clases/header-clases.jpg');
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
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement('p', { className: style.paragraph, dangerouslySetInnerHTML: (0, _sanitize2.default)(paragraphs.paragraph1) }),
	              _react2.default.createElement(_svg2.default, { network: 'arrow_down', className: style.svg })
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

/***/ }),
/* 67 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1j0pv","vCenter":"style__vCenter___2KQFQ","button1":"style__button1___3ZmPV","button2":"style__button2___2shnn","button2b":"style__button2b___9qjJ-","vCenterRel":"style__vCenterRel___34eYy","hCenter":"style__hCenter___1Lkdf","inheritHeight":"style__inheritHeight___1q40G","hideOverflow":"style__hideOverflow___DrxCZ","icon-sprites":"style__icon-sprites___3tV9U","button3":"style__button3___3VbYO","button3v1":"style__button3v1___1AjUN","button3v2":"style__button3v2___3ejfJ","button3v3":"style__button3v3___B8Ol9","button3v4":"style__button3v4___31_JU","sideSwipe":"style__sideSwipe___1FVlo","bottomSwipe":"style__bottomSwipe___2c0uL","title1":"style__title1___1gW4S","title":"style__title___SyWrl","title2":"style__title2___2Tj1e","title3":"style__title3___1HOPW","title4":"style__title4___3J4Je","title5":"style__title5___2Nimp","title6":"style__title6___1J_L3","title7":"style__title7___2tzA4","title8":"style__title8___2p7DZ","paragraph1":"style__paragraph1___3jelK","paragraph1b":"style__paragraph1b___2o55y","paragraph2":"style__paragraph2___3QqbA","paragraph3":"style__paragraph3___2muKz","paragraph":"style__paragraph___2nuu4","paragraph4":"style__paragraph4___1geTk","paragraph5":"style__paragraph5___30-m9","mainbanner":"style__mainbanner___17dAE","svg":"style__svg___1UaPh"};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _slug = __webpack_require__(57);

	var _slug2 = _interopRequireDefault(_slug);

	var _imageUtil = __webpack_require__(33);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(69);

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, (Block3.__proto__ || Object.getPrototypeOf(Block3)).apply(this, arguments));
	  }

	  _createClass(Block3, [{
	    key: 'getColumnSlider',
	    value: function getColumnSlider(slides, item, noControls) {
	      var carouselClasses = {
	        inner: style.inner,
	        controls: {
	          base: style.controls,
	          prev: style.prev,
	          next: style.next
	        }
	      };
	      var slug = (0, _slug2.default)(item);
	      return _react2.default.createElement(
	        'div',
	        { className: 'col-xs-12 col-sm-6' },
	        noControls !== false ? _react2.default.createElement(
	          _carousel2.default,
	          { id: 'carousel-clases-' + slug, interval: 8000, indicators: false, classes: carouselClasses },
	          this.renderItems(slides)
	        ) : _react2.default.createElement(
	          _carousel2.default,
	          { id: 'carousel-clases-' + slug, interval: 8000, indicators: false, controls: false, classes: carouselClasses },
	          this.renderItems(slides)
	        )
	      );
	    }
	  }, {
	    key: 'getColumnContent',
	    value: function getColumnContent(titles, paragraphs, buttons, danceStyle) {
	      return _react2.default.createElement(
	        'div',
	        { className: 'col-xs-12 col-sm-5' },
	        _react2.default.createElement(
	          'h2',
	          { className: style.title + ' ' + style[danceStyle] },
	          titles.title1
	        ),
	        _react2.default.createElement(
	          'p',
	          { className: style.paragraph },
	          paragraphs.paragraph1
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs12' },
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { className: style.button, to: (0, _imageUtil.normalizeImageUrl)(buttons.button1.href), target: '_blank' },
	              buttons.button1.title,
	              _react2.default.createElement(_svg2.default, { network: 'arrow_down' })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-6 col-xs12 ' + style.sm },
	            buttons.button2 ? (0, _svg.getFacebookIcon)(buttons.button2.href, buttons.button2.title, style.paragraphB) : null
	          )
	        )
	      );
	    }
	  }, {
	    key: 'renderItems',
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          var imageUrl = (0, _imageUtil.normalizeImageUrl)(item.image);
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className + ' ' + (style.item || ''), key: index },
	            _react2.default.createElement('img', { src: imageUrl, alt: item.title, className: style.image })
	          );
	        });
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          data = _props.data,
	          type = _props.type,
	          variations = _props.variations,
	          noControls = _props.noControls;
	      var titles = data.titles,
	          slides = data.slides,
	          paragraphs = data.paragraphs,
	          buttons = data.buttons;

	      var sliderEl = this.getColumnSlider(slides, titles.title1, noControls);
	      var contentEl = this.getColumnContent(titles, paragraphs, buttons, variations.variation1);
	      var blockId = (0, _slug2.default)(titles.title1);

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { id: blockId, className: style.wrapper_2 },
	        _react2.default.createElement(
	          'div',
	          { className: 'container-fluid' },
	          _react2.default.createElement(
	            'div',
	            { className: 'row ' + style.wrapper_ },
	            type === 'SLIDER_CONTENT' ? sliderEl : contentEl,
	            _react2.default.createElement('div', { className: 'col-sm-1 hidden-xs' }),
	            type === 'SLIDER_CONTENT' ? contentEl : sliderEl
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
	  classes: _react2.default.PropTypes.object,
	  type: _react2.default.PropTypes.string.isRequired,
	  variations: _react2.default.PropTypes.object.isRequired,
	  noControls: _react2.default.PropTypes.bool
	};

/***/ }),
/* 69 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___zkvoI","controls":"style__controls___1nXQ8","vCenter":"style__vCenter___1amrF","button1":"style__button1___1wRom","button2":"style__button2___2IfG_","button":"style__button___f4bc2","button2b":"style__button2b___24y9A","vCenterRel":"style__vCenterRel___dRIh_","hCenter":"style__hCenter___3ATdP","inheritHeight":"style__inheritHeight___35WI7","hideOverflow":"style__hideOverflow___1PqV_","icon-sprites":"style__icon-sprites___1wvNu","button3":"style__button3___90xKI","button3v1":"style__button3v1___25MJb","button3v2":"style__button3v2___T-yHl","button3v3":"style__button3v3___2wv4v","button3v4":"style__button3v4___3Cz_c","title":"style__title___2mlf9","wrapper1":"style__wrapper1___3o2Nd","wrapper2":"style__wrapper2___25OyJ","sideSwipe":"style__sideSwipe___10nak","bottomSwipe":"style__bottomSwipe___3ZhaF","title1":"style__title1___1ALfY","title2":"style__title2___1rAMk","title3":"style__title3___3_np7","title4":"style__title4___2PoEp","title5":"style__title5___3oOGE","title6":"style__title6___3AN-Q","title7":"style__title7___JQtWA","title8":"style__title8___1nNSa","image1":"style__image1___1XYmO","image":"style__image___3La5m","paragraph1":"style__paragraph1___GDSgG","paragraph1b":"style__paragraph1b___1ErZp","paragraph":"style__paragraph___altZf","paragraph2":"style__paragraph2___YHIz0","paragraph3":"style__paragraph3___3TUGd","paragraph4":"style__paragraph4___36NX-","paragraphB":"style__paragraphB___3TQhf","paragraph5":"style__paragraph5___1IKiM","wrapper_":"style__wrapper____1tcC1","wrapper_2":"style__wrapper_2___16tcC","sm":"style__sm___OLDFM","ballet":"style__ballet___2ecR7","jazz":"style__jazz___24bYU","flamenco":"style__flamenco___2coaY","cardioDanza":"style__cardioDanza___2LYVb"};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

	'use strict';

	/* eslint max-len: [2, 500, 4] */

	var data = {
	  slides: [{
	    id: 11,
	    image: '/images/clases/ballet/SLIDE-BALLET-1.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 15
	  }, {
	    id: 12,
	    image: '/images/clases/ballet/SLIDE-BALLET-2.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 15
	  }, {
	    id: 28,
	    image: '/images/clases/ballet/SLIDE-BALLET-3.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 15
	  }, {
	    id: 29,
	    image: '/images/clases/ballet/SLIDE-BALLET-4.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 15
	  }, {
	    id: 29,
	    image: '/images/clases/ballet/SLIDE-BALLET-5.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 15
	  }],
	  buttons: {
	    button1: {
	      id: 18,
	      title: 'HORARIOS',
	      href: 'http://www.pavlovahipodromo.com/docs/Pavlova-Horarios-2016.pdf',
	      block: 15
	    },
	    button2: {
	      id: 19,
	      title: 'VER GALERÍAS',
	      href: 'https://www.facebook.com/pavlova.hipodromo/photos/?tab=albums',
	      block: 15
	    }
	  },
	  paragraphs: {
	    paragraph1: 'Los movimientos de Ballet se distinguen especialmente por ser estilizados y transmitir una sensación de amplitud y esplendor. Brindamos un entrenamiento que demanda gran constancia, debido a la concentración requerida para dominar el cuerpo, desarrollando la coordinación, fuerza, flexibilidad y ritmo musical.'
	  },
	  titles: {
	    title1: 'BALLET'
	  }
	};

	module.exports = data;

/***/ }),
/* 71 */
/***/ (function(module, exports) {

	'use strict';

	/* eslint max-len: [2, 500, 4] */

	var data = {
	  slides: [{
	    id: 13,
	    image: '/images/clases/jazz/SLIDE-JAZZ-1.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }, {
	    id: 14,
	    image: '/images/clases/jazz/SLIDE-JAZZ-2.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }, {
	    id: 30,
	    image: '/images/clases/jazz/SLIDE-JAZZ-3.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }, {
	    id: 30,
	    image: '/images/clases/jazz/SLIDE-JAZZ-4.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }, {
	    id: 30,
	    image: '/images/clases/jazz/SLIDE-JAZZ-5.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }, {
	    id: 30,
	    image: '/images/clases/jazz/SLIDE-JAZZ-6.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }, {
	    id: 30,
	    image: '/images/clases/jazz/SLIDE-JAZZ-7.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 16
	  }],
	  buttons: {
	    button1: {
	      id: 20,
	      title: 'HORARIOS',
	      href: 'http://www.pavlovahipodromo.com/docs/Pavlova-Horarios-2016.pdf',
	      block: 16
	    },
	    button2: {
	      id: 21,
	      title: 'VER GALERÍAS',
	      href: 'https://www.facebook.com/pavlova.hipodromo/photos/?tab=albums',
	      block: 16
	    }
	  },
	  paragraphs: {
	    paragraph1: 'La danza Jazz combina armoniosamente ritmos y estilos que se fusionan con técnicas exigentes y movimientos que implican autenticidad y estilo individual. La práctica de Jazz permite que las alumnas trabajen todo el cuerpo obteniendo flexibilidad y tonicidad muscular, además de estilizar los movimientos, ejercitar la memoria y agudizar los sentidos.'
	  },
	  titles: {
	    title1: 'JAZZ'
	  }
	};

	module.exports = data;

/***/ }),
/* 72 */
/***/ (function(module, exports) {

	'use strict';

	/* eslint max-len: [2, 500, 4] */

	var data = {
	  slides: [{
	    id: 15,
	    image: '/images/clases/flamenco/SLIDE-FLAMENCO-1.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 17
	  }, {
	    id: 16,
	    image: '/images/clases/flamenco/SLIDE-FLAMENCO-2.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 17
	  }, {
	    id: 31,
	    image: '/images/clases/flamenco/SLIDE-FLAMENCO-3.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 17
	  }, {
	    id: 32,
	    image: '/images/clases/flamenco/SLIDE-FLAMENCO-4.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 17
	  }, {
	    id: 32,
	    image: '/images/clases/flamenco/SLIDE-FLAMENCO-5.jpg',
	    title: '',
	    button_title: '',
	    button_url: '',
	    content: '',
	    block: 17
	  }],
	  buttons: {
	    button1: {
	      id: 22,
	      title: 'HORARIOS',
	      href: 'http://www.pavlovahipodromo.com/docs/Pavlova-Horarios-2016.pdf',
	      block: 17
	    },
	    button2: {
	      id: 23,
	      title: 'VER GALERÍAS',
	      href: 'https://www.facebook.com/pavlova.hipodromo/photos/?tab=albums',
	      block: 17
	    }
	  },
	  paragraphs: {
	    paragraph1: 'Flamenco es una modalidad de baile en la que los movimientos de pies, manos y brazos son muy precisos y coordinados. Al ejercerlo, las alumnas aprenden a concentrarse y respirar correctamente, desarrollan su sensibilidad y creatividad natural, además de forjar su carácter debido al trabajo interno que se requiere para su interpretación.'
	  },
	  titles: { title1: 'FLAMENCO' }
	};

	module.exports = data;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(74);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(76);

	var _block4 = _interopRequireDefault(_block3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ContactSection = function (_React$Component) {
	  _inherits(ContactSection, _React$Component);

	  function ContactSection() {
	    _classCallCheck(this, ContactSection);

	    return _possibleConstructorReturn(this, (ContactSection.__proto__ || Object.getPrototypeOf(ContactSection)).apply(this, arguments));
	  }

	  _createClass(ContactSection, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          block1 = _props$data.block1,
	          block2 = _props$data.block2;

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

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

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

	var style = __webpack_require__(75);

	var Block1 = function (_React$Component) {
	  _inherits(Block1, _React$Component);

	  function Block1() {
	    _classCallCheck(this, Block1);

	    return _possibleConstructorReturn(this, (Block1.__proto__ || Object.getPrototypeOf(Block1)).apply(this, arguments));
	  }

	  _createClass(Block1, [{
	    key: 'render',
	    value: function render() {
	      var images = this.props.data.images;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement('div', { style: divStyle, className: style.mainbanner }) : null;
	    }
	  }]);

	  return Block1;
	}(_react2.default.Component);

	exports.default = Block1;


	Block1.propTypes = {
	  data: _react2.default.PropTypes.object
	};

/***/ }),
/* 75 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3WsSe","vCenter":"style__vCenter___3G_X_","button1":"style__button1___1iQls","button":"style__button___6iE0P","button2":"style__button2___2nT5Y","button2b":"style__button2b___15vcQ","vCenterRel":"style__vCenterRel___2rlOE","hCenter":"style__hCenter___3ARcP","inheritHeight":"style__inheritHeight___1YsqB","hideOverflow":"style__hideOverflow___ps_Tr","icon-sprites":"style__icon-sprites___2f7vT","button3":"style__button3___1WIju","button3v1":"style__button3v1___32z7Y","button3v2":"style__button3v2___3m_1I","button3v3":"style__button3v3___3STSg","button3v4":"style__button3v4___3GtKt","image1":"style__image1___1oYSl","paragraph1":"style__paragraph1___3JnQd","paragraph1b":"style__paragraph1b___xv990","paragraph2":"style__paragraph2___3M3qm","paragraph3":"style__paragraph3___6lKhK","paragraph4":"style__paragraph4___1Z42s","paragraph5":"style__paragraph5___1v105","sideSwipe":"style__sideSwipe___50l2S","bottomSwipe":"style__bottomSwipe___-6WwV","title1":"style__title1___3f0o0","title2":"style__title2___XQgLg","title3":"style__title3___2f5QU","title4":"style__title4___BpZsL","title5":"style__title5___hKWjC","title6":"style__title6___2GSXY","title7":"style__title7___3_kU1","title8":"style__title8___2cLGW","mainbanner":"style__mainbanner___1YlSK","image":"style__image___mSywh"};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _form = __webpack_require__(77);

	var _form2 = _interopRequireDefault(_form);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(79);

	var Block2 = function (_React$Component) {
	  _inherits(Block2, _React$Component);

	  function Block2() {
	    _classCallCheck(this, Block2);

	    return _possibleConstructorReturn(this, (Block2.__proto__ || Object.getPrototypeOf(Block2)).apply(this, arguments));
	  }

	  _createClass(Block2, [{
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data,
	          titles = _props$data.titles,
	          paragraphs = _props$data.paragraphs,
	          buttons = _props$data.buttons;

	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        { className: style.wrapper },
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
	                titles.title1
	              ),
	              _react2.default.createElement(_form2.default, null)
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-4 col-sm-offset-1 col-xs-12' },
	              _react2.default.createElement(
	                'h2',
	                { className: style.title_2 },
	                titles.title2
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph1,
	                _react2.default.createElement('br', null),
	                paragraphs.paragraph2
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.paragraph_2, href: buttons.button1.href, target: '_blank' },
	                buttons.button1.title
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph },
	                paragraphs.paragraph3
	              ),
	              _react2.default.createElement(
	                'h2',
	                { className: style.title_2 },
	                titles.title3
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph_2 },
	                paragraphs.paragraph4
	              ),
	              _react2.default.createElement(
	                'p',
	                { className: style.paragraph_2 },
	                '(664) 200-3031'
	              ),
	              _react2.default.createElement(
	                'div',
	                { className: style.sm },
	                (0, _svg.getFacebookIcon)(buttons.button2.href, buttons.button2.title, style.paragraph2)
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
	  data: _react2.default.PropTypes.object
	};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 600, 4] */

	var style = __webpack_require__(78);

	var Form1 = function (_React$Component) {
	  _inherits(Form1, _React$Component);

	  function Form1(props) {
	    _classCallCheck(this, Form1);

	    var _this2 = _possibleConstructorReturn(this, (Form1.__proto__ || Object.getPrototypeOf(Form1)).call(this, props));

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
	      var _event$target = event.target,
	          name = _event$target.name,
	          value = _event$target.value;

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
	      event.preventDefault();
	      var formData = this.state.formData;
	      var isFormValid = this.validateForm(formData, this.state.requiredFields);
	      var msgElement = $('#msg');
	      msgElement.removeClass(style.errorCSSClass + ' ' + style.successCSSClass);
	      msgElement.html('');

	      if (isFormValid) {
	        this.setState({
	          showLoading: true
	        });
	        msgElement.html('Enviando...');
	        var _this = this;
	        var html = this.getHTMLMessage(formData);
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
	      } else {
	        msgElement.addClass(style.errorCSSClass);
	      }
	      msgElement.html(!isFormValid ? 'Favor de llenar los campos en rojo.' : '');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state$formData = this.state.formData,
	          name = _state$formData.name,
	          email = _state$formData.email,
	          tel = _state$formData.tel,
	          message = _state$formData.message;


	      return _react2.default.createElement(
	        'form',
	        { id: 'form', className: style.form + ' form-horizontal' },
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group ' + style.formGroup },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-xs-2' },
	            _react2.default.createElement(
	              'label',
	              { id: 'lab_name', className: 'row control-label' },
	              'Nombre:'
	            )
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
	            'div',
	            { className: 'col-xs-2' },
	            _react2.default.createElement(
	              'label',
	              { id: 'lab_email', className: 'row control-label' },
	              'Correo:'
	            )
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
	            'div',
	            { className: 'col-xs-2' },
	            _react2.default.createElement(
	              'label',
	              { id: 'lab_tel', className: 'row control-label' },
	              'Tele\u0301fono:'
	            )
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
	            'div',
	            { className: 'col-xs-2' },
	            _react2.default.createElement(
	              'label',
	              { id: 'lab_message', className: 'row control-label' },
	              'Mensaje:'
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-12 col-sm-offset-0' },
	            _react2.default.createElement('textarea', { type: 'text', name: 'message', onChange: this.onChangeHandler, value: message.value })
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
	            'ENVIAR',
	            _react2.default.createElement(_svg2.default, { network: 'arrow_right', className: style.svg })
	          )
	        )
	      );
	    }
	  }]);

	  return Form1;
	}(_react2.default.Component);

	exports.default = Form1;

/***/ }),
/* 78 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___365qk","vCenter":"style__vCenter___9LFiT","button1":"style__button1___QW0Tv","submit":"style__submit___2YBRa","button2":"style__button2___3fzL1","button2b":"style__button2b___2h89H","vCenterRel":"style__vCenterRel___27ebh","hCenter":"style__hCenter___3MSN5","inheritHeight":"style__inheritHeight___20X8j","hideOverflow":"style__hideOverflow___1e_Sa","icon-sprites":"style__icon-sprites___SBb6q","button3":"style__button3___1LtgP","button3v1":"style__button3v1___1Mvm_","button3v2":"style__button3v2___1N7QE","button3v3":"style__button3v3___11aHd","button3v4":"style__button3v4___2B0cK","image1":"style__image1___20ULB","paragraph1":"style__paragraph1___1Iuas","paragraph1b":"style__paragraph1b___14XS7","paragraph2":"style__paragraph2___XLNUn","paragraph3":"style__paragraph3___cQhzG","paragraph4":"style__paragraph4___3o8-x","paragraph5":"style__paragraph5___-5J8a","sideSwipe":"style__sideSwipe___3Jh_M","bottomSwipe":"style__bottomSwipe___2N3qh","title1":"style__title1___2DL5-","title2":"style__title2___3etcM","title3":"style__title3___8tZ0C","title4":"style__title4___33kmt","title5":"style__title5___2k_sU","title6":"style__title6___1dv-o","title7":"style__title7___OUaen","title8":"style__title8___1LvKh","form":"style__form___1nnSk","formGroup":"style__formGroup___1VfYe"};

/***/ }),
/* 79 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___YPy8K","vCenter":"style__vCenter___32xVO","button1":"style__button1___1cwjy","button2":"style__button2___hQ_-V","button2b":"style__button2b___1b2RV","vCenterRel":"style__vCenterRel___29zgs","hCenter":"style__hCenter___2lorl","inheritHeight":"style__inheritHeight___VvRBI","hideOverflow":"style__hideOverflow___2GeSp","icon-sprites":"style__icon-sprites___3vhaB","button3":"style__button3___3HwaY","button3v1":"style__button3v1___2Wuut","button3v2":"style__button3v2___5XAeE","button3v3":"style__button3v3___bPEC9","button3v4":"style__button3v4___3dETf","image1":"style__image1___2KQtF","paragraph1":"style__paragraph1___21zOk","paragraph1b":"style__paragraph1b___1kRb1","paragraph":"style__paragraph___29758","paragraph2":"style__paragraph2___1ISwm","paragraph_2":"style__paragraph_2___217YF","paragraph3":"style__paragraph3___34fOz","paragraph4":"style__paragraph4___1tgYT","paragraph5":"style__paragraph5___BDRxV","sideSwipe":"style__sideSwipe___1IOUP","bottomSwipe":"style__bottomSwipe___1Id40","title1":"style__title1___OAVsV","title2":"style__title2___3iVlU","title3":"style__title3___173Gl","title4":"style__title4___JohwZ","title5":"style__title5___3Apbg","title6":"style__title6___8Y1Ek","title":"style__title___31zi9","title_2":"style__title_2___3IHOj","title7":"style__title7___5Kp7I","title8":"style__title8___3uCuH","wrapper":"style__wrapper___2GZMu","sm":"style__sm___1spdw","svg":"style__svg___38pi8"};

/***/ })
/******/ ]);