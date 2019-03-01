import React, { Component } from "react";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import { hot } from "react-hot-loader";
import store from "../redux/index.js";
import history from "../redux/history.js";
import HomePage from "../containers/HomePage.js";
import JobListPage from "../containers/JobListPage.js";
import JobPage from "../containers/JobPage.js";
import JobTreePage from "../containers/JobTreePage.js";
import JobCreationPage from "../containers/JobCreationPage.js";
import "../styles/vulpes.sass";
import "../styles/base.sass";

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/jobs" exact component={JobListPage} />
                        <Route path="/job/:jobId" exact component={JobPage} />
                        <Route path="/job/tree/:jobId" exact component={JobTreePage} />
                        <Route path="/new" exact component={JobCreationPage} />
                        <Route path="/new/parents/:parentId" exact component={JobCreationPage} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default hot(module)(App);
