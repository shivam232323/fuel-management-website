import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function MainLayout() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  return (
    <div className="App">
      <Navbar className="bg-primary" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand className="fw-bold">
            ⛽ Fuel Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate('/records')}>Records</Nav.Link>
              <Nav.Link onClick={() => navigate('/add-record')}>
                Add Record
              </Nav.Link>
              <Nav.Item className="ms-2 d-flex align-items-center">
                <span className="text-light me-3">👤 {username}</span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="page-content">
        <Outlet />
      </div>

      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p className="mb-0">
          © 2026 Fuel Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default MainLayout;
