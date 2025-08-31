import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart } from "react-icons/fa";

export default function App() {
  const api = axios.create({
    baseURL: "https://grocery-be-tpf9.onrender.com/api",
    headers: { "Content-Type": "application/json" }
  });

  const [groceries, setGroceries] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", price: "", description: "", quantity: "" });
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

  const fetchGroceries = async () => {
    const res = await api.get("/getdata");
    setGroceries(res.data.result);
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await api.put(`/update/${form.id}`, form);
      setEditMode(false);
    } else {
      const newId = Date.now();
      await api.post("/postdata", { ...form, id: newId });
    }
    setForm({ id: "", name: "", price: "", description: "", quantity: "" });
    fetchGroceries();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/delete/${id}`);
    fetchGroceries();
  };

  const filteredGroceries = groceries.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#2c3e50" }}>
        <FaShoppingCart className="me-2" /> Grocery Manager
      </h2>

      {/* Form Card */}
      <div className="card shadow-lg p-4 mb-4 border-0" style={{ borderRadius: "15px" }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-2">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-3 d-grid">
              <button
                type="submit"
                className={`btn ${editMode ? "btn-warning" : "btn-primary"} fw-bold`}
                style={{ transition: "0.3s" }}
              >
                {editMode ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroceries.length > 0 ? (
              filteredGroceries.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(item)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
