import Router from "next/router";
import { useState } from "react";

const VenueCard = ({ venue }) => {
  const { id, name, abbreviation, description, venueDate } = venue;
  const [hover, setHover] = useState(false);
  return (
    <>
      <h4
        onClick={() => Router.push(`/article/${id}`)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ color: hover ? "blue" : "black" }}
      >
        {name}
        {abbreviation}
        {venueDate}
      </h4>
    </>
  );
};

export default VenueCard;
