import { useState } from "react";
import { runSQL, runNoSQL } from "../api";
import "./QueryEditor.css";

export default function QueryEditor({ type: defaultType = "sql" }) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState(defaultType);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleRun = async () => {
        if (!query.trim()) return alert("Please enter a query!");
        setLoading(true);
        try {
            const res =
                type === "sql"
                    ? await runSQL(query)
                    : await runNoSQL("find", JSON.parse(query || "{}"));
            setResults(res.data);
        } catch (err) {
            alert(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = () => {
        if (!Array.isArray(results) || results.length === 0)
            return <p className="no-data">No results found</p>;

        const columns = Object.keys(results[0]);

        return (
            <table className="results-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {results.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                                <td key={col}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="query-editor">
            <div className="editor-header">
                <h2>Query Runner</h2>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="query-type"
                >
                    <option value="sql">SQL</option>
                    <option value="nosql">NoSQL</option>
                </select>
            </div>

            <textarea
                className="query-box"
                rows={6}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                    type === "sql"
                        ? "SELECT * FROM Customers;"
                        : `{
  "collection": "users",
  "filter": { "name": "Deepak" }
}`
                }
            />

            <button
                onClick={handleRun}
                disabled={loading}
                className={`run-btn ${loading ? "loading" : ""}`}
            >
                {loading ? "Running..." : "Run Query"}
            </button>

            <div className="results-container">
                <h3>Results</h3>
                {renderTable()}
            </div>
        </div>
    );
}
