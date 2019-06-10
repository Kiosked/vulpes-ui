import React, { PureComponent } from "react";
import PropTypes from "prop-types";
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

export default class Header extends PureComponent {
    static propTypes = {
        onClickHome: PropTypes.func.isRequired,
        onClickJobs: PropTypes.func.isRequired,
        onClickScheduling: PropTypes.func.isRequired
    };

    render() {
        return (
            <Container>
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>
                            <h3>Vulpes</h3>
                        </Navbar.Heading>
                        <Navbar.Divider />
                        <Button
                            className="bp3-minimal"
                            icon="home"
                            text="Dashboard"
                            onClick={this.props.onClickHome}
                        />
                        <Button
                            className="bp3-minimal"
                            icon="property"
                            text="Jobs"
                            onClick={this.props.onClickJobs}
                        />
                        <Button
                            className="bp3-minimal"
                            icon="timeline-events"
                            text="Scheduling"
                            onClick={this.props.onClickScheduling}
                        />
                        <Button
                            disabled={true}
                            className="bp3-minimal"
                            icon="align-left"
                            text="Log"
                        />
                        <Button
                            disabled={true}
                            className="bp3-minimal"
                            icon="console"
                            text="Terminal"
                        />
                        <Button
                            disabled={true}
                            className="bp3-minimal"
                            icon="cell-tower"
                            text="Hooks"
                        />
                        <Button
                            disabled={true}
                            className="bp3-minimal"
                            icon="settings"
                            text="System"
                        />
                    </Navbar.Group>
                </Navbar>
            </Container>
        );
    }
}
