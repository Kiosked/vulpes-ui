import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { watchJobsQueues } from "./library/jobFetching.js";

ReactDOM.render(<App />, document.getElementById("root"));

watchJobsQueues();
