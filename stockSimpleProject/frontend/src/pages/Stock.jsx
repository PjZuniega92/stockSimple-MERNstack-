import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Modal, Form } from "react-bootstrap";

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ productId: "", quantityAdded: "", supplier: "", location: "" });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchStocks();
    fetchProducts();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/stocks");
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data = await response.json();
      setStocks(Array.isArray(data) ? data : data.stocks || []);
    } catch (error) {
      console.error("Error fetching stocks:", error);
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
    if (!newItem.productId || !newItem.quantityAdded || !newItem.location) {
      console.error("Error: Missing required fields!");
      return;
    }
  
    try {
      if (editingItem) {
        console.log("Updating stock with ID:", editingItem._id, "Data:", newItem);
  
        const response = await fetch(`http://localhost:3000/api/stocks/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update stock.");
        }
  
        const updatedStock = await response.json();
        setStocks(stocks.map((item) => (item._id === editingItem._id ? updatedStock.stock : item)));
  
        console.log(`Stock ${editingItem._id} updated successfully`);
      } else {
        console.log("Adding new stock:", newItem);
  
        const response = await fetch("http://localhost:3000/api/stocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add stock.");
        }
  
        const addedStock = await response.json();
        setStocks([...stocks, addedStock]);
  
        console.log("Stock added successfully:", addedStock);
      }
  
      setShowModal(false);
      setEditingItem(null);
      setNewItem({ productId: "", quantityAdded: "", supplier: "", location: "" });
    } catch (error) {
      console.error("Error saving stock item:", error.message);
    }
  };
  
  

  const handleDelete = async (id) => {
    console.log("Deleting stock with ID:", id);

    if (!id) {
        console.error("Error: Stock ID is undefined!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/stocks/${id}`, { method: "DELETE" });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message || "Failed to delete stock.");
        }

        setStocks(stocks.filter((item) => item._id !== id));
        console.log(`Stock ${id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting stock item:", error.message);
    }
};

  

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Stock List - Recent Stock Additions</h2>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Add Stock
      </Button>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : stocks.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Added</th>
              <th>Supplier</th>
              <th>Location</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((item) => (
              <tr key={item._id || Math.random().toString(36)}>
                <td>{item.productName || "Unknown Product"}</td>
                <td>{parseFloat(item.quantityAdded) || 0}</td>
                <td>{item.supplier || "N/A"}</td>
                <td>{item.location}</td>
                <td>
                  {item.dateAdded
                    ? new Date(item.dateAdded).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "No Date Available"}
                </td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                      setEditingItem(item);
                      setNewItem({
                        productId: item.productId?._id || item.productId,
                        quantityAdded: item.quantityAdded,
                        supplier: item.supplier,
                        location: item.location,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => {
                      console.log("Deleting stock:", item);  
                      handleDelete(item._id);
                  }}>
                      Delete
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No stock items available</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Stock Item" : "Add Stock Item"}</Modal.Title>
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
              <Form.Label>Quantity Added</Form.Label>
              <Form.Control
                type="number"
                value={newItem.quantityAdded}
                onChange={(e) => setNewItem({ ...newItem, quantityAdded: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Control
                type="text"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
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

export default Stock;
