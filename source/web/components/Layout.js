import React, { Component } from "react";
import styled from "styled-components";
import Header from "../containers/Header.js";

const Container = styled.div`
    width: 800px;
`;

export default ({ children }) => (
    <Container>
        <Header />
        {children}
    </Container>
);
