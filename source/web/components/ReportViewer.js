import React, { useState, useEffect } from "react";

export default function ReportViewer({ config }) {
    const { types, reportingProperties } = config;
    const [results, setResults] = useState([]);
    const [reportComplete, setReportComplete] = useState(false);
    useEffect(() => {}, [types, reportingProperties]);
}
