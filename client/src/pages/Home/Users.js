import React from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { Button, Row, Col, Image } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from "../../context/messages";
import classNames from "classnames";
const GET_USERS = gql`
  query {
    getUsers {
      username
      createdAt
      imageURL
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;
export default function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => console.log(err),
  });

  let usersList;
  if (!users || loading) {
    usersList = <p>Either user is not found or it is loading!</p>;
  } else if (users.length === 0) {
    usersList = <p>No users have joined</p>;
  } else if (users.length > 0) {
    usersList = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames("user-div d-flex p-3", {
            "bg-white": selected,
          })}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={user.imageURL}
            roundedCircle
            className="mr-2"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <div>
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }
  return <Col xs={4}>{usersList}</Col>;
}
