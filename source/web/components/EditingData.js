import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import brace from "brace";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/xcode";

export default class EditingData extends Component {
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
        this.props.saveData(this.props.dataStr, JSON.parse(this.state.data), this.props.id);
    }

    render() {
        return (
            <div>
                <AceEditor
                    mode="json"
                    theme="xcode"
                    height="200px"
                    onChange={this.setJobData.bind(this)}
                    value={this.state.data}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    editorProps={{ $blockScrolling: Infinity }}
                />
                <Button
                    icon="key-enter"
                    text="Save"
                    onClick={this.saveData.bind(this)}
                    disabled={this.state.saveDisabled}
                />
            </div>
        );
    }
}
