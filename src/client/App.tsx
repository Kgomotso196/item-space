import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";

type Item = { id: number; name: string };

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/items`)
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
    if (
      items.some(
        (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError("This item already exists");
      return;
    }

    setError("");

    const res = await fetch(`${API_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName }),
    });

    const item = await res.json();
    setItems((prev) =>
      [...prev, item].sort((a, b) => a.name.localeCompare(b.name))
    );
    setNewItem("");
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/api/items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const saveEdit = async (id: number) => {
    if (!editingName.trim()) return setError("Name cannot be empty");
    if (editingName.trim().length < 3)
      return setError("Please put at least 3 letters");
    if (
      items.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() === editingName.toLowerCase()
      )
    )
      return setError("This item already exists");

    const res = await fetch(`${API_URL}/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName.trim() }),
    });

    const updatedItem = await res.json();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );
    setEditingId(null);
    setEditingName("");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Item List</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <TextField
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item"
          fullWidth
          size="small"
        />
        <Button variant="contained" color="primary" onClick={addItem}>
          Add
        </Button>
        <TextField
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items"
          size="small"
          style={{ width: "150px" }}
        />
      </div>

      {error && (
        <div
          style={{ color: "red", fontStyle: "italic", marginBottom: "0.5rem" }}
        >
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p>Add some items to get started!</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        size="small"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(item.id);
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setEditingName("");
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => saveEdit(item.id)}
                        size="small"
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => startEditing(item)}
                          size="small"
                          style={{ marginRight: "0.5rem" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteItem(item.id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default App;
