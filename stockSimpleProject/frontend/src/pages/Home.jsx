import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStocks: 0,
    totalInventory: 0,
    totalUsers: 0,
    products: [],
    stocks: [],
    inventory: [],
    users: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard");
        const data = await response.json();
  
        if (data.stocks && Array.isArray(data.stocks)) {
          data.stocks.sort((a, b) => b.totalQuantity - a.totalQuantity);
        }
        if (data.inventory && Array.isArray(data.inventory)) {
          data.inventory.sort((a, b) => b.totalQuantity - a.totalQuantity);
        }
  
        console.log("Dashboard Data:", data);
        setStats({ ...data });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  


  const renderTableWithFixedRows = (data, columns, totalRows = 5) => {
    const rows = [...data];

    while (rows.length < totalRows) {
      rows.push({ _id: `empty-${rows.length}`, isEmpty: true });
    }

    return (
      <div className="table-responsive">
        <Table striped bordered hover className="table-fixed">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row._id || rowIndex} className={row.isEmpty ? "empty-row" : ""}>
                {columns.map((col, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`}>
                  {row.isEmpty ? "" : row[col.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={6} sm={12}>
          <Card className="card-fixed shadow-sm">
            <Card.Body className="card-body-fixed">
              <Card.Title>Total Products</Card.Title>
              <Card.Text>{stats.totalProducts}</Card.Text>
              {renderTableWithFixedRows(stats.products, [
                { label: "Product Name", field: "name" },
              ])}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} sm={12}>
          <Card className="card-fixed shadow-sm">
            <Card.Body className="card-body-fixed">
              <Card.Title>Total Stocks</Card.Title>
              <Card.Text>{stats.totalStocks}</Card.Text>
              {renderTableWithFixedRows(stats.stocks, [
  { label: "Product Name", field: "name" },
  { label: "Quantity", field: "totalQuantity" },
  { label: "Supplier", field: "supplier" },
  { label: "Location", field: "location" },
  { label: "Date Added", field: "dateAdded" },
])}

            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} sm={12}>
          <Card className="card-fixed shadow-sm">
            <Card.Body className="card-body-fixed">
              <Card.Title>Total Inventory</Card.Title>
              <Card.Text>{stats.totalInventory}</Card.Text>
              {renderTableWithFixedRows(stats.inventory, [
                { label: "Product Name", field: "name" },
                { label: "Quantity", field: "totalQuantity" },
              ])}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} sm={12}>
          <Card className="card-fixed shadow-sm">
            <Card.Body className="card-body-fixed">
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats.totalUsers}</Card.Text>
              {renderTableWithFixedRows(stats.users, [
                { label: "Username", field: "username" },
              ])}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4} sm={12} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Products</Card.Title>
              <Button variant="primary" onClick={() => navigate("/products")}>
                Go to Products
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Stocks</Card.Title>
              <Button variant="warning" onClick={() => navigate("/stocks")}>
                Go to Stocks
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Inventory</Card.Title>
              <Button variant="success" onClick={() => navigate("/inventory")}>
                Go to Inventory
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
