import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { signinUser } from "../../../../contexts/auth-action";
import { useAuthDispatch } from "../../../../contexts/auth-context";
import './sign-in.scss';

export function SignIn(props) {
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');

  const dispatch = useAuthDispatch();

  async function handleSignin(e) {
    e.preventDefault();
    try {
      let response = await signinUser(dispatch, { mail, pass });
      if (!response.user)
        return;
      props.history.push('/');
    } catch (error) {
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
                className="sign-in__input"
                value={mail}
                onChange={ev => setMail(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                className="sign-in__input"
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
