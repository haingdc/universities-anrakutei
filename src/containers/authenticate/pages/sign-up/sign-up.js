import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { signupUser } from "../../../../contexts/auth-action";
import { useSignupDispatch } from "../../../../contexts/auth-context";
import './sign-up.scss';

export function SignUp(props) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');

  const dispatch = useSignupDispatch();

  async function handleSignup(e) {
    e.preventDefault();
    try {
      let response = await signupUser(dispatch, { name, mail, pass });
      if (!response.user)
        return;
      props.history.push('/sign-in');
    } catch (error) {
      console.error({ errorSignin: error });
    }
  }

  return (
    <div className="sign-up">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Form>
            <h3>Sign Up</h3>

            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full name"
                className="sign-up__input"
                value={name}
                onChange={ev => setName(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="sign-up__input"
                value={mail}
                onChange={ev => setMail(ev.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="sign-up__input"
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
