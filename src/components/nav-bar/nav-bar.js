import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { useAuthState, useAuthDispatch } from '../../contexts/auth-context';
import { signoutUser } from '../../contexts/auth-action';

export function NavBar(props) {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  async function handleSignout(e) {
    e.preventDefault();
    try {
      await signoutUser(dispatch);
    } catch (error) {
      console.error({ errorSignin: error });
    }
  }
  return (
    <Navbar className="fixed-top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link className="navbar-brand" to={"/"}>Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            { !user ? <Link className="nav-link" to={"/sign-in"}>Login</Link> : null}
            { !user ? <Link className="nav-link" to={"/sign-up"}>Sign up</Link> : null}
            { user ? <Link className="nav-link" to={"/"}>{ user.name }</Link> : null}
            { user ? <Link className="nav-link" to={"/"} onClick={handleSignout}>Sign out</Link> : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
