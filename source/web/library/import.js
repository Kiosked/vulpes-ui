import axios from "axios";
import joinURL from "url-join";

const API_BASE = window.vulpesAPIBase;

export function executeJobsTemplateDryRun(template) {
    return axios
        .post(joinURL(API_BASE, "/import/batch/dry"), {
            template
        })
        .then(response => response.data.jobs)
        .then(jobs => jobsArrayToTree(jobs))
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function importJobsTemplate(template) {
    return axios
        .post(joinURL(API_BASE, "/import/batch"), {
            template
        })
        .then(response => {
            const { jobs, tag } = response.data;
            return {
                tree: jobsArrayToTree(jobs),
                tag
            };
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

function jobsArrayToTree(jobs, parentID = null) {
    return jobs.reduce((output, nextJob) => {
        if (parentID === null && nextJob.parents && nextJob.parents.length > 0) return output;
        if (parentID !== null && (!nextJob.parents || nextJob.parents.indexOf(parentID) === -1))
            return output;
        output.push(
            Object.assign({}, nextJob, {
                children: jobsArrayToTree(jobs, nextJob.id)
            })
        );
        return output;
    }, []);
}
