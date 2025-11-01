import React from "react";
import "./Header.css";

export default function Header({ activeTab, setActiveTab }) {
    return (
        <header className="app-header">
            <h1>Database Dashboard</h1>
            <nav>
                <button
                    className={activeTab === "sql" ? "active" : ""}
                    onClick={() => setActiveTab("sql")}
                >
                    SQL
                </button>
                <button
                    className={activeTab === "nosql" ? "active" : ""}
                    onClick={() => setActiveTab("nosql")}
                >
                    NoSQL
                </button>
            </nav>
        </header>
    );
}
