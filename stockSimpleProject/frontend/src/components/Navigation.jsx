import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Navigation() {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // Get navigation function

    const username = localStorage.getItem("token") || "Guest";

    const handleLogout = () => {
        logout();
        navigate("/"); 
    };

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/home">Stock Simple</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {user ? (
                        <>
                            <Navbar.Text>
                                Signed in as: <strong>{username}</strong>
                            </Navbar.Text>
                            <Button variant="outline-danger" onClick={handleLogout} className="ms-3">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link to="/">Login</Link>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
