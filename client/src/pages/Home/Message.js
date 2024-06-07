import React from "react";
import { useAuthState } from "../../context/auth";
import classNames from "classnames";

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const rec = !sent;
  console.log(sent, rec);

  return (
    <div
      className={classNames("d-flex my-3", {
        "ms-auto": sent,
        "me-auto": rec,
      })}
    >
      <div
        className={classNames("px-3 rounded-pill", {
          "message-sent": sent,
          "message-rec": rec,
        })}
      >
        <p className={classNames({ "text-white": sent })} key={message.uuid}>
          {message.content}
        </p>
      </div>
    </div>
  );
}
