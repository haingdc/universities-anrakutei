import React, { useReducer } from 'react';
import { AuthReducer, SignupReducer } from './auth-reducers';

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

export const initialState = {
  user: '' || user,
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
