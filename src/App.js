import { Component, useEffect, useMemo, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { useObservable } from 'rxjs-hooks'
import { ajax } from 'rxjs/ajax'
import { fromFetch } from 'rxjs/fetch'
import { map } from 'rxjs/operators';
// TODO: remove package: rxjs-hooks

export class Login extends Component {
  render() {
    return (
      <Form>
        <h3>Sign In</h3>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" className="form-control" placeholder="Enter email"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" className="form-control" placeholder="Enter password"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="remember">
          <div className="custom-control custom-checkbox">
            <Form.Check inline label="Remember me" type="checkbox" className="custom-control-input" id="customCheck1"></Form.Check>
          </div>
        </Form.Group>

        <Button type="submit" variant="primary" className="btn btn-primary btn-block">Submit</Button>
        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
      </Form>
    );
  }
}

export class SignUp extends Component {
  render() {
    return (
      <Form>
        <h3>Sign Up</h3>

        <Form.Group className="mb-3">
          <Form.Label>First name</Form.Label>
          <Form.Control type="text" className="form-control" placeholder="First name"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last name</Form.Label>
          <Form.Control type="text" className="form-control" placeholder="Last name"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" className="form-control" placeholder="Enter email"></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" className="form-control" placeholder="Enter password"></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="btn btn-primary btn-block">Sign Up</Button>
        <p className="forgot-password text-right">
          Already registered <a href="#">sign in?</a>
        </p>
      </Form>
    );
  }
}

function Listing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const subscription = ajax.getJSON('http://universities.hipolabs.com/search?name=middle')
      .subscribe(data => setData(data));

      return () => subscription.unsubscribe();
  }, [])

  return (
    <div>
      { data.map(n => {
        return (
          <div>
            <div>{n.name}</div>
            <div>{n.country}</div>
            <div>{n.domains?.length ? n.domains[0] : 'NA'}</div>
          </div>
        )
      }) }
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* TODO: create NavBar component */}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/"}>Home</Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path='/' component={Listing} />
              <Route path="/sign-in" component={Login} />
              <Route path="/sign-up" component={SignUp} />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
