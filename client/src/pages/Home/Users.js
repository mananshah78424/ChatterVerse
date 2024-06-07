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
            src={
              user.imageURL ||
              "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAI0AlgMBIgACEQEDEQH/xAAaAAEAAgMBAAAAAAAAAAAAAAAABQYCAwQB/8QAMhAAAgIBAgIGCQQDAAAAAAAAAAECAwQFESExEyIyQVGRBhIjUmFxocHwQmLR8RSBsf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOmqd1irqi5SfcicxNGrglLJfry91ckBApb8j1wmlu4SS8di31011LauuMF+1bGYFLBbrsWi9e1qhL47cfMic3RnFOeK2/wBj+wEOD1pxbTTTXNM8AAAAAAAAAAAAAABlXCVk4wgt5SeyRiS+gY6lOeRJdnqx+ff+fECT0/Dhh0qK2c32peJ1AAAAAAAEZq+nq6Dvqj7WK4pLtL+SvF0Kvq2OsfMkoraEutFeAHGAAAAAAAAAAAAAFm0aChp9fjLdvzKyWjSZKWn0/BNfUDsAAAAAAAAIb0igvVpn37tEyRHpFL2NMfGTf55gQQAAAAAAAAAAAAATvo/enVZQ3xi/WXyII3YmRLGyI2x7ua8V4AW4Gum2F9UbK3vGSNgAAAAAAK7rt/SZfRp8K1t/vv8AsTGoZccShzezm+EV4sq0pOcnKT3k3u2B4AAAAAAAAAAAAAAHRh4luXP1a1wXOT5IDPAzrMOfV60H2ossmPfHIqVkFJJ+8tjmw9Moxtm10lnvSX/EdwAAADkz82GHBNxlKT5Lbh5nWeSSkmpJNPmmBUcnIsybXZbLd/RGon83R67E543s5+73P+CDtqnTNwti4yXNMDAAAAAAAAAAAADbjUTyb41Q5y7/AAQG/TsGeZb3qqPal9iy01QprVdcVGK7jHHphj0xqrWyS8zaAAAAAAAAAObNw68yv1Z8JLsyXNHSAKhkUWY9rrtW0l9TUWfU8JZdHVXtY8Yvx+BWWtns+YHgAAAAAAABYdCxeix+nkuvZy+CIPGqd99dS/U9i3RSjFRitkuCA9AAAAAAAAAAAAACv67i9Ferorq2c/mWA5dSo/yMOyG3WS3j80BVQAAAAAAASmgVetlysa4Qj9X+MsBEejsV0N0+9yS8v7JcAAAAAAAAAAAAAAAACpZtfQ5dtaWyUnt8jQSGuRUc9tfqimR4AAAf/9k="
            }
            className="user-image"
          />
          <div className="d-none d-md-block ml-2 user-div-name-and-message">
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
  return (
    <Col xs={10} md={4} className="user-bar">
      {usersList}
    </Col>
  );
}
