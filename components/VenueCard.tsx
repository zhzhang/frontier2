import Jumbotron from "react-bootstrap/Jumbotron";
import Router from "next/router";
import { withApollo } from "../lib/apollo";
import OrganizationBadge from "../components/OrganizationBadge";
import UserBadge from "../components/UserBadge";
import { useState } from "react";

const VenueCard = ({ venue }) => {
  const { id, name, abbreviation, date } = venue;
  const [hover, setHover] = useState(false);
  return (
    <Jumbotron>
      <h4
        onClick={() => Router.push(`/article/${id}`)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ color: hover ? "blue" : "black" }}
      >
        {name}
        {abbreviation}
        {date}
      </h4>
    </Jumbotron>
  );
};

export default VenueCard;
