import PropTypes from "prop-types";

export const JobResultShape = PropTypes.shape({
    data: PropTypes.object.isRequired,
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
