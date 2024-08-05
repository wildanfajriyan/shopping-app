import { combineReducers } from 'redux';
import { userReducer } from './user';
import { countReducer } from './counter';

export const reducers = combineReducers({
  user: userReducer,
  counter: countReducer,
});
