import React, { Component } from "react";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "../redux/index.js";
import history from "../redux/history.js";
import HomePage from "../containers/HomePage.js";
import JobListPage from "../containers/JobListPage.js";
import JobPage from "../containers/JobPage.js";
import JobCreationPage from "../containers/JobCreationPage.js";
import SchedulingPage from "../containers/SchedulingPage.js";
import EditScheduledTaskPage from "../containers/EditScheduledTaskPage.js";
import ScheduledTaskPage from "../containers/ScheduledTaskPage.js";
import ReportingPage from "../containers/ReportingPage.js";
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
                        <Route path="/job/:jobId" component={JobPage} />
                        <Route path="/new-job" exact component={JobCreationPage} />
                        <Route
                            path="/new-job/parents/:parentID"
                            exact
                            component={JobCreationPage}
                        />
                        <Route path="/scheduling" exact component={SchedulingPage} />
                        <Route
                            path="/scheduling/new"
                            render={props => <EditScheduledTaskPage {...props} mode="create" />}
                        />
                        <Route
                            path="/scheduling/edit/:id"
                            render={props => <EditScheduledTaskPage {...props} mode="edit" />}
                        />
                        <Route path="/scheduling/task/:id" component={ScheduledTaskPage} />
                        <Route path="/reporting" component={ReportingPage} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
