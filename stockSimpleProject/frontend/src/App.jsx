import Navigation from "./components/Navigation";
import { AuthProvider } from "./context/authContext";
import Home from "./pages/Home";
import Register  from "./pages/Register";
import Product from "./pages/Product";
import Inventory from "./pages/Inventory";
import Stock from "./pages/Stock";
import { Routes, Route } from 'react-router-dom';

// Bootstrap CSS
import Container from 'react-bootstrap/Container';

function App() {

  return (
    <>
    <AuthProvider>
    <Navigation />
    <Container>
      <Routes>
        <Route path="/" element={ <Register /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/products" element={ <Product />} />
        <Route path="/inventory" element={ <Inventory/> } />
        <Route path="/stocks" element={ <Stock/> } />
      </Routes>
    </Container>
    </AuthProvider>
    </>
  );
}

export default App;
