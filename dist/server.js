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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var convict = __webpack_require__(9);

	var config = convict({
	  email: {
	    doc: 'default contact email',
	    format: String,
	    default: 'pavlovahipodromo@gmail.com'
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
	    _react2.default.createElement(_reactRouter.Route, { path: 'escuela/:showListItem', component: items.showListItem }),
	    _react2.default.createElement(_reactRouter.Route, { path: 'clases/:service', component: items.service })
	  )
	);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 13 */
/***/ function(module, exports) {

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

	var _about = __webpack_require__(42);

	var _about2 = _interopRequireDefault(_about);

	var _products = __webpack_require__(63);

	var _products2 = _interopRequireDefault(_products);

	var _contact = __webpack_require__(66);

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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 19 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___eofHt","vCenter":"style__vCenter___3ydwB","vCenterRel":"style__vCenterRel___1Xcj8","hCenter":"style__hCenter___2IrLV","inheritHeight":"style__inheritHeight___XdU0Q","hideOverflow":"style__hideOverflow___1wNkm","icon-sprites":"style__icon-sprites___33LTB","paragraph1":"style__paragraph1___105nn","paragraph1b":"style__paragraph1b___2EzhZ","paragraph2":"style__paragraph2___1RbUN","paragraph3":"style__paragraph3___1Vukg","paragraph4":"style__paragraph4___2u3F_","paragraph5":"style__paragraph5___1bu0t","fbIcon":"style__fbIcon___3C8wt","facebook":"style__facebook___5cRlv"};

/***/ },
/* 20 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___cfX-h","vCenter":"style__vCenter___ZA14l","navbarBrand":"style__navbarBrand___2rqc0","toggleButton":"style__toggleButton___3q8M1","navbarNavAnchor":"style__navbarNavAnchor___37QYF","vCenterRel":"style__vCenterRel___1GkYt","navbarIcons":"style__navbarIcons___jZlWo","sm_icon":"style__sm_icon___3hlQn","hCenter":"style__hCenter___2Rj-i","inheritHeight":"style__inheritHeight___2LMcf","hideOverflow":"style__hideOverflow___3olA9","icon-sprites":"style__icon-sprites___1xY5y","navbarWrapper":"style__navbarWrapper___VqN0H","navbarDefault":"style__navbarDefault___aolZK","navbarHeader":"style__navbarHeader___2FrdS","iconBar":"style__iconBar___1hD4n","navbarCollapse":"style__navbarCollapse___3blFh","navbarNav":"style__navbarNav___1r3v1","facebook":"style__facebook___5X5oX"};

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
	      var titles = _data2.default.titles;
	      var paragraphs = _data2.default.paragraphs;
	      var buttons = _data2.default.buttons;

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
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button6.href, title: buttons.button6.title },
	                    buttons.button6.title
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
	                ),
	                _react2.default.createElement(
	                  'li',
	                  null,
	                  _react2.default.createElement(
	                    'a',
	                    { href: buttons.button9.href, title: buttons.button9.title, target: '_blank' },
	                    buttons.button9.title
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

/***/ },
/* 22 */
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
	              'Todos los derechos reservados © Pavlova'
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-xs-12 col-sm-6 ' + style.wrapperBy },
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
/* 23 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3sp06","vCenter":"style__vCenter___2G-_B","vCenterRel":"style__vCenterRel___3pk1i","hCenter":"style__hCenter___uDimH","inheritHeight":"style__inheritHeight___1W6vZ","hideOverflow":"style__hideOverflow___1oOYw","icon-sprites":"style__icon-sprites___3Wvbf","footerWrapper":"style__footerWrapper___LwV_7","footerBrand":"style__footerBrand___1BcOo","title":"style__title___3vTD3","paragraph":"style__paragraph___v5jSt","list":"style__list___2_aVL","container":"style__container___1CyCK","powered":"style__powered___3yTUa","wrapperBy":"style__wrapperBy___2KG7E","serviceTitle":"style__serviceTitle___3QrAo","facebook":"style__facebook___3bmod"};

/***/ },
/* 24 */
/***/ function(module, exports) {

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
	    paragraph4: 'info@pavlovahipodromo.com',
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
	    button6: {
	      title: 'BARRÉ',
	      href: '/clases/barre'
	    },
	    button7: {
	      title: 'HORARIOS',
	      href: '/docs/horarios.pdf'
	    },
	    button8: {
	      title: 'FICHA DE INSCRIPCIÓN',
	      href: '/docs/ficha-inscripcion.pdf'
	    },
	    button9: {
	      title: 'REGLAMENTO',
	      href: '/docs/reglamento.pdf'
	    }
	  }
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

	var _block3 = __webpack_require__(36);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(38);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(40);

	var _block8 = _interopRequireDefault(_block7);

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
	          next: style.next
	        }
	      };
	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _carousel2.default,
	          { id: 'carousel-home-block-1', interval: 8000, indicators: false, controls: false, classes: carouselClasses },
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
	        var _ret = function () {
	          var activeClassName = indicatorClass && indicatorClass.active ? 'active ' + indicatorClass.active : 'active';
	          indicators = data.map(function (item, index) {
	            var className = index === 0 ? activeClassName : '';
	            return _react2.default.createElement('li', { 'data-target': '#' + sliderId, 'data-slide-to': index, className: className, key: index });
	          });
	          return {
	            v: _react2.default.createElement(
	              'ol',
	              { className: 'carousel-indicators ' + (indicatorClass.base || '') },
	              indicators
	            )
	          };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      }
	      return null;
	    }
	  }, {
	    key: 'getControls',
	    value: function getControls(sliderId, isVisible, classes) {
	      var base = classes.base;
	      var prev = classes.prev;
	      var next = classes.next;
	      var arrow = classes.arrow;

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
	      var _props = this.props;
	      var id = _props.id;
	      var interval = _props.interval;
	      var children = _props.children;
	      var indicators = _props.indicators;
	      var controls = _props.controls;
	      var classes = _props.classes;

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

/***/ },
/* 35 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1IAv0","vCenter":"style__vCenter___3op1c","button1":"style__button1___3teya","button2":"style__button2___3emCl","item":"style__item___1hdp3","darkBG":"style__darkBG___3_r4I","button2b":"style__button2b___1gkLu","vCenterRel":"style__vCenterRel___3rmpk","hCenter":"style__hCenter___bN1_x","inheritHeight":"style__inheritHeight___3EV0T","hideOverflow":"style__hideOverflow___1jYcy","icon-sprites":"style__icon-sprites___113mW","button3":"style__button3___1egvE","button3v1":"style__button3v1___e8Puv","button3v2":"style__button3v2___aYpPW","button3v3":"style__button3v3___18OJd","button3v4":"style__button3v4___347NJ","button3v5":"style__button3v5___6eHiy","wrapper1":"style__wrapper1___3LV9m","wrapper2":"style__wrapper2___3Do_q","title1":"style__title1___1fgRn","title2":"style__title2___3VQJ-","title3":"style__title3___15G1J","title4":"style__title4___GbpGB","title5":"style__title5___21deO","title6":"style__title6___2x7FO","title7":"style__title7___1Pacu","title8":"style__title8___1BoeB","sideSwipe":"style__sideSwipe___1_Jvs","bottomSwipe":"style__bottomSwipe___2qtvt"};

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
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: style.customCol + ' col-xs-6' },
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { className: style.button3v5 + ' row', to: buttons.button5.href },
	                buttons.button5.title,
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

/***/ },
/* 37 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___ByilZ","vCenter":"style__vCenter___1v0oL","button1":"style__button1___3Mc_g","button2":"style__button2___2zikt","button2b":"style__button2b___UKCOY","vCenterRel":"style__vCenterRel___r367-","hCenter":"style__hCenter___35AKo","inheritHeight":"style__inheritHeight___GkUeM","hideOverflow":"style__hideOverflow___30PJL","icon-sprites":"style__icon-sprites___1crXd","button3":"style__button3___3KWNZ","button3v1":"style__button3v1___3BT_T","button3v2":"style__button3v2___1cST3","button3v3":"style__button3v3___1O1XL","button3v4":"style__button3v4___1ekHt","button3v5":"style__button3v5___m7eJK","image1":"style__image1___4P84q","paragraph1":"style__paragraph1___2Ov3F","paragraph1b":"style__paragraph1b___3CQIB","paragraph2":"style__paragraph2___10FLO","paragraph3":"style__paragraph3___3kGpq","paragraph4":"style__paragraph4___15kjh","paragraph5":"style__paragraph5___3EMdx","sideSwipe":"style__sideSwipe___2tbA2","bottomSwipe":"style__bottomSwipe___3tj3d","title1":"style__title1___3Lp7y","title2":"style__title2___1Nebh","title3":"style__title3___2cBjs","title4":"style__title4___90ELg","title5":"style__title5___3p9GA","title6":"style__title6___1cWpF","title7":"style__title7___1hdkz","title8":"style__title8___4sMWt","customCol":"style__customCol___3nRYv"};

/***/ },
/* 38 */
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
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var buttons = _props$data.buttons;
	      var images = _props$data.images;
	      var paragraphs = _props$data.paragraphs;

	      var divStyle = (0, _imageUtil.getImageBackground)(images.image1);
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

/***/ },
/* 39 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1UpIU","vCenter":"style__vCenter___1YV9g","button1":"style__button1___100rH","button2":"style__button2___SbKZT","button":"style__button____i21N","button2b":"style__button2b___1z6B8","vCenterRel":"style__vCenterRel___1D8tj","hCenter":"style__hCenter___2TvfM","inheritHeight":"style__inheritHeight___3jids","hideOverflow":"style__hideOverflow___16pkQ","icon-sprites":"style__icon-sprites___3x6uL","button3":"style__button3___wn-mV","button3v1":"style__button3v1___2JRum","button3v2":"style__button3v2___1HD5h","button3v3":"style__button3v3___X_IwQ","button3v4":"style__button3v4___2gUdl","button3v5":"style__button3v5___brc20","passeDeChat":"style__passeDeChat___3lcIC","wrapper1":"style__wrapper1___11dmn","wrapper2":"style__wrapper2___btSte","title1":"style__title1___3QBup","title2":"style__title2___19ma5","title3":"style__title3___17GG-","title4":"style__title4___1kzHe","title5":"style__title5___w6HV2","title":"style__title___2uzOV","title6":"style__title6___8k-iy","title7":"style__title7___3kWyz","title8":"style__title8___3tkZ-","sideSwipe":"style__sideSwipe___M8sba","bottomSwipe":"style__bottomSwipe____fcIm","paragraph1":"style__paragraph1___mOtQ_","paragraph1b":"style__paragraph1b___1l31N","paragraph2":"style__paragraph2___34cYP","paragraph3":"style__paragraph3___pE0dO","paragraph":"style__paragraph___1CprJ","paragraph4":"style__paragraph4___2Bqj7","paragraph5":"style__paragraph5___8lnUF"};

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

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _imageUtil = __webpack_require__(33);

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
	    value: function renderItems(data) {
	      if (_lodash2.default.isArray(data) && data.length) {
	        return data.map(function (item, index) {
	          var className = index === 0 ? 'active' : '';
	          var imageUrl = (0, _imageUtil.normalizeImageUrl)(item.image);
	          return _react2.default.createElement(
	            'div',
	            { className: 'item ' + className + ' ' + (style.item || ''), key: index },
	            _react2.default.createElement('img', { className: style.carrouselImg, src: imageUrl, alt: item.title })
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
/* 41 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___2Xb8X","vCenter":"style__vCenter___hmun0","button1":"style__button1___1hNj-","button2":"style__button2___1PxHI","button":"style__button___2WejV","button2b":"style__button2b___3PsG1","controls":"style__controls___20l_V","vCenterRel":"style__vCenterRel___2lPVo","hCenter":"style__hCenter___1JZnn","inheritHeight":"style__inheritHeight___1rILl","hideOverflow":"style__hideOverflow___1Q2PJ","icon-sprites":"style__icon-sprites___38gIr","button3":"style__button3___1BqYh","button3v1":"style__button3v1___rymdE","button3v2":"style__button3v2___3AaDs","button3v3":"style__button3v3___313Qy","button3v4":"style__button3v4___3NRPp","button3v5":"style__button3v5___3Klbx","wrapper1":"style__wrapper1___3ANK2","wrapper2":"style__wrapper2___2RaJ7","sideSwipe":"style__sideSwipe___2Dk6P","bottomSwipe":"style__bottomSwipe___1PfSR","title1":"style__title1___25IAx","title2":"style__title2___wfjef","title3":"style__title3___EBeus","title4":"style__title4____YoIR","title5":"style__title5___T2PV8","title6":"style__title6___G7Bi3","title":"style__title___3PYI0","title7":"style__title7___18HEf","title8":"style__title8___1HuLF","image1":"style__image1___3Iegh","image":"style__image___t1t90","paragraph1":"style__paragraph1___1KYt4","paragraph1b":"style__paragraph1b___3FINH","paragraph":"style__paragraph___2ThL6","paragraph2":"style__paragraph2___2j4Qo","paragraph3":"style__paragraph3___29XST","paragraph4":"style__paragraph4___3QuOc","paragraph5":"style__paragraph5___39V90","wrapper":"style__wrapper___17dlG","carrouselImg":"style__carrouselImg___1peuz"};

/***/ },
/* 42 */
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

	var _block = __webpack_require__(43);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(46);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(48);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(50);

	var _block8 = _interopRequireDefault(_block7);

	var _block9 = __webpack_require__(52);

	var _block10 = _interopRequireDefault(_block9);

	var _block11 = __webpack_require__(58);

	var _block12 = _interopRequireDefault(_block11);

	var _block13 = __webpack_require__(60);

	var _block14 = _interopRequireDefault(_block13);

	var _data = __webpack_require__(62);

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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _imageUtil = __webpack_require__(33);

	var _sanitize = __webpack_require__(44);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(45);

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

/***/ },
/* 44 */
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
/* 45 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___31Hcb","vCenter":"style__vCenter___1vIHp","button1":"style__button1___knh5C","button2":"style__button2___3rlK3","button2b":"style__button2b___H0Brp","vCenterRel":"style__vCenterRel___370S2","hCenter":"style__hCenter___35qeO","inheritHeight":"style__inheritHeight___1sRB4","hideOverflow":"style__hideOverflow___3Yokh","icon-sprites":"style__icon-sprites___1i1iv","button3":"style__button3___2KaTC","button3v1":"style__button3v1___16SWp","button3v2":"style__button3v2___3N8UW","button3v3":"style__button3v3___2h7PD","button3v4":"style__button3v4___3p_tP","button3v5":"style__button3v5___2P4jz","sideSwipe":"style__sideSwipe___3OFJQ","bottomSwipe":"style__bottomSwipe___3ltu-","title1":"style__title1___1LlDm","title":"style__title___JG5hq","title2":"style__title2___3ep2l","title3":"style__title3___1URy1","title4":"style__title4___1U9Z2","title5":"style__title5___1Vr2v","title6":"style__title6___2K-qx","title7":"style__title7___3y_yN","title8":"style__title8___1urYo","paragraph1":"style__paragraph1___8Df9P","paragraph1b":"style__paragraph1b___2_mfn","paragraph2":"style__paragraph2___KQkCk","paragraph3":"style__paragraph3___2Y3uZ","paragraph":"style__paragraph___1Wwqc","paragraph4":"style__paragraph4___2iSO1","paragraph5":"style__paragraph5___iOq2N","mainbanner":"style__mainbanner___3hjPv","svg":"style__svg___29LI3"};

/***/ },
/* 46 */
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

	var _sanitize = __webpack_require__(44);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(47);

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

/***/ },
/* 47 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___xP6Z-","vCenter":"style__vCenter___3EDwH","button1":"style__button1___ma4vA","button2":"style__button2___1Fwzx","button":"style__button___15DCt","button2b":"style__button2b___GtnQK","vCenterRel":"style__vCenterRel___1d1I_","hCenter":"style__hCenter___3LKuT","inheritHeight":"style__inheritHeight___11OVE","hideOverflow":"style__hideOverflow___1koJ0","icon-sprites":"style__icon-sprites___2uiLf","button3":"style__button3___3p2Pg","button3v1":"style__button3v1____mMiu","button3v2":"style__button3v2___7-kje","button3v3":"style__button3v3___2-obj","button3v4":"style__button3v4___ldhG5","button3v5":"style__button3v5___1kCHN","sideSwipe":"style__sideSwipe___19HIU","bottomSwipe":"style__bottomSwipe___3RO2M","title1":"style__title1___2c1PC","title2":"style__title2___U0Za7","title3":"style__title3___qpZuD","title4":"style__title4___c-0OO","title5":"style__title5___XOjHY","title6":"style__title6___2E_cG","title":"style__title___3-jmd","title7":"style__title7___21JO_","title8":"style__title8___36gBQ","paragraph1":"style__paragraph1___1m33N","paragraph1b":"style__paragraph1b___30nAD","paragraph":"style__paragraph___2dz5L","paragraph2":"style__paragraph2___3OtNY","paragraph3":"style__paragraph3___3qs1J","paragraph4":"style__paragraph4___3oqJH","paragraph5":"style__paragraph5___akVWK","tagline":"style__tagline___Dl43p","mainbanner":"style__mainbanner___37cO7","svg":"style__svg___25w61","inner":"style__inner___1SA8W","indicators":"style__indicators___1lG-t"};

/***/ },
/* 48 */
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


	var style = __webpack_require__(49);

	var Block3 = function (_React$Component) {
	  _inherits(Block3, _React$Component);

	  function Block3() {
	    _classCallCheck(this, Block3);

	    return _possibleConstructorReturn(this, (Block3.__proto__ || Object.getPrototypeOf(Block3)).apply(this, arguments));
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

/***/ },
/* 49 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1cV0K","vCenter":"style__vCenter___36W6o","button1":"style__button1___ysj8P","button2":"style__button2___3T26W","button2b":"style__button2b___2FwWn","vCenterRel":"style__vCenterRel___1YqGI","hCenter":"style__hCenter___3Rsy5","inheritHeight":"style__inheritHeight___2L2YW","hideOverflow":"style__hideOverflow___R7Nky","icon-sprites":"style__icon-sprites___1R2yV","button3":"style__button3___1B5ky","button3v1":"style__button3v1___1K2ga","button3v2":"style__button3v2___2cSYL","button3v3":"style__button3v3___2QAs0","button3v4":"style__button3v4___1yJWM","button3v5":"style__button3v5___19FE3","sideSwipe":"style__sideSwipe___1wQDY","bottomSwipe":"style__bottomSwipe___3FjOI","title1":"style__title1___36WkF","titleC":"style__titleC___3Juam","titleE":"style__titleE___3vfVE","title2":"style__title2___21MoW","title3":"style__title3___WdO4l","title4":"style__title4___3vPE_","title5":"style__title5___1hZAj","title6":"style__title6___3ZgkO","title7":"style__title7___3fXSj","title8":"style__title8___zKD-A","paragraph1":"style__paragraph1___227GM","paragraph1b":"style__paragraph1b___3yolC","paragraph2":"style__paragraph2___1thX2","paragraph3":"style__paragraph3___2HqvV","paragraph4":"style__paragraph4___N1_Zr","paragraph5":"style__paragraph5___c7_OI","mainbannerC":"style__mainbannerC___1dg2G","mainbannerE":"style__mainbannerE___2wqi4"};

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

	var _sanitize = __webpack_require__(44);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(51);

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
	      var _props$data = this.props.data;
	      var images = _props$data.images;
	      var slides = _props$data.slides;

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

/***/ },
/* 51 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3P8Pp","vCenter":"style__vCenter___2Et1N","button1":"style__button1___1pbIc","button2":"style__button2___1FucC","button2b":"style__button2b___2FsuG","vCenterRel":"style__vCenterRel___3DCRz","hCenter":"style__hCenter___wKyoU","inheritHeight":"style__inheritHeight___1zL8U","hideOverflow":"style__hideOverflow___3ZV71","icon-sprites":"style__icon-sprites___8RQVq","button3":"style__button3___1uWcc","button3v1":"style__button3v1___2s-Yj","button3v2":"style__button3v2___2VAH8","button3v3":"style__button3v3___iwEeg","button3v4":"style__button3v4___3wMtL","button3v5":"style__button3v5___2ieFT","sideSwipe":"style__sideSwipe___13jwX","bottomSwipe":"style__bottomSwipe___2_85D","title1":"style__title1___1w9oV","title2":"style__title2___2-ry2","title3":"style__title3___L0OLC","title4":"style__title4___2yc3s","title5":"style__title5___TtpHn","title6":"style__title6___eDkzQ","title":"style__title___2_j9U","title7":"style__title7___1eGbP","title8":"style__title8___3UdhB","paragraph1":"style__paragraph1___3QbsS","paragraph1b":"style__paragraph1b___2rvU9","paragraph":"style__paragraph___2RMic","paragraph2":"style__paragraph2___26NJ4","paragraph3":"style__paragraph3___3Uj57","paragraph4":"style__paragraph4___3ImpF","paragraph5":"style__paragraph5___3cZ7N","wrapper":"style__wrapper___3B2lE","indicators":"style__indicators___3yzgC","active":"style__active___3uHbf"};

/***/ },
/* 52 */
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

	var _listShow = __webpack_require__(53);

	var _listShow2 = _interopRequireDefault(_listShow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(57);

	var Block6 = function (_React$Component) {
	  _inherits(Block6, _React$Component);

	  function Block6() {
	    _classCallCheck(this, Block6);

	    return _possibleConstructorReturn(this, (Block6.__proto__ || Object.getPrototypeOf(Block6)).apply(this, arguments));
	  }

	  _createClass(Block6, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var data = _props.data;
	      var showListItem = _props.showListItem;

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

	var _list = __webpack_require__(54);

	var _list2 = _interopRequireDefault(_list);

	var _show = __webpack_require__(56);

	var _show2 = _interopRequireDefault(_show);

	var _slug = __webpack_require__(55);

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
	      var _props = this.props;
	      var data = _props.data;
	      var item = _props.item;
	      var style = _props.style;

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

	var _reactRouter = __webpack_require__(4);

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	var _slug = __webpack_require__(55);

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
	      var _props = this.props;
	      var data = _props.data;
	      var item = _props.item;
	      var style = _props.style;

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

/***/ },
/* 55 */
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

	var _imageUtil = __webpack_require__(33);

	var _slug = __webpack_require__(55);

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
	      var _props = this.props;
	      var data = _props.data;
	      var style = _props.style;
	      var items = _props.items;

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

/***/ },
/* 57 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___5Hdev","vCenter":"style__vCenter___2R7xI","item":"style__item___19454","svg":"style__svg___3EKSG","vCenterRel":"style__vCenterRel___1n4Yk","hCenter":"style__hCenter___3Hr8B","inheritHeight":"style__inheritHeight___1S0fd","hideOverflow":"style__hideOverflow___ABBe6","icon-sprites":"style__icon-sprites___3FKSV","title1":"style__title1___3gJwS","title2":"style__title2___2UYID","title3":"style__title3___AphF6","subtitle":"style__subtitle___eiDqf","title4":"style__title4___VjkpC","title5":"style__title5___1rO0v","title6":"style__title6___19b6v","title":"style__title___2v8uo","title7":"style__title7___3lYX3","title8":"style__title8___2nnP7","paragraph1":"style__paragraph1___27lCC","paragraph1b":"style__paragraph1b___kWEkR","content":"style__content___2WHKr","paragraph2":"style__paragraph2___1Cp7R","paragraph3":"style__paragraph3___1gcAp","paragraph4":"style__paragraph4___3OSxZ","paragraph5":"style__paragraph5___2ND05","wrapper":"style__wrapper___2dGti","active":"style__active___2EtVR","image":"style__image___2RETE"};

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

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _sanitize = __webpack_require__(44);

	var _sanitize2 = _interopRequireDefault(_sanitize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(59);

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
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var slides = _props$data.slides;

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

/***/ },
/* 59 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1YJUo","vCenter":"style__vCenter___1XSDF","vCenterRel":"style__vCenterRel___1J02z","hCenter":"style__hCenter___2Tdv3","inheritHeight":"style__inheritHeight___fdY-6","hideOverflow":"style__hideOverflow___GHITu","icon-sprites":"style__icon-sprites___1TCxk","title1":"style__title1___3raEq","title2":"style__title2___xWuEp","title3":"style__title3___2JND3","title4":"style__title4___3VrXj","title5":"style__title5___14ULg","title6":"style__title6___3Jlc3","title":"style__title___2FxDg","title7":"style__title7___1VsjO","title8":"style__title8___1VtVb","paragraph1":"style__paragraph1___CrxJb","paragraph1b":"style__paragraph1b___f3SZQ","paragraph":"style__paragraph___2hS_M","paragraph2":"style__paragraph2___2Dt1n","author":"style__author___fROZn","paragraph3":"style__paragraph3___NvRs3","paragraph4":"style__paragraph4___1DBvl","paragraph5":"style__paragraph5___3BI-s","arrow":"style__arrow___2yiv-"};

/***/ },
/* 60 */
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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

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
	    key: 'render',
	    value: function render() {
	      var _props$data = this.props.data;
	      var titles = _props$data.titles;
	      var buttons = _props$data.buttons;

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
	              { className: 'col-sm-4 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title1
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.button, href: (0, _imageUtil.normalizeImageUrl)(buttons.button1.href), title: buttons.button1.title, target: '_blank' },
	                'DESCARGAR',
	                _react2.default.createElement(_svg2.default, { network: 'arrow_down', className: style.svg })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-4 col-xs-12' },
	              _react2.default.createElement(
	                'h3',
	                { className: style.title },
	                titles.title2
	              ),
	              _react2.default.createElement(
	                'a',
	                { className: style.button, href: (0, _imageUtil.normalizeImageUrl)(buttons.button2.href), title: buttons.button2.title, target: '_blank' },
	                'DESCARGAR',
	                _react2.default.createElement(_svg2.default, { network: 'arrow_down', className: style.svg })
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              { className: 'col-sm-4 col-xs-12' },
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

	  return Block7;
	}(_react2.default.Component);

	exports.default = Block7;


	Block7.propTypes = {
	  data: _react2.default.PropTypes.object.isRequired
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___1G5oi","vCenter":"style__vCenter___3eMr-","button1":"style__button1___3rP8P","button":"style__button___138RC","button2":"style__button2___A09os","button2b":"style__button2b___7okhD","vCenterRel":"style__vCenterRel___2FPbE","hCenter":"style__hCenter___273Vb","inheritHeight":"style__inheritHeight___2w5-4","hideOverflow":"style__hideOverflow___35OAp","icon-sprites":"style__icon-sprites___3gAB_","button3":"style__button3___2H38R","button3v1":"style__button3v1___2UPHY","button3v2":"style__button3v2___21LXu","button3v3":"style__button3v3___3aio2","button3v4":"style__button3v4___1E1O4","button3v5":"style__button3v5___3OsL3","title1":"style__title1___2Hrv_","title2":"style__title2___14zdY","title3":"style__title3___wJv6I","title4":"style__title4___bi5rE","title5":"style__title5___1Jrqb","title6":"style__title6___3IfL7","title7":"style__title7___vVSgO","title8":"style__title8___23FzZ","title":"style__title___2GTcd","sideSwipe":"style__sideSwipe___2kJhL","bottomSwipe":"style__bottomSwipe___Iacpj","wrapper":"style__wrapper___3pHW-"};

/***/ },
/* 62 */
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
	    image: 'https://www.dropbox.com/s/s02dsqogkixpk4x/Img-Gloria-Zuniga.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'ALICIA LUNA',
	    subtitle: 'ALICIA LUNA',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/3b1zex2m6csljia/Img_Alicia-Luna.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'MILY WEHBER',
	    subtitle: 'MILY WEHBER',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/mdw3idb1vbek96z/Img-Mily-Wehber.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'ALEJANDRA GUTIERRÉZ',
	    subtitle: 'ALEJANDRA GUTIERRÉZ',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/r81hjmxo9niz3pf/Img-Alejandra-Gutierrez.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'GABY LUNA',
	    subtitle: 'GABY LUNA',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/j8xkmek0y87lfvd/Img_Gaby-Luna.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'TANIA ADAME',
	    subtitle: 'TANIA ADAME',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/s8rs8vyfju6cmic/Img-Tania-Adame.png?dl=0',
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
	    image: 'https://www.dropbox.com/s/78ttm4iz875wtir/Img-Corina-Peraza.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'CLAUDIA LUNA',
	    subtitle: 'CLAUDIA LUNA',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/u0fp0uwjuc220wq/Img_Claudia-Luna.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'JESSICA TAMEZ',
	    subtitle: 'JESSICA TAMEZ',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/d5mojxozu8lvpgn/Img_Jessica-Temez.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'BÁRBARA MARTÍNEZ',
	    subtitle: 'BÁRBARA MARTÍNEZ',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/fhuqvmm5vzkg4cd/Img-Barbara-Martinez.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'MAYRA JIMÉNEZ',
	    subtitle: 'MAYRA JIMÉNEZ',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/1ubs0mhib2ca80a/Img_Mayra-Jimenez.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'LILIAN ARMENTA',
	    subtitle: 'LILIAN ARMENTA',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/qi97pgj3mlmnaz5/Img_Lilian_Armenta.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'VICKY SAENZ',
	    subtitle: 'VICKY SAENZ',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/at4sqtsps9210dw/Img-VickySaenz.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'ROSALINA CAZAREZ',
	    subtitle: 'ROSALINA CAZAREZ',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/lygd3hjuuczivc2/Img-Rosalina-Cazarez.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }, {
	    title: 'VERÓNICA FLORES',
	    subtitle: 'VERÓNICA FLORES',
	    intro: '15 años de experiencia',
	    image: 'https://www.dropbox.com/s/bw1xiq136kkzkl0/Img-Veronica-Flores.png?dl=0',
	    content: ['Gloria inició sus clases de baile con la maestra Sandra Araiza desde que tenía tan sólo tres años. Un año después continuó sus estudios en la escuela de danza Gloria Campobello obteniendo su certificado como Téc- nica de Danza a los 17 años. Tres años más tarde se certificó como Maestra de Danza avalada por la Secretaría de Educación Pública (SEP).', 'Siempre con mucha energía y buscando superarse, a los 18 años se certi- ficó como Maestra de Aerobics por ISAT (Institute School of Aerobic Train- ing) y en 1992 se graduó como Licenciada en Danza en San Diego State University, donde participó durante 4 años en la compañía de esta Univer- sidad, realizando presentaciones en teatros de Los Angeles, San Diego, Tijuana y Ensenada.', 'También formó parte de la compañía de Danza de Baja California durante dos años, lo cual implicó gran disciplina y sacrificio; gracias a este esmero participó como solista en el Ballet “Cascanueces” en Diciembre de 1994.', 'Gloria es una persona muy comprometida con su carrera y busca estar actualizada en las últimas técnicas de danza por lo que en verano de 2001 asistió al GUS (Giordiano Workshop) en Monterrey, N.L., y en 2006 tomó el curso para maestras en la escuela y compañía “Broadway Dance Center” de Nueva York.', 'Continúa tomando clases de ballet con la maestra Ma. del Carmen Padrón y asiste a cursos de jazz en la Academia de Performing Arts y Culture Shock en San Diego. Su objetivo principal es dar lo mejor de ella misma como persona, amiga y representante de la academia proyectando el amor y disciplina por la danza.']
	  }]
	};

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

	var _lodash = __webpack_require__(6);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _block = __webpack_require__(43);

	var _block2 = _interopRequireDefault(_block);

	var _block3 = __webpack_require__(36);

	var _block4 = _interopRequireDefault(_block3);

	var _block5 = __webpack_require__(64);

	var _block6 = _interopRequireDefault(_block5);

	var _block7 = __webpack_require__(60);

	var _block8 = _interopRequireDefault(_block7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	// const style = require('./style.scss');

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
	      var _props$data = this.props.data;
	      var block1 = _props$data.block1;
	      var block2 = _props$data.block2;
	      var block3 = _props$data.block3;
	      var block4 = _props$data.block4;
	      var block5 = _props$data.block5;
	      var block6 = _props$data.block6;
	      var block7 = _props$data.block7;
	      var block8 = _props$data.block8;

	      var block3Variations = {
	        variation1: 'ballet'
	      };
	      var block4Variations = {
	        variation1: 'jazz'
	      };
	      var block5Variations = {
	        variation1: 'flamenco'
	      };
	      var block6Variations = {
	        variation1: 'cardioDanza'
	      };
	      var block7Variations = {
	        variation1: 'barre'
	      };
	      var types = this.state.types;


	      return !_lodash2.default.isEmpty(this.props.data) ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_block2.default, { data: block1 }),
	        _react2.default.createElement(_block4.default, { data: block2 }),
	        _react2.default.createElement(_block6.default, { data: block3, type: types[0], variations: block3Variations }),
	        _react2.default.createElement(_block6.default, { data: block4, type: types[1], variations: block4Variations }),
	        _react2.default.createElement(_block6.default, { data: block5, type: types[2], variations: block5Variations }),
	        _react2.default.createElement(_block6.default, { data: block6, type: types[3], variations: block6Variations, noControls: false }),
	        _react2.default.createElement(_block6.default, { data: block7, type: types[4], variations: block7Variations, noControls: false }),
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

/***/ },
/* 64 */
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

	var _carousel = __webpack_require__(34);

	var _carousel2 = _interopRequireDefault(_carousel);

	var _slug = __webpack_require__(55);

	var _slug2 = _interopRequireDefault(_slug);

	var _imageUtil = __webpack_require__(33);

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */


	var style = __webpack_require__(65);

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
	      var _props = this.props;
	      var data = _props.data;
	      var type = _props.type;
	      var variations = _props.variations;
	      var noControls = _props.noControls;
	      var titles = data.titles;
	      var slides = data.slides;
	      var paragraphs = data.paragraphs;
	      var buttons = data.buttons;

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

/***/ },
/* 65 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___zkvoI","controls":"style__controls___1nXQ8","vCenter":"style__vCenter___1amrF","button1":"style__button1___1wRom","button2":"style__button2___2IfG_","button":"style__button___f4bc2","button2b":"style__button2b___24y9A","vCenterRel":"style__vCenterRel___dRIh_","hCenter":"style__hCenter___3ATdP","inheritHeight":"style__inheritHeight___35WI7","hideOverflow":"style__hideOverflow___1PqV_","icon-sprites":"style__icon-sprites___1wvNu","button3":"style__button3___90xKI","button3v1":"style__button3v1___25MJb","button3v2":"style__button3v2___T-yHl","button3v3":"style__button3v3___2wv4v","button3v4":"style__button3v4___3Cz_c","button3v5":"style__button3v5___1gczD","title":"style__title___2mlf9","wrapper1":"style__wrapper1___3o2Nd","wrapper2":"style__wrapper2___25OyJ","sideSwipe":"style__sideSwipe___10nak","bottomSwipe":"style__bottomSwipe___3ZhaF","title1":"style__title1___1ALfY","title2":"style__title2___1rAMk","title3":"style__title3___3_np7","title4":"style__title4___2PoEp","title5":"style__title5___3oOGE","title6":"style__title6___3AN-Q","title7":"style__title7___JQtWA","title8":"style__title8___1nNSa","image1":"style__image1___1XYmO","image":"style__image___3La5m","paragraph1":"style__paragraph1___GDSgG","paragraph1b":"style__paragraph1b___1ErZp","paragraph":"style__paragraph___altZf","paragraph2":"style__paragraph2___YHIz0","paragraph3":"style__paragraph3___3TUGd","paragraph4":"style__paragraph4___36NX-","paragraphB":"style__paragraphB___3TQhf","paragraph5":"style__paragraph5___1IKiM","wrapper_":"style__wrapper____1tcC1","wrapper_2":"style__wrapper_2___16tcC","sm":"style__sm___OLDFM","ballet":"style__ballet___2ecR7","jazz":"style__jazz___24bYU","flamenco":"style__flamenco___2coaY","cardioDanza":"style__cardioDanza___2LYVb","barre":"style__barre___2QrzR"};

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

	    return _possibleConstructorReturn(this, (ContactSection.__proto__ || Object.getPrototypeOf(ContactSection)).apply(this, arguments));
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

	var _imageUtil = __webpack_require__(33);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 500, 4] */

	var style = __webpack_require__(68);

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

/***/ },
/* 68 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___3WsSe","vCenter":"style__vCenter___3G_X_","button1":"style__button1___1iQls","button":"style__button___6iE0P","button2":"style__button2___2nT5Y","button2b":"style__button2b___15vcQ","vCenterRel":"style__vCenterRel___2rlOE","hCenter":"style__hCenter___3ARcP","inheritHeight":"style__inheritHeight___1YsqB","hideOverflow":"style__hideOverflow___ps_Tr","icon-sprites":"style__icon-sprites___2f7vT","button3":"style__button3___1WIju","button3v1":"style__button3v1___32z7Y","button3v2":"style__button3v2___3m_1I","button3v3":"style__button3v3___3STSg","button3v4":"style__button3v4___3GtKt","button3v5":"style__button3v5___2M1AI","image1":"style__image1___1oYSl","paragraph1":"style__paragraph1___3JnQd","paragraph1b":"style__paragraph1b___xv990","paragraph2":"style__paragraph2___3M3qm","paragraph3":"style__paragraph3___6lKhK","paragraph4":"style__paragraph4___1Z42s","paragraph5":"style__paragraph5___1v105","sideSwipe":"style__sideSwipe___50l2S","bottomSwipe":"style__bottomSwipe___-6WwV","title1":"style__title1___3f0o0","title2":"style__title2___XQgLg","title3":"style__title3___2f5QU","title4":"style__title4___BpZsL","title5":"style__title5___hKWjC","title6":"style__title6___2GSXY","title7":"style__title7___3_kU1","title8":"style__title8___2cLGW","mainbanner":"style__mainbanner___1YlSK","image":"style__image___mSywh"};

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

	    return _possibleConstructorReturn(this, (Block2.__proto__ || Object.getPrototypeOf(Block2)).apply(this, arguments));
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

	var _svg = __webpack_require__(18);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: [2, 600, 4] */

	var style = __webpack_require__(71);

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
	              'Teléfono:'
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

/***/ },
/* 71 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___365qk","vCenter":"style__vCenter___9LFiT","button1":"style__button1___QW0Tv","submit":"style__submit___2YBRa","button2":"style__button2___3fzL1","button2b":"style__button2b___2h89H","vCenterRel":"style__vCenterRel___27ebh","hCenter":"style__hCenter___3MSN5","inheritHeight":"style__inheritHeight___20X8j","hideOverflow":"style__hideOverflow___1e_Sa","icon-sprites":"style__icon-sprites___SBb6q","button3":"style__button3___1LtgP","button3v1":"style__button3v1___1Mvm_","button3v2":"style__button3v2___1N7QE","button3v3":"style__button3v3___11aHd","button3v4":"style__button3v4___2B0cK","button3v5":"style__button3v5___zgSlr","image1":"style__image1___20ULB","paragraph1":"style__paragraph1___1Iuas","paragraph1b":"style__paragraph1b___14XS7","paragraph2":"style__paragraph2___XLNUn","paragraph3":"style__paragraph3___cQhzG","paragraph4":"style__paragraph4___3o8-x","paragraph5":"style__paragraph5___-5J8a","sideSwipe":"style__sideSwipe___3Jh_M","bottomSwipe":"style__bottomSwipe___2N3qh","title1":"style__title1___2DL5-","title2":"style__title2___3etcM","title3":"style__title3___8tZ0C","title4":"style__title4___33kmt","title5":"style__title5___2k_sU","title6":"style__title6___1dv-o","title7":"style__title7___OUaen","title8":"style__title8___1LvKh","form":"style__form___1nnSk","formGroup":"style__formGroup___1VfYe"};

/***/ },
/* 72 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"fCenter":"style__fCenter___YPy8K","vCenter":"style__vCenter___32xVO","button1":"style__button1___1cwjy","button2":"style__button2___hQ_-V","button2b":"style__button2b___1b2RV","vCenterRel":"style__vCenterRel___29zgs","hCenter":"style__hCenter___2lorl","inheritHeight":"style__inheritHeight___VvRBI","hideOverflow":"style__hideOverflow___2GeSp","icon-sprites":"style__icon-sprites___3vhaB","button3":"style__button3___3HwaY","button3v1":"style__button3v1___2Wuut","button3v2":"style__button3v2___5XAeE","button3v3":"style__button3v3___bPEC9","button3v4":"style__button3v4___3dETf","button3v5":"style__button3v5___3o_q3","image1":"style__image1___2KQtF","paragraph1":"style__paragraph1___21zOk","paragraph1b":"style__paragraph1b___1kRb1","paragraph":"style__paragraph___29758","paragraph2":"style__paragraph2___1ISwm","paragraph_2":"style__paragraph_2___217YF","paragraph3":"style__paragraph3___34fOz","paragraph4":"style__paragraph4___1tgYT","paragraph5":"style__paragraph5___BDRxV","sideSwipe":"style__sideSwipe___1IOUP","bottomSwipe":"style__bottomSwipe___1Id40","title1":"style__title1___OAVsV","title2":"style__title2___3iVlU","title3":"style__title3___173Gl","title4":"style__title4___JohwZ","title5":"style__title5___3Apbg","title6":"style__title6___8Y1Ek","title":"style__title___31zi9","title_2":"style__title_2___3IHOj","title7":"style__title7___5Kp7I","title8":"style__title8___3uCuH","wrapper":"style__wrapper___2GZMu","sm":"style__sm___1spdw","svg":"style__svg___38pi8"};

/***/ }
/******/ ]);