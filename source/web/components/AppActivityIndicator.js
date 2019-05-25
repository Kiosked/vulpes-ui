import React from "react";
import styled from "styled-components";
import { Spinner } from "@blueprintjs/core";

const ActivityContainer = styled.div`
    position: fixed;
    top: 10px;
    right: 10px;
`;

export default props => (
    <ActivityContainer>
        <If condition={props.jobsQueryActive}>
            <Spinner size={Spinner.SIZE_SMALL} />
        </If>
    </ActivityContainer>
);
