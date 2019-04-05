import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import brace from "brace";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/xcode";

const OffsetButtonGroup = styled(ButtonGroup)`
    margin-top: 6px;
`;

export default class EditingData extends Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onSaveData: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            data: JSON.stringify(this.props.data, null, 2),
            saveDisabled: false
        };
    }

    setJobData(data) {
        if (this.isValidJson(data)) {
            this.setState({ data: data, saveDisabled: false });
        } else {
            this.setState({ data: data, saveDisabled: true });
        }
    }

    isValidJson(data) {
        try {
            JSON.parse(data);
        } catch (e) {
            return false;
        }
        return true;
    }

    saveData() {
        this.props.onSaveData(this.props.dataStr, JSON.parse(this.state.data), this.props.id);
    }

    render() {
        return (
            <div>
                <AceEditor
                    mode="json"
                    theme="xcode"
                    height="200px"
                    onChange={::this.setJobData}
                    value={this.state.data}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    editorProps={{ $blockScrolling: Infinity }}
                />
                <OffsetButtonGroup>
                    <Button
                        icon="document-share"
                        text="Save"
                        onClick={::this.saveData}
                        disabled={this.state.saveDisabled}
                        intent={Intent.PRIMARY}
                    />
                    <Button icon="undo" text="Cancel" onClick={::this.props.onCancel} />
                </OffsetButtonGroup>
            </div>
        );
    }
}
