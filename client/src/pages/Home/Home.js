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
  };

  return (
    <Fragment>
      <Row className="bg-black justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          {/* <Button variant='link'>Register</Button> */}
        </Link>

        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="">
        <Users></Users>
        <Messages></Messages>
      </Row>
    </Fragment>
  );
}
