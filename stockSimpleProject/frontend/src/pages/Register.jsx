import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Button, Form, Card, Container, Alert, InputGroup } from "react-bootstrap"; 

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }

        try {
            const endpoint = isLogin ? "login" : "signup"; // Toggle endpoint based on form mode
            const response = await fetch(`http://localhost:3000/users/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    login(data.token, data.username);
                    alert("Login successful!");
                    navigate("/home");
                } else {
                    alert("Registration successful! Please log in.");
                    setIsLogin(true); // Switch to login after registration
                }
                setError("");
            } else {
                setError(data.error || "An error occurred.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Button type="submit" className="w-100 btn btn-primary">
                            {isLogin ? "Login" : "Register"}
                        </Button>
                    </Form>

                    <div className="mt-3 text-center">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <Button
                                variant="link"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Sign up" : "Login"}
                            </Button>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Register;
