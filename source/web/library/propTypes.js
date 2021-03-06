import PropTypes from "prop-types";

export const JobResultShape = PropTypes.shape({
    data: PropTypes.object,
    type: PropTypes.string
});
export const JobShape = PropTypes.shape({
    "@@type": PropTypes.oneOf(["vulpes/job"]),
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    result: JobResultShape.isRequired,
    parents: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    priority: PropTypes.number.isRequired
});
export const JobShapeNew = PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    result: JobResultShape,
    parents: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.object,
    priority: PropTypes.number
});
export const JobStatShape = PropTypes.shape({
    totalJobs: PropTypes.number,
    stoppedJobs: PropTypes.number,
    runningJobs: PropTypes.number,
    pendingJobs: PropTypes.number,
    succeededJobs: PropTypes.number,
    failedJobs: PropTypes.number,
    jobsInLastHour: PropTypes.number
});
export const ScheduledTaskShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    schedule: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    jobs: PropTypes.arrayOf(JobShapeNew).isRequired
});
export const WorkerShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    updated: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
});
