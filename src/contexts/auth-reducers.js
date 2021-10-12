export function AuthReducer(initialState, action) {
  switch (action.type) {
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
export function SignupReducer(initialState, action) {
  switch (action.type) {
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
