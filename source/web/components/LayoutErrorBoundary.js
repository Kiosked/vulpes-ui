import React, { Component } from "react";
import styled from "styled-components";
import { Callout } from "@blueprintjs/core";

// const ErrorContainer = styled.div`
//     width: 100%;
//     margin: 10px 0;
//     background-color:
// `;

export default class LayoutErrorBoundary extends Component {
    state = {
        caughtError: null
    };

    static getDerivedStateFromError(err) {
        return {
            caughtError: err.message
        };
    }

    componentDidCatch(err, info) {
        console.error("Caught error at layout boundary", err);
    }

    render() {
        if (this.state.caughtError) {
            return (
                <Callout icon="cross" intent="danger" title="An Error Has Occurred">
                    <h3>{this.state.caughtError}</h3>
                </Callout>
            );
        }
        return this.props.children;
    }
}
