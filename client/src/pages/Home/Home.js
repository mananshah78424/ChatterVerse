import React, { Fragment, useEffect, useState } from "react";
import { Button, Row, Col, Image } from "react-bootstrap";
import { useAuthDispatch } from "../../context/auth";
import { Link } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import Users from "./Users";
import Messages from "./Messages";

export default function Home() {
  const dispatch = useAuthDispatch();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <Fragment>
      <Row className="justify-content-around mb-1 navbar">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}
