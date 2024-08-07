import { combineReducers } from 'redux';
import { legacy_createStore } from 'redux';
import { userReducer } from './user';
import { cartReducer } from './cart';

export const reducers = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

export const globalStore = legacy_createStore(reducers);
