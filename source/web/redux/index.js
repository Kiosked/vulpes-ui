import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import reducer from "../reducers/index.js";
import history from "./history.js";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxRouterMiddleware = routerMiddleware(history);

const store = createStore(reducer, composeEnhancer(applyMiddleware(thunk, reduxRouterMiddleware)));

export default store;
export const { dispatch, getState } = store;
