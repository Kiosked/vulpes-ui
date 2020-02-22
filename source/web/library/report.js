import axios from "axios";
import joinURL from "url-join";

const API_BASE = window.vulpesAPIBase;

export function fetchReportResults(config) {
    const { onlySucceeded = true, types, reportingProperties, tagFilter } = config;
    return axios
        .post(joinURL(API_BASE, "/report/on-the-fly"), {
            onlySucceeded,
            types,
            reportingProperties,
            tagFilter
        })
        .then(response => response.data.results)
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}
