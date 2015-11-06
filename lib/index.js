'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = promiseMiddleware;

var _fluxStandardAction = require('flux-standard-action');

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function promiseMiddleware(_ref) {
  var dispatch = _ref.dispatch;

  return function (next) {
    return function (action) {
      if (!_fluxStandardAction.isFSA(action)) {
        return isPromise(action) ? action.then(dispatch) : next(action);
      }

      if (isPromise(action.payload)) {
        dispatch({
          type: action.type,
          begin: true
        });

        return action.payload.then(function (result) {
          return dispatch(_extends({}, action, { payload: result }));
        }, function (error) {
          return dispatch(_extends({}, action, { payload: error, error: true }));
        });
      }

      return next(action);
    };
  };
}

module.exports = exports['default'];