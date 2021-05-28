import Badge from "react-bootstrap/Badge";
import { useState } from "react";
import Router from "next/router";

const UserBadge = ({ user }) => {
  const { id, name, email } = user;
  const [hover, setHover] = useState(false);
  return (
    <span style={{ marginRight: 5 }}>
      <Badge
        pill
        variant={hover ? "primary" : "secondary"}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => Router.push(`/user/${id}`)}
      >
        {name}
      </Badge>
    </span>
  );
};

export default UserBadge;
