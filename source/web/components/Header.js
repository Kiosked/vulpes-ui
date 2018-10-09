import React, { Component } from "react";
import styled from "styled-components";
import { Alignment, Button, Navbar } from "@blueprintjs/core";

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 10px;
    margin-bottom: 20px;
`;

export default () => (
    <Container>
        <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <h3>Vulpes</h3>
                </Navbar.Heading>
                <Navbar.Divider />
                <a href="/#">
                    <Button className="bp3-minimal" icon="home" text="Dashboard" />
                </a>
                <a href="/#jobs">
                    <Button className="bp3-minimal" icon="numbered-list" text="Jobs" />
                </a>
                <Button disabled={true} className="bp3-minimal" icon="align-left" text="Log" />
                <Button disabled={true} className="bp3-minimal" icon="console" text="Terminal" />
                <Button disabled={true} className="bp3-minimal" icon="cell-tower" text="Hooks" />
                <Button disabled={true} className="bp3-minimal" icon="settings" text="System" />
            </Navbar.Group>
        </Navbar>
    </Container>
);
