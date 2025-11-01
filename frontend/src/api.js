import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/query", // backend base URL
});

// SQL query endpoint
export const runSQL = (query) => API.post("/sql", { query });

// NoSQL operation endpoint
export const runNoSQL = (operation, data) => API.post("/nosql", { operation, data });


// ✅ NEW: Get list of all SQL tables
export const getSQLTables = () => API.get("/sql/tables");

// ✅ NEW: Get list of all NoSQL collections
export const getNoSQLCollections = () => API.get("/nosql/collections");
