import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;
export default function Register() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => navigate("/login"),
    onError(err) {
      console.log("Okay errors");
      console.log(err);
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterFunction = (e) => {
    console.log("Pressed");
    e.preventDefault();
    console.log(fields);
    registerUser({ variables: { ...fields } });
  };
  return (
    <Row className="register-row py-5 justify-content-center">
      <Col xs={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterFunction}>
          <Form.Group>
            <Form.Label className={errors.email ? "text-danger" : ""}>
              {errors.email ?? "Email"}
            </Form.Label>
            <Form.Control
              type="email"
              className={`form-input mb-2 ${errors.email ? "is-invalid" : ""}`}
              value={fields.email}
              onChange={(e) => setFields({ ...fields, email: e.target.value })}
            />
          </Form.Group>

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

          <Form.Group>
            <Form.Label className={errors.confirmPassword ? "text-danger" : ""}>
              {errors.confirmPassword ?? "Confirm Password"}
            </Form.Label>
            <Form.Control
              type="password"
              className={`form-input mb-2 ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              value={fields.confirmPassword}
              onChange={(e) =>
                setFields({ ...fields, confirmPassword: e.target.value })
              }
            />
          </Form.Group>

          <div className="text-center pt-3">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Register"}
            </Button>
            <br></br>

            <small>
              Alrady have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
