import { isFSA } from 'flux-standard-action';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    if (isPromise(action.payload)) {
      dispatch({
        type: action.type,
        begin: true
      });

      return action.payload.then(
        result => dispatch({ ...action, payload: result }),
        error => dispatch({ ...action, payload: error, error: true })
      );
    }

    return next(action);
  };
}
