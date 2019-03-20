import React, { Component } from "react";
import styled from "styled-components";
import Header from "../containers/Header.js";
import LayoutErrorBoundary from "./LayoutErrorBoundary.js";

const Container = styled.div`
    width: 800px;
`;

export default ({ children = null }) => (
    <Container>
        <Header />
        <LayoutErrorBoundary>{children}</LayoutErrorBoundary>
    </Container>
);
