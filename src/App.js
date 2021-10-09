import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './containers/universities/pages/universities-listing/universities-listing.scss';
import './containers/authenticate/pages/sign-in/sign-in.scss';
import './containers/authenticate/pages/sign-up/sign-up.scss';
import React, { Component, useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { ajax } from 'rxjs/ajax'
// TODO: remove
import { useObservable } from 'rxjs-hooks'
import { map, mergeMap } from 'rxjs/operators';
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

function getTotalPageCount(totalRecords, limit) {
  return Math.floor(totalRecords / limit) + ((totalRecords % limit === 0) ? 0 : 1);
}

function ListingPage() {
  const { listUni, limit, offset, updateListUni, updateLimitSelection } = useContext(UniversityContext);
  const [listUniByPage, setListUniByPage] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [submitValues, setSubmitValues] = useState({ uniName: '' });

  function handlePageClick(data) {
    updateLimitSelection({ limit: 10, offset: 10 * data.selected });
  }

  function handleSearchClick() {
    setSubmitValues({ uniName: keywords })
  }

  useEffect(() => {
    const subscription = UniversityApi.search(submitValues)
      .subscribe(data => {
        data.forEach((n, index) => {
          n.index = index;
        });
        updateListUni(data);
        updateLimitSelection({ limit: 10, offset: 0 });
      });

    return () => subscription.unsubscribe();
  }, [submitValues])

  useEffect(() => {
    setListUniByPage(listUni.slice(offset, offset + limit));
    return () => {};
  }, [listUni, limit, offset]);

  return (
    <Container className="universities-listing">
      <Container className="universities-listing__searchbar">
        <Row className="justify-content-center">
          <Col xs={8}>
            <Form.Group className="input-group mt-3 mb-3">
              <Form.Control
                type="text"
                placeholder="Enter a name of university"
                value={keywords}
                onChange={evt => setKeywords(evt.target.value)}
              />
              <div className="input-group-append">
                <Button variant="outline-primary" onClick={handleSearchClick}>Search</Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Container>
      <Container className="universities-listing__list">
        <Row>
          <Col xs={4}>School Name</Col>
          <Col xs={4}>Domain</Col>
          <Col xs={4}>Country</Col>
        </Row>
        { listUniByPage.map((n, index) => {
          const { name, country } = n;
          const domain = n.domains?.length ? n.domains[0] : undefined;
          return (
            <Row key={index}>
              <Col xs={4}>{n.index}.{ name }</Col>
              <Col xs={4}><a href={domain}>{ domain }</a></Col>
              <Col xs={3}>{ country }</Col>
              <Col xs={1}>Liked</Col>
            </Row>
          )
        }) }
      </Container>
      <Container>
      </Container>
      <Container>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'page-link'}
          pageCount={getTotalPageCount(listUni.length, 10)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-center'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-link'}
          nextClassName={'page-link'}
        />
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

const UniversityContext = React.createContext({
  listUni: [],
  limit: 10,
  offset: 0,
  updateListUni: () => {},
  updateLimitSelection: () => {},
});

function App() {
  const [listUni, setListUni] = useState([]);
  const [limitSelection, setLimitSelection] = useState({ limit: 10, offset: 0 });
  const updateListUni = (listUni) => {
    setListUni(listUni);
  };

  const initUniversityValue = {
    listUni,
    limit: limitSelection.limit,
    offset: limitSelection.offset,
    updateListUni,
    updateLimitSelection: setLimitSelection,
  };

  return (
    <UniversityContext.Provider value={initUniversityValue}>
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
    </UniversityContext.Provider>
  );
}

export default App;
