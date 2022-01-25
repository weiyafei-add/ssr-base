"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _default(config) {
  function getRoute(path) {
    var _config$publicPath = config.publicPath,
        publicPath = _config$publicPath === void 0 ? '' : _config$publicPath,
        routes = config.routes;
    return routes.find(function (item) {
      return path === publicPath + item.path;
    });
  }

  function render(_x, _x2) {
    return _render.apply(this, arguments);
  }

  function _render() {
    _render = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(data, renderMethod) {
      var _data$router, _data$router$query$ro, rootId, path, _getRoute, getComponent, _yield$getComponent, Component;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _data$router = data.router, _data$router$query$ro = _data$router.query.rootId, rootId = _data$router$query$ro === void 0 ? 'root' : _data$router$query$ro, path = _data$router.path;
              _getRoute = getRoute(path), getComponent = _getRoute.getComponent;
              _context.next = 4;
              return getComponent();

            case 4:
              _yield$getComponent = _context.sent;
              Component = _yield$getComponent.default;
              renderMethod( /*#__PURE__*/_react.default.createElement(Component, data), document.getElementById(rootId));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _render.apply(this, arguments);
  }

  var initState = window.INITSTATE;

  if (Array.isArray(initState)) {
    var renderGroup = function renderGroup() {
      while (initState.length) {
        var data = initState.shift();
        render(data, _reactDom.default.hydrate);
      }
    }; // ？？？


    initState.push = function () {
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
      }

      Array.prototype.push.apply(initState, arg);
      renderGroup();
    };

    renderGroup();
  } else {
    render(initState, _reactDom.default.hydrate);
  }
}