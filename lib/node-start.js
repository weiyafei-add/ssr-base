"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _static = require("../build/static");

var getRouterConfig = function getRouterConfig(req) {
  var headers = req.headers,
      path = req.path,
      protocol = req.protocol,
      url = req.url,
      query = req.query;
  var host = headers.host; // 经过转发的协议 || protocol

  var proto = headers['x-forwarded-proto'] || protocol;
  var origin = proto + "://" + host;
  return {
    href: origin + url,
    path: path,
    origin: origin,
    query: query,
    type: query.type || 'page' // 可以作为script标签使用

  };
};

var getComponentProperty = function getComponentProperty(component, key) {
  if (!component) {
    return null;
  }

  if (component[key]) {
    return component[key];
  }

  if (component.WrappedComponent) {
    return component.WrappedComponent[key];
  }

  return null;
};

var getAssets = function getAssets(manifest, chunkName) {
  var publicPath = manifest.publicPath,
      namedChunkGroups = manifest.namedChunkGroups;
  var css = [];
  var scripts = [];
  namedChunkGroups[chunkName].assets.forEach(function (item) {
    var src = item.name;

    if (src.endsWith('.css')) {
      css.push(publicPath + src);
    } else if (/(?<!\.hot-update)\.js$/.test(src)) {
      scripts.push(publicPath + src);
    }
  });

  namedChunkGroups[_static.clientName].assets.forEach(function (item) {
    var src = item.name;

    if (src.endsWith('.css')) {
      css.unshift(publicPath + src);
    } else if (/(?<!\.hot-update)\.js$/.test(src)) {
      scripts.push(publicPath + src);
    }
  });

  return {
    css: css,
    scripts: scripts
  };
};

var PageComponent = function PageComponent(props) {
  var data = props.data,
      css = props.css,
      scripts = props.scripts,
      component = props.component,
      headContent = props.headContent;
  var _data$router$query$ro = data.router.query.rootId,
      rootId = _data$router$query$ro === void 0 ? 'root' : _data$router$query$ro;
  var Component = component;
  return /*#__PURE__*/_react.default.createElement("html", {
    lang: "en"
  }, /*#__PURE__*/_react.default.createElement("head", null, headContent, css.map(function (src) {
    return /*#__PURE__*/_react.default.createElement("link", {
      key: src,
      rel: "stylesheet",
      href: src
    });
  })), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/_react.default.createElement("div", {
    id: rootId
  }, /*#__PURE__*/_react.default.createElement(Component, data)), /*#__PURE__*/_react.default.createElement("script", {
    type: "text/javascript",
    dangerouslySetInnerHTML: {
      __html: "window.INITSTATE=".concat(JSON.stringify(data))
    }
  }), scripts.map(function (src) {
    return /*#__PURE__*/_react.default.createElement("script", {
      key: src,
      src: src
    });
  })));
};

var getJsCode = function getJsCode(_ref) {
  var data = _ref.data,
      css = _ref.css,
      scripts = _ref.scripts;
  return null;
};

function start(config) {
  var getRoute = function getRoute(path) {
    var _config$publicPath = config.publicPath,
        publicPath = _config$publicPath === void 0 ? '' : _config$publicPath,
        routes = config.routes;
    return routes.find(function (item) {
      return path === publicPath + item.path;
    });
  };

  var getHeadContent = function getHeadContent(req, component) {
    var commHead = config.headContent;
    var headContent = getComponentProperty(component, 'headContent');
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, typeof commHead === 'function' ? commHead(req) : commHead || null, typeof headContent === 'function' ? headContent(req) : headContent || null);
  };

  var publicPath = config.publicPath,
      createRequest = config.createRequest,
      errorInterceptor = config.errorInterceptor;
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res, next, manifest) {
      var route, routerConfig, _yield$route$getCompo, component, __webpack_chunkname_, data, getInitialData, _getAssets, css, scripts, htmlString;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(publicPath && !new RegExp('^' + publicPath + '(/|&)').test(req.path))) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", next());

            case 2:
              // 业务端路由描述
              route = getRoute(req.path);

              if (route) {
                _context.next = 7;
                break;
              }

              if (!(typeof errorInterceptor === 'function')) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", errorInterceptor({
                status: 404
              }, req, res, next));

            case 6:
              return _context.abrupt("return", next({
                status: 404
              }));

            case 7:
              // 获取路由配置信息
              routerConfig = getRouterConfig(req);
              _context.prev = 8;
              _context.next = 11;
              return route.getComponent();

            case 11:
              _yield$route$getCompo = _context.sent;
              component = _yield$route$getCompo.default;
              __webpack_chunkname_ = _yield$route$getCompo.__webpack_chunkname_;
              data = {
                route: routerConfig
              };
              getInitialData = getComponentProperty(component, 'getInitialData');

              if (!(typeof getInitialData === 'function')) {
                _context.next = 32;
                break;
              }

              if (!(typeof createRequest === 'function')) {
                _context.next = 26;
                break;
              }

              _context.t0 = _extends2.default;
              _context.t1 = data;
              _context.next = 22;
              return getInitialData(createRequest(req), req, res);

            case 22:
              _context.t2 = _context.sent;
              (0, _context.t0)(_context.t1, _context.t2);
              _context.next = 32;
              break;

            case 26:
              _context.t3 = _extends2.default;
              _context.t4 = data;
              _context.next = 30;
              return getInitialData(req, res);

            case 30:
              _context.t5 = _context.sent;
              (0, _context.t3)(_context.t4, _context.t5);

            case 32:
              _getAssets = getAssets(manifest, __webpack_chunkname_), css = _getAssets.css, scripts = _getAssets.scripts;

              if (routerConfig.type === 'page') {
                htmlString = (0, _server.renderToString)( /*#__PURE__*/_react.default.createElement(PageComponent, {
                  data: data,
                  css: css,
                  scripts: scripts,
                  component: component,
                  headContent: getHeadContent(req, component)
                }));
                res.send("<!DOCTYPE html>" + htmlString);
              } else {
                res.send(getJsCode({
                  data: data,
                  css: css,
                  scripts: scripts
                }));
              }

              _context.next = 38;
              break;

            case 36:
              _context.prev = 36;
              _context.t6 = _context["catch"](8);

            case 38:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[8, 36]]);
    }));

    return function (_x, _x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
}