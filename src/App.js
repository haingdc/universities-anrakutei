import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './containers/universities/pages/universities-listing/universities-listing.scss';
import './containers/authenticate/pages/sign-in/sign-in.scss';
import './containers/authenticate/pages/sign-up/sign-up.scss';
import React, { Component, useContext, useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ReactPaginate from 'react-paginate';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { ajax } from 'rxjs/ajax'
// TODO: remove
import { useObservable } from 'rxjs-hooks'
import { map, mergeMap } from 'rxjs/operators';
// TODO: remove package: rxjs-hooks
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

function SignIn(props) {
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');

  const dispatch = useAuthDispatch();

  async function handleSignin(e) {
    e.preventDefault();
    try {
      let response = await signinUser(dispatch, { mail, pass })
      if (!response.user) return;
      props.history.push('/');
    } catch(error) {
      console.error({ errorSignin: error });
    }
  }

  return (
    <div className="sign-in">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Form>
            <h3>Sign In</h3>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={mail}
                onChange={ev => setMail(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={pass}
                onChange={ev => setPass(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="remember">
              <div className="custom-control custom-checkbox">
                <Form.Check inline label="Remember me" type="checkbox" className="custom-control-input" id="customCheck1"></Form.Check>
              </div>
            </Form.Group> */}

            <Button
              type="submit"
              variant="primary"
              className="btn btn-primary btn-block"
              onClick={handleSignin}
            >Submit</Button>
            {/* <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p> */}
          </Form>
        </div>
      </div>
    </div>
  );
}

function SignUp(props) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');

  const dispatch = useSignupDispatch();

  async function handleSignup(e) {
    e.preventDefault();
    try {
      let response = await signupUser(dispatch, { name, mail, pass })
      if (!response.user) return;
      props.history.push('/sign-in');
    } catch(error) {
      console.error({ errorSignin: error });
    }
  }

  return (
    <div className="sign-in">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Form>
            <h3>Sign Up</h3>

            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full name"
                value={name}
                onChange={ev => setName(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={mail}
                onChange={ev => setMail(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={pass}
                onChange={ev => setPass(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="btn btn-primary btn-block"
              onClick={handleSignup}
            >Sign Up</Button>
            <p className="forgot-password text-right">
              Already registered <Link className="" to={"/sign-in"}>sign in?</Link>
            </p>
          </Form>
        </div>
      </div>
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

function getTotalPageCount(totalRecords, limit) {
  return Math.floor(totalRecords / limit) + ((totalRecords % limit === 0) ? 0 : 1);
}

function LikeButton(props) {
  const { value, name, onClick = (_uniId) => {} } = props;
  return (
    <FontAwesomeIcon
      icon={value === true ? fasHeart : farHeart}
      onClick={() => onClick({ name, value: !value })}
    />
  );
}

function ListingPage(props) {
  const authContext = useAuthState();
  const { listUni, limit, offset, updateListUni, updateLimitSelection } = useContext(UniversityContext);
  const [listUniByPage, setListUniByPage] = useState([]);
  const [listLikedUniByUser, setListLikedUniByUser] = useState(new Map());
  const [keywords, setKeywords] = useState('');
  const [submitValues, setSubmitValues] = useState({ uniName: '' });

  function handlePageClick(data) {
    updateLimitSelection({ limit: 10, offset: 10 * data.selected });
  }

  function handleSearchClick() {
    setSubmitValues({ uniName: keywords })
  }

  async function handleLikeClick({ name: uniId, value: liked }) {
    if (authContext.user) {
      const uni = { ...listUniByPage.find(u => u.id === uniId) };
      delete uni.liked;
      if (liked) {
        listLikedUniByUser.set(uniId, uni)
      } else {
        listLikedUniByUser.delete(uniId)
      }
      const nextListLikedUni = new Map(listLikedUniByUser);
      setListLikedUniByUser(nextListLikedUni);
      await updateLikedUniversitiesByUser({ mail: authContext.user.mail, likedUniversities: nextListLikedUni });
    } else {
      props.history.push('/sign-in');
    }
  }

  useEffect(() => {
    const subscription = UniversityApi.search(submitValues)
      .subscribe(data => {
        data.forEach((n, index) => {
          n.id = [n.name, n.domains, n.country].join('');
          n.index = index;
        });
        updateListUni(data);
        updateLimitSelection({ limit: 10, offset: 0 });
      });

    return () => subscription.unsubscribe();
  }, [submitValues])

  useEffect(() => {
    let nextListUniByPage = listUni.slice(offset, offset + limit);
    nextListUniByPage = nextListUniByPage.map(uni => {
      if (listLikedUniByUser.has(uni.id)) {
        uni.liked = true;
      } else {
        uni.liked = false;
      }
      return {...uni};
    });
    setListUniByPage(nextListUniByPage);
    return () => {};
  }, [listUni, limit, offset, listLikedUniByUser]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadLikedUnivesitiesByUser({ mail: authContext.user.mail});
      if (data?.likedUniversities) {
        setListLikedUniByUser(data.likedUniversities);
      }
    }
    if (authContext.user) {
      fetchData();
    }
  }, [authContext.user]);

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
          <Col xs={3}>Country</Col>
          <Col xs={1}></Col>
        </Row>
        { listUniByPage.map((n, index) => {
          const { id, name, country, liked = false } = n;
          const domain = n.domains?.length ? n.domains[0] : undefined;
          return (
            <Row key={id}>
              <Col xs={4}>{n.index}.{ name }</Col>
              <Col xs={4}><a href={domain}>{ domain }</a></Col>
              <Col xs={3}>{ country }</Col>
              <Col xs={1}>
                <LikeButton name={id} value={liked} onClick={handleLikeClick} />
              </Col>
            </Row>
          )
        }) }
      </Container>
      <Container>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'page-link'}
          pageCount={getTotalPageCount(listUni.length, 10)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={1}
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

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

export function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
 
  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider");
  }

  return context;
}

let user = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).user
	: '';
let token = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).auth_token
	: '';

export const initialState = {
	user: '' || user,
	token: '' || token,
	loading: false,
	errorMessage: null,
};

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);
 
  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

function AuthReducer(initialState, action) {
  switch(action.type) {
    case 'request_login':
      return {
        ...initialState,
        loading: true,
      };
    case 'login_success':
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.auth_token,
        loading: false,
      };
    case 'login_error':
      return {
        ...initialState,
        user: null,
        loading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const SignupStateContext = React.createContext();
const SignupDispatchContext = React.createContext();

export function useSignupState() {
  const context = React.useContext(SignupStateContext);
  if (context === undefined) {
    throw new Error("useSignupState must be used within a SignupProvider");
  }
 
  return context;
}

export function useSignupDispatch() {
  const context = React.useContext(SignupDispatchContext);
  if (context === undefined) {
    throw new Error("useSignupDispatch must be used within a SignupProvider");
  }

  return context;
}

export const initialStateSignup = {
  user: null,
  loading: false,
  errorMessage: null,
};

export const SignupProvider = ({ children }) => {
  const [user, dispatch] = useReducer(SignupReducer, initialState);

  return (
    <SignupStateContext.Provider value={user}>
      <SignupDispatchContext.Provider value={dispatch}>
        {children}
      </SignupDispatchContext.Provider>
    </SignupStateContext.Provider>
  );
};

function SignupReducer(initialState, action) {
  switch(action.type) {
    case 'request_register':
      return {
        ...initialState,
        user: null,
        loading: true,
        errorMessage: null
      };
    case 'register_success':
      return {
        ...initialState,
        user: action.payload.user,
        loading: false,
        errorMessage: null
      };
    case 'register_error':
      return {
        ...initialState,
        user: null,
        loading: false,
        errorMessage: action.payload.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// TODO: remove
const ROOT_URL = 'https://secret-hamlet-03431.herokuapp.com';

export async function signupUser(dispatch, registerPayload) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: registerPayload.name, email: registerPayload.mail, password: registerPayload.pass }),
  };

  try {
    dispatch({ type: 'request_register' });
    let response = await new Promise((resolve) => {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
      const user = registeredUsers.filter(n => n.mail === registerPayload.mail)[0];
      if (user) {
        resolve({ user: null, errors: ['email is exist'] });
      } else {
        resolve({ user: registerPayload, errors: [] });
      }
    });
    let data = response;

    if (!data.errors.length) {
      dispatch({ type: 'register_success', payload: data.user });
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
      registeredUsers.push(data.user);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers, replacer));
      return data;
    }

    dispatch({ type: 'register_error', payload: { error: data.errors[0] } });
    return { user: null };
  } catch (error) {
    dispatch({ type: 'login_error', error: error });
  }
}

export async function signinUser(dispatch, loginPayload) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: loginPayload.mail, password: loginPayload.pass }),
  };

  try {
    dispatch({ type: 'request_login' });
    // TODO: fake login
    // let response = await fetch(`${ROOT_URL}/login`, requestOptions);
    // let data = await response.json();
    let response = await new Promise((resolve) => {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
      const user = registeredUsers.filter(n => n.mail === loginPayload.mail && n.pass === loginPayload.pass)[0];
      if (!user) {
        resolve({ user: null, errors: ['user is not exist'] });
      } else {
        resolve({ user, errors: [] });
      }
    });
    let data = response;

    if (data.user) {
      dispatch({ type: 'login_success', payload: data });
      const currentUser = { user: { ...data.user } };
      delete currentUser.user.likedUniversities;
      localStorage.setItem('currentUser', JSON.stringify(currentUser, replacer));
      return data
    }

    dispatch({ type: 'login_error', error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: 'login_error', error: error });
  }
}

export async function signoutUser(dispatch) {
  dispatch({ type: 'LOGOUT' });
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
}

export async function loadLikedUnivesitiesByUser(userPayload) {
  const { mail } = userPayload;
  try {
    let response = await new Promise((resolve) => {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
      const [user] = registeredUsers.filter(n => n.mail === mail);
      if (!user) {
        resolve({ likedUniversities: null, errors: ['can not load liked universities because user is not exist'] });
      } else {
        resolve({ likedUniversities: user.likedUniversities, errors: [] });
      }
    });
    let data = response;
    if (!data.errors.length) {
      return data;
    }
  } catch(error) {
  }
}

export async function updateLikedUniversitiesByUser(userPayload) {
  const { mail, likedUniversities } = userPayload;
  try {
    let response = await new Promise((resolve) => {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]", reviver);
      const [user] = registeredUsers.filter(n => n.mail === mail);
      if (!user) {
        resolve({ likedUniversities: null, errors: ['can not update liked universities because user is not exist'] });
      } else {
        user.likedUniversities = likedUniversities;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers, replacer));
        resolve({ likedUniversities, errors: [] });
      }
    });
    let data = response;
    if (!data.errors.length) {
      return data;
    }
  } catch(err) {
  }
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
    <AuthProvider>
      <SignupProvider>
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
      </SignupProvider>
  </AuthProvider>
  );
}

export default App;


function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
