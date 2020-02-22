import React, { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Button, ButtonGroup, Card, FormGroup, Intent, Spinner, Tree } from "@blueprintjs/core";
import brace from "brace";
import AceEditor from "react-ace";
import Layout from "./Layout.js";
import { executeJobsTemplateDryRun, importJobsTemplate } from "../library/import.js";
import { notifyError, notifySuccess } from "../library/notifications.js";

import "brace/mode/json";
import "brace/theme/xcode";

const FormCard = styled(Card)`
    margin: 0px 16px 20px 16px;
`;
const Heading3 = styled.h3`
    margin-top: 0px;
`;
const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 480px;
`;

function treeToNodes(jobTree) {
    return jobTree.map(jobItem => ({
        id: jobItem.id,
        hasCaret: false,
        icon: "folder-open",
        label: jobItem.type,
        isExpanded: true,
        childNodes: (jobItem.children && treeToNodes(jobItem.children)) || []
    }));
}

export default function ImportBatchPage() {
    const [importData, setImportData] = useState("{}");
    const [jobTree, setJobTree] = useState(null);
    const [dryRunActive, setDryRunActive] = useState(false);
    const [importActive, setImportActive] = useState(false);
    const [imported, setImported] = useState(false);
    const jsonValid = useMemo(() => {
        try {
            JSON.parse(importData);
            return true;
        } catch (err) {
            return false;
        }
    }, [importData]);
    useEffect(() => {
        if (!dryRunActive) return;
        executeJobsTemplateDryRun(JSON.parse(importData))
            .then(jobTree => {
                notifySuccess("Dry run executed successfully");
                setJobTree(jobTree);
                setDryRunActive(false);
            })
            .catch(err => {
                console.error(err);
                notifyError(`Failed during dry run: ${err.message}`);
                setJobTree(null);
                setDryRunActive(false);
            });
    }, [dryRunActive]);
    useEffect(() => {
        if (!importActive) return;
        importJobsTemplate(JSON.parse(importData))
            .then(jobTree => {
                notifySuccess("Import executed successfully");
                setJobTree(jobTree);
                setImportActive(false);
                setImported(true);
            })
            .catch(err => {
                console.error(err);
                notifyError(`Failed during import: ${err.message}`);
                setJobTree(null);
                setImportActive(false);
            });
    }, [importActive]);
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
                        onChange={data => setImportData(data)}
                        value={importData}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        editorProps={{ $blockScrolling: Infinity }}
                        readOnly={dryRunActive || importActive || imported}
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
                        disabled={!jsonValid || dryRunActive || importActive || imported}
                        onClick={() => setDryRunActive(true)}
                    />
                    <Button
                        text="Import template"
                        icon="upload"
                        intent={Intent.PRIMARY}
                        disabled={!jsonValid || dryRunActive || importActive || imported}
                        onClick={() => setImportActive(true)}
                    />
                </ButtonGroup>
            </FormCard>
            <If condition={importActive || dryRunActive || jobTree !== null}>
                <FormCard>
                    <Heading3>Import results</Heading3>
                    <Choose>
                        <When condition={importActive || dryRunActive}>
                            <SpinnerContainer>
                                <Spinner />
                            </SpinnerContainer>
                        </When>
                        <Otherwise>
                            <Tree contents={treeToNodes(jobTree)} />
                        </Otherwise>
                    </Choose>
                </FormCard>
            </If>
        </Layout>
    );
}
