import React, { Component } from "react";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "../redux/index.js";
import history from "../redux/history.js";
import HomePage from "../containers/HomePage.js";
import Joblist from "../containers/JobList";
import JobPage from "../containers/JobPage";
import JobTree from "../containers/JobTree";
import JobCreationPage from "../containers/JobCreationPage";
import "../styles/vulpes.sass";
import "../styles/base.sass";
import { hot } from "react-hot-loader";

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/jobs" exact component={Joblist} />
                        <Route path="/job/:jobId" exact component={JobPage} />
                        <Route path="/job/tree/:jobId" exact component={JobTree} />
                        <Route path="/new" exact component={JobCreationPage} />
                        <Route path="/new/parents/:parentId" exact component={JobCreationPage} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default hot(module)(App);
