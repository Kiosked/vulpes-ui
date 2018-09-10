import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

export default ({ children }) => (
    <Container>
        {children}
    </Container>
);
