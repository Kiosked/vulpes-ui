import { JOB_RESULT_TYPE_SUCCESS, JOB_STATUS_PENDING, JOB_STATUS_STOPPED } from "vulpes/symbols";

const JOB_PROGRESS_CURRENT = "%progressCurrent";
const JOB_PROGRESS_MAX = "%progressMax";

export function getJobProgress(job) {
    const { status } = job;
    const { type: resultType, data: resultData = {} } = job.result;
    if (status === JOB_STATUS_PENDING) {
        return 0;
    } else if (status === JOB_STATUS_STOPPED) {
        return resultType === JOB_RESULT_TYPE_SUCCESS ? 1 : 0;
    }
    const progressCurrent = resultData[JOB_PROGRESS_CURRENT];
    const progressMax = resultData[JOB_PROGRESS_MAX];
    if (progressCurrent >= 0 && progressMax >= 0) {
        const progress = progressCurrent / progressMax;
        if (progress > 1) {
            return 1;
        }
        return !progress || progress < 0 ? 0 : progress;
    }
    return 0;
}
