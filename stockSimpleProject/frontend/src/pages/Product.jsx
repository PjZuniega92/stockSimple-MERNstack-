import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Form, Modal } from "react-bootstrap";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    price: "", 
    category: "", 
    brand: "",
    material: "",
    size: "",
    description: "" 
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSave = async () => {
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct 
      ? `http://localhost:3000/api/products/${editingProduct._id}` 
      : "http://localhost:3000/api/products";
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
  
      if (!response.ok) throw new Error("Failed to save product");
      const savedProduct = await response.json();
  
      if (editingProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p._id === savedProduct._id ? savedProduct : p))
        );
      } else {
        setProducts((prevProducts) => [...prevProducts, savedProduct]);
      }
  
      setShowModal(false);
      setEditingProduct(null);
      setNewProduct({ name: "", price: "", category: "", brand: "", material: "", size: "", description: "" });
  
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Product List</h2>
      <Button className="mb-3" onClick={() => setShowModal(true)}>Add Product</Button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : products.length > 0 ? (
        <Row>
          {products.map((product) => (
            <Col key={product._id} md={4} sm={6} xs={12} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> ${product.price} <br />
                    <strong>Category:</strong> {product.category} <br />
                    <strong>Brand:</strong> {product.brand || "N/A"} <br />
                    <strong>Material:</strong> {product.material || "N/A"} <br />
                    <strong>Size:</strong> {product.size || "N/A"} <br />
                    {product.description}
                  </Card.Text>
                  <Button variant="warning" className="me-2" onClick={() => {
                    setEditingProduct(product);
                    setNewProduct(product);
                    setShowModal(true);
                  }}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(product._id)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No products available</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control type="text" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Material</Form.Label>
              <Form.Control type="text" value={newProduct.material} onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Control type="text" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Product;
