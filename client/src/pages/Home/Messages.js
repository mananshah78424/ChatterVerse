import React, { Fragment, useEffect, useState } from "react";
import { Button, Row, Col, Image, Form } from "react-bootstrap";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useMessageDispatch, useMessageState } from "../../context/messages";
import Message from "./Message";

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

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export default function Messages() {
  const [content, setContent] = useState("");
  const dispatch = useMessageDispatch();

  const { users } = useMessageState();
  console.log(users);
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;
  const [getMessages, { loading: messageLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) =>
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: selectedUser.username,
          message: data.sendMessage,
        },
      }),
    onError: (err) => console.log(err),
  });

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
    selectedChatMarkup = (
      <p className="info-text">Select a friend to start texting!</p>
    );
  } else if (messageLoading) {
    selectedChatMarkup = <p className="info-text">Loading ...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else {
    selectedChatMarkup = <p className="info-text">You are now connected</p>;
  }

  const submitMessage = (e) => {
    e.preventDefault();
    if (content === "" || !selectedUser) return;
    sendMessage({ variables: { to: selectedUser.username, content } });
    setContent("");
  };

  return (
    <Col xs={8}>
      <div className="message-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group>
            <Form.Control
              type="text"
              className="message-form-send-message rounded-pill"
              placeholder="Type a message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}
