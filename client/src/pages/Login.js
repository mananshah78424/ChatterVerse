import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { gql, useLazyQuery } from "@apollo/client";
import { useAuthDispatch } from "../context/auth";
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;
export default function Login(props) {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError(err) {
      console.log("Okay errors", err);
      if (err.graphQLErrors[0] && err.graphQLErrors[0].extensions.errors) {
        setErrors(err.graphQLErrors[0].extensions.errors);
      } else {
        console.log(err.graphQLErrors[0]);
        setErrors({});
      }
    },
    onCompleted(data) {
      console.log("User has now logged in - At Login.js", data);
      dispatch({ type: "LOGIN", payload: data.login });
      navigate("/");
    },
  });

  const submitLoginFunction = (e) => {
    console.log("Pressed");
    e.preventDefault();
    console.log(fields);
    loginUser({ variables: { ...fields } });
  };
  return (
    <Row className="register-row py-5 justify-content-center">
      <Col xs={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginFunction}>
          <Form.Group>
            <Form.Label className={errors.username ? "text-danger" : ""}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              className={`form-input mb-2 ${
                errors.username ? "is-invalid" : ""
              }`}
              value={fields.username}
              onChange={(e) =>
                setFields({ ...fields, username: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={errors.password ? "text-danger" : ""}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              className={`form-input mb-2 ${
                errors.password ? "is-invalid" : ""
              }`}
              value={fields.password}
              onChange={(e) =>
                setFields({ ...fields, password: e.target.value })
              }
            />
          </Form.Group>

          <div className="text-center pt-3">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Login"}
            </Button>
            <br></br>
            <small>
              Dont have an account? <Link to="/register">Sign up Now</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
