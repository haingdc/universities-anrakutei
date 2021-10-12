import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <Navbar className="fixed-top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link className="navbar-brand" to={"/"}>Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to={"/sign-in"}>Login</Link>
            <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
