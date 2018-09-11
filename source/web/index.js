import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import HomePage from "./containers/HomePage.js";

import "./styles/vulpes.sass";
import "./styles/base.sass";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" exact component={HomePage} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
