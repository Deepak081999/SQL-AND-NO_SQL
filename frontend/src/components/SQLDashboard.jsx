import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./SQLDashboard.css";

export default function SQLDashboard() {
    const [tables] = useState(["Customers", "Orders", "Shippings"]);
    const [tableData, setTableData] = useState({});
    const [query, setQuery] = useState("");
    const [output, setOutput] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Wrap in useCallback to avoid missing dependency warning
    const loadTables = useCallback(async () => {
        try {
            const data = {};
            for (const table of tables) {
                const res = await axios.get(
                    `http://localhost:5000/api/query/sql/table/${table}`
                );
                data[table] = res.data;
            }
            setTableData(data);
        } catch (err) {
            console.error("Error loading tables:", err);
        }
    }, [tables]);

    // ✅ Safe effect with dependency
    useEffect(() => {
        loadTables();
    }, [loadTables]);

    const runQuery = async () => {
        if (!query.trim()) return alert("Please enter a SQL query!");
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/query/sql", {
                query,
            });
            setOutput(res.data);
        } catch (err) {
            alert(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(query);
        alert("Query copied to clipboard!");
    };

    const copyQuery = (text) => {
        navigator.clipboard.writeText(text);
        alert("✅ Query copied!");
    };
    const commonQueries = [
        { title: "Show all customers", query: "SELECT * FROM Customers;" },
        { title: "Show all orders", query: "SELECT * FROM Orders;" },
        { title: "Show all shippings", query: "SELECT * FROM Shippings;" },
        {
            title: "Join Customers with Orders",
            query: `SELECT Customers.first_name, Customers.last_name, Orders.item, Orders.amount
FROM Customers
JOIN Orders ON Customers.customer_id = Orders.customer_id;`,
        },
        {
            title: "Join Customers with Shippings",
            query: `SELECT Customers.first_name, Customers.last_name, Shippings.status
FROM Customers
JOIN Shippings ON Customers.customer_id = Shippings.customer;`,
        },
        {
            title: "Join all three tables",
            query: `SELECT Customers.first_name, Customers.last_name, Orders.item, Orders.amount, Shippings.status
FROM Customers
JOIN Orders ON Customers.customer_id = Orders.customer_id
JOIN Shippings ON Customers.customer_id = Shippings.customer;`,
        },
        {
            title: "Count orders per customer",
            query: `SELECT Customers.first_name, COUNT(Orders.order_id) AS total_orders
FROM Customers
JOIN Orders ON Customers.customer_id = Orders.customer_id
GROUP BY Customers.first_name;`,
        },
        {
            title: "Customers with no orders",
            query: `SELECT *
FROM Customers
LEFT JOIN Orders ON Customers.customer_id = Orders.customer_id
WHERE Orders.order_id IS NULL;`,
        },
        {
            title: "Total amount spent by customer",
            query: `SELECT Customers.first_name, SUM(Orders.amount) AS total_spent
FROM Customers
JOIN Orders ON Customers.customer_id = Orders.customer_id
GROUP BY Customers.first_name;`,
        },
        {
            title: "Delivered orders",
            query: `SELECT Orders.item, Orders.amount, Shippings.status
FROM Orders
JOIN Shippings ON Orders.customer_id = Shippings.customer
WHERE Shippings.status = 'Delivered';`,
        },
    ];

    return (
        <div className="sql-dashboard">
            {/* Row with 3 Columns */}
            <div className="row">
                {/* LEFT PANEL */}
                <div className="col left-panel">
                    <h3>📂 Tables</h3>
                    {tables.map((t) => (
                        <div key={t} className="table-section">
                            <h4>{t}</h4>
                            {tableData[t]?.length > 0 && (
                                <ul>
                                    {Object.keys(tableData[t][0]).map((col) => (
                                        <li key={col}>{col}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* MIDDLE PANEL */}
                <div className="col middle-panel">
                    <h3>🧠 SQL Query Editor</h3>
                    <textarea
                        rows="10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Write your SQL query here..."
                    />
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button onClick={runQuery} disabled={loading}>
                            {loading ? "Running..." : "Run SQL"}
                        </button>
                        <button onClick={copyToClipboard}>📋 Copy Query</button>
                    </div>

                    {/* OUTPUT SECTION */}
                    <div className="output-section">
                        <h3>Output</h3>
                        {output.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(output[0]).map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {output.map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).map((val, j) => (
                                                <td key={j}>{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No results yet.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col right-panel">
                    <h3>📊 Available Tables</h3>
                    {tables.map((t) => (
                        <div key={t} className="preview-table">
                            <h4>{t}</h4>
                            {tableData[t]?.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            {Object.keys(tableData[t][0]).map((col) => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData[t].slice(0, 5).map((row, i) => (
                                            <tr key={i}>
                                                {Object.values(row).map((v, j) => (
                                                    <td key={j}>{v}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No data</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* ✅ COMMON QUERY SECTION */}
            <div className="common-queries">
                <h3>📘 Common & Useful SQL Queries</h3>
                {commonQueries.map((q, i) => (
                    <div key={i} className="query-block">
                        <div className="query-header">
                            <strong>{q.title}</strong>
                            <button onClick={() => copyQuery(q.query)}>Copy</button>
                        </div>
                        <pre>{q.query}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
}
