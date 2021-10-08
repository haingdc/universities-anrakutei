import { Component, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { ajax } from 'rxjs/ajax'
// TODO: remove
import { useObservable } from 'rxjs-hooks'
import './containers/universities/pages/universities-listing/universities-listing.scss';
import './containers/authenticate/pages/sign-in/sign-in.scss';
import './containers/authenticate/pages/sign-up/sign-up.scss';
// TODO: remove package: rxjs-hooks

export class SignIn extends Component {
  render() {
    return (
      <div className="sign-in">
        <div className="auth-wrapper">
          <div className="auth-inner">
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
          </div>
        </div>
      </div>
    );
  }
}

export class SignUp extends Component {
  render() {
    return (
      <div className="sign-in">
        <div className="auth-wrapper">
          <div className="auth-inner">
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
          </div>
        </div>
      </div>
    );
  }
}

function UniversityListContainer(props) {

}

function UniversityItem(props) {
  const { name, country, domain } = props;
  return (
    <div>
      <div>{name}</div>
      <div>{domain}</div>
      <div>{country}</div>
    </div>
  );
}

const UniversityApi = {
  search(options) {
    const paramTuples = [
      ['name', options.uniName],
      ['country', options.country],
    ];
    const queryString = paramTuples
    .filter(([_, fieldVal]) => fieldVal)
    .map(([fieldName, fieldVal]) => `${fieldName}=${fieldVal}`)
    .join('&');

    return ajax.getJSON(`http://universities.hipolabs.com/search?${queryString}`);
  }
};

function UIPagination(props) {
  const { className = '' } = props;
  return (
    <Pagination className={className}>
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Item >{2}</Pagination.Item>
      <Pagination.Item >{3}</Pagination.Item>
      <Pagination.Item >{4}</Pagination.Item>
      <Pagination.Next />
    </Pagination>
  )
}


function ListingPage() {
  const [data, setData] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [submitValues, setSubmitValues] = useState({ uniName: '' });

  useEffect(() => {
    if (!submitValues.uniName) return () => {};
    const subscription = UniversityApi.search(submitValues)
      .subscribe(data => setData(data));

    return () => subscription.unsubscribe();
  }, [submitValues])

  return (
    <Container className="universities-listing">
      <Container className="universities-listing__searchbar">
        <Row>
          <Col xs={4}>
            <Form>
              <Form.Control
                type="text"
                placeholder="Enter a name of university"
                value={keywords}
                onChange={evt => setKeywords(evt.target.value)}
              />
            </Form>
          </Col>
          <Col xs={2}>
            <Button variant="outline-primary" onClick={() => setSubmitValues({ uniName: keywords })}>Search</Button>
          </Col>
        </Row>
      </Container>
      <Container className="universities-listing__list">
        <Row>
          <Col xs={4}>School Name</Col>
          <Col xs={4}>Domain</Col>
          <Col xs={4}>Country</Col>
        </Row>
        { data.map((n, index) => {
          const { name, country } = n;
          const domain = n.domains?.length ? n.domains[0] : undefined;
          // return <UniversityItem key={name} name={name} domain={domain} country={country} />;
          return (
            <Row key={index}>
              <Col xs={4}>{ name }</Col>
              <Col xs={4}><a href={domain}>{ domain }</a></Col>
              <Col xs={4}>{ country }</Col>
            </Row>
          )
        }) }
      </Container>
      <Container>
        <UIPagination className="justify-content-center" />
      </Container>
    </Container>
  );
}

function NavBar() {
  return (
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path='/' component={ListingPage} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
