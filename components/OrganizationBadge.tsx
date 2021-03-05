import Badge from "react-bootstrap/Badge";
import { useState } from "react";
import Router from "next/router";

export default ({ organization }) => {
  const { id, name } = organization;
  const [hover, setHover] = useState(false);
  return (
    <Badge
      pill
      variant={hover ? "primary" : "secondary"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => Router.push(`/organization/${id}`)}
    >
      {name}
    </Badge>
  );
};
