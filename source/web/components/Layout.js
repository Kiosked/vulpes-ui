import React, { Component } from "react";
import styled from "styled-components";
import Header from "../containers/Header.js";
import LayoutErrorBoundary from "./LayoutErrorBoundary.js";
import AppActivityIndicator from "../containers/AppActivityIndicator.js";

const Container = styled.div`
    width: 800px;
    padding-bottom: 30px;
`;

export default ({ children = null }) => (
    <Container>
        <Header />
        <AppActivityIndicator />
        <LayoutErrorBoundary>{children}</LayoutErrorBoundary>
    </Container>
);
