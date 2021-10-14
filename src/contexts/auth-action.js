import { reviver, replacer } from '../utils';


export async function signupUser(dispatch, registerPayload) {
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
  try {
    dispatch({ type: 'request_login' });
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
      return data;
    }

    dispatch({ type: 'login_error', error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: 'login_error', error: error });
  }
}

export async function signoutUser(dispatch) {
  dispatch({ type: 'logout' });
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
}
