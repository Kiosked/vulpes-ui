import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
    Button,
    ButtonGroup,
    Card,
    // Classes,
    // ControlGroup,
    // Dialog,
    // EditableText,
    FormGroup,
    // Icon,
    // InputGroup,
    Intent
    // Switch
} from "@blueprintjs/core";
import brace from "brace";
import AceEditor from "react-ace";
import Layout from "./Layout.js";

import "brace/mode/json";
import "brace/theme/xcode";

const INITIAL_STATE = {
    importData: "{}"
};

const FormCard = styled(Card)`
    margin: 0px 16px 20px 16px;
`;
const Heading3 = styled.h3`
    margin-top: 0px;
`;

export default class ReportingPage extends Component {
    state = {
        ...INITIAL_STATE
    };

    get jsonValid() {
        try {
            JSON.parse(this.state.importData);
            return true;
        } catch (err) {
            return false;
        }
    }

    render() {
        return (
            <Layout>
                <h1>Batch Import</h1>
                <FormCard>
                    <Heading3>Import from batch template</Heading3>
                    <FormGroup label="Import template data (JSON)" labelFor="data">
                        <AceEditor
                            mode="json"
                            id="data"
                            theme="xcode"
                            height="500px"
                            width="100%"
                            onChange={data =>
                                this.setState({
                                    importData: data
                                })
                            }
                            value={this.state.importData}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            editorProps={{ $blockScrolling: Infinity }}
                        />
                    </FormGroup>
                    <a href="https://github.com/Kiosked/vulpes#templated-imports" target="_blank">
                        <i>Import template documentation</i>
                    </a>
                    <hr />
                    <ButtonGroup>
                        <Button
                            text="Dry run"
                            icon="eye-open"
                            disabled={!this.jsonValid}
                            // onClick={::this.buildReport}
                        />
                        <Button
                            text="Import template"
                            icon="upload"
                            intent={Intent.PRIMARY}
                            disabled={!this.jsonValid}
                            // onClick={::this.buildReport}
                        />
                    </ButtonGroup>
                </FormCard>
            </Layout>
        );
    }
}
