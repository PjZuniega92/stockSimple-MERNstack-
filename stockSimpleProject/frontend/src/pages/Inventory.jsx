import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Modal, Form } from "react-bootstrap";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ productId: "", quantity: "", location: "" });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/inventory");
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSave = async () => {
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem
      ? `http://localhost:3000/api/inventory/${editingItem._id}`
      : "http://localhost:3000/api/inventory";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error("Failed to save inventory item");

      await response.json();
      fetchInventory();
      setShowModal(false);
      setEditingItem(null);
      setNewItem({ productId: "", quantity: "", location: "" });
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/inventory/${id}`, { method: "DELETE" });
      setInventory(inventory.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Inventory List - Current Stock at Locations</h2>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Add Item
      </Button>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : inventory.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td>{item.productId?.name || "Unknown Product"}</td>
                <td>{item.quantity}</td>
                <td>{item.location}</td>
                <td>
                  {new Date(item.lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                      setEditingItem(item);
                      setNewItem({ productId: item.productId._id, quantity: item.quantity, location: item.location });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No inventory items available</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Inventory Item" : "Add Inventory Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select
                value={newItem.productId}
                onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Inventory;