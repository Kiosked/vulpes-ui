import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import store from "./redux/index.js";
import { subscribeToNavChanges } from "./redux/navigation.js";
import { watchJobsQueues } from "./library/jobFetching.js";

ReactDOM.render(<App />, document.getElementById("root"));

watchJobsQueues();
subscribeToNavChanges(store);
