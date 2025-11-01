import { useState } from "react";
import Header from "./components/Header";
// import Footer from "./components/Footer";
import SQLDashboard from "./components/SQLDashboard";
// import QueryEditor from "./components/QueryEditor";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("sql");

  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="app-content">
        <SQLDashboard type={activeTab} />
        {/* <QueryEditor type={activeTab} /> */}
      </main>

      {/* <Footer /> */}
    </div>
  );
}
