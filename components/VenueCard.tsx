import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Router from "next/router";
import { Quill } from "./Quill";
import { withApollo } from "../lib/apollo";

const VenueCard = ({ venue }) => {
  const { id, name, description } = venue;
  return (
    <Jumbotron>
      <h3>{name}</h3>
      <Quill value={description} modules={{ toolbar: false }} readOnly />
      <Button onClick={() => Router.push(`/new-article?venueId=${id}`)}>
        Submit an article
      </Button>
    </Jumbotron>
  );
};

export default withApollo(VenueCard);
