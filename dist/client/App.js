import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, } from "@mui/material";
function App() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [filter, setFilter] = useState("");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    useEffect(() => {
        fetch("http://localhost:3000/api/items")
            .then((res) => res.json())
            .then((data) => setItems(data));
    }, []);
    const addItem = async () => {
        const trimmedName = newItem.trim();
        if (!trimmedName) {
            setError("Please enter a name");
            return;
        }
        if (trimmedName.length < 3) {
            setError("Please put at least 3 letters");
            return;
        }
        if (items.some((item) => item.name.toLowerCase() === trimmedName.toLowerCase())) {
            setError("This item already exists");
            return;
        }
        setError("");
        const res = await fetch("http://localhost:3000/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: trimmedName }),
        });
        const item = await res.json();
        setItems((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));
        setNewItem("");
    };
    const deleteItem = async (id) => {
        await fetch(`http://localhost:3000/api/items/${id}`, { method: "DELETE" });
        setItems((prev) => prev.filter((item) => item.id !== id));
    };
    const startEditing = (item) => {
        setEditingId(item.id);
        setEditingName(item.name);
    };
    const saveEdit = async (id) => {
        if (!editingName.trim())
            return setError("Name cannot be empty");
        if (editingName.trim().length < 3)
            return setError("Please put at least 3 letters");
        if (items.some((item) => item.id !== id &&
            item.name.toLowerCase() === editingName.toLowerCase()))
            return setError("This item already exists");
        const res = await fetch(`http://localhost:3000/api/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editingName.trim() }),
        });
        const updatedItem = await res.json();
        setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
        setEditingId(null);
        setEditingName("");
    };
    const filteredItems = items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));
    useEffect(() => {
        if (!error)
            return;
        const timer = setTimeout(() => {
            setError("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [error]);
    return (_jsxs("div", { style: { padding: "2rem", maxWidth: "600px", margin: "0 auto" }, children: [_jsx("h1", { children: "Item List" }), _jsxs("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }, children: [_jsx(TextField, { value: newItem, onChange: (e) => setNewItem(e.target.value), placeholder: "Add item", fullWidth: true, size: "small" }), _jsx(Button, { variant: "contained", color: "primary", onClick: addItem, children: "Add" }), _jsx(TextField, { value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Filter items", size: "small", style: { width: "150px" } })] }), error && (_jsx("div", { style: { color: "red", fontStyle: "italic", marginBottom: "0.5rem" }, children: error })), items.length === 0 ? (_jsx("p", { children: "Add some items to get started!" })) : (_jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, {}), _jsx(TableCell, { children: _jsx("b", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("b", { children: "Actions" }) })] }) }), _jsx(TableBody, { children: filteredItems.map((item, index) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { children: [index + 1, "."] }), _jsx(TableCell, { children: editingId === item.id ? (_jsx(TextField, { value: editingName, onChange: (e) => setEditingName(e.target.value), size: "small", onKeyDown: (e) => {
                                                if (e.key === "Enter")
                                                    saveEdit(item.id);
                                                if (e.key === "Escape") {
                                                    setEditingId(null);
                                                    setEditingName("");
                                                }
                                            }, autoFocus: true })) : (item.name) }), _jsx(TableCell, { children: editingId === item.id ? (_jsx(Button, { variant: "contained", color: "success", onClick: () => saveEdit(item.id), size: "small", children: "Save" })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: "primary", onClick: () => startEditing(item), size: "small", style: { marginRight: "0.5rem" }, children: "Edit" }), _jsx(Button, { variant: "contained", color: "error", onClick: () => deleteItem(item.id), size: "small", children: "Delete" })] })) })] }, item.id))) })] }) }))] }));
}
export default App;
