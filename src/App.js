import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SignIn } from './containers/authenticate/pages/sign-in/sign-in';
import { SignUp } from './containers/authenticate/pages/sign-up/sign-up';
import { NavBar } from './components/nav-bar/nav-bar';
import { UniversityProvider } from './contexts/university-context';
import { ListingPage } from './containers/universities/pages/universities-listing/universities-listing';
import { AuthProvider, SignupProvider } from './contexts/auth-context';

function App() {
  return (
    <AuthProvider>
      <SignupProvider>
        <UniversityProvider>
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
        </UniversityProvider>
      </SignupProvider>
  </AuthProvider>
  );
}

export default App;
