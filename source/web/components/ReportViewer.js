import React, { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Classes, Spinner } from "@blueprintjs/core";
import classNames from "classnames";
import { push } from "react-router-redux";
import { dispatch } from "../redux/index.js";
import { fetchReportResults } from "../library/report.js";

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

export default function ReportViewer({ config }) {
    const { types, reportingProperties, tagFilter = "" } = config;
    const [results, setResults] = useState([]);
    const [reportComplete, setReportComplete] = useState(false);
    useEffect(() => {
        setResults([]);
        setReportComplete(false);
        fetchReportResults({ types, reportingProperties, tagFilter })
            .then(results => {
                setResults(results);
                setReportComplete(true);
            })
            .catch(err => {
                console.error(err);
                alert(`An error has occurred: ${err.message}`);
            });
    }, [types, reportingProperties]);
    const handleIDClick = (evt, jobID) => {
        event.preventDefault();
        dispatch(push(`/job/${jobID}`));
    };
    return (
        <Fragment>
            <Heading3>Report</Heading3>
            <Choose>
                <When condition={reportComplete}>
                    <table
                        className={classNames(
                            Classes.HTML_TABLE,
                            Classes.HTML_TABLE_BORDERED,
                            Classes.HTML_TABLE_STRIPED
                        )}
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each="result" of={results} index="resultIndex">
                                <For
                                    each="propertyResult"
                                    of={result.properties}
                                    index="propertyIndex"
                                >
                                    <tr key={`item-${resultIndex}-${propertyResult.key}`}>
                                        <With
                                            rowCount={result.properties.length}
                                            isDupeRow={propertyIndex > 0}
                                        >
                                            <If condition={!isDupeRow}>
                                                <td rowSpan={rowCount}>
                                                    <a
                                                        href="#"
                                                        onClick={evt =>
                                                            handleIDClick(evt, result.id)
                                                        }
                                                        title={result.id}
                                                    >
                                                        <code>
                                                            {result.id.slice(0, 16)}&hellip;
                                                        </code>
                                                    </a>
                                                </td>
                                                <td rowSpan={rowCount}>
                                                    <code>{result.type}</code>
                                                </td>
                                            </If>
                                            <td>
                                                <code>{propertyResult.key}</code>
                                            </td>
                                            <td>
                                                <code>{propertyResult.value}</code>
                                            </td>
                                        </With>
                                    </tr>
                                </For>
                            </For>
                        </tbody>
                    </table>
                </When>
                <Otherwise>
                    <SpinnerContainer>
                        <Spinner />
                    </SpinnerContainer>
                </Otherwise>
            </Choose>
        </Fragment>
    );
}
