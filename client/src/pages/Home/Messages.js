import React, { Fragment, useEffect, useState } from "react";
import { Button, Row, Col, Image } from "react-bootstrap";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { useMessageDispatch, useMessageState } from "../../context/messages";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
    }
  }
`;
export default function Messages() {
  const dispatch = useMessageDispatch();

  const { users } = useMessageState();
  console.log(users);
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;
  const [getMessages, { loading: messageLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  useEffect(() => {
    console.log(messagesData);
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGE",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  let selectedChatMarkup;
  if (!messages && !messageLoading) {
    selectedChatMarkup = <p>Select a friend to start texting!</p>;
  } else if (messageLoading) {
    selectedChatMarkup = <p>Loading ...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message) => (
      <p key={message.uuid}>{message.content}</p>
    ));
  } else {
    selectedChatMarkup = <p>You are now connected</p>;
  }
  return <Col xs={8}>{selectedChatMarkup}</Col>;
}
