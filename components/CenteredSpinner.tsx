import Spinner from "react-bootstrap/Spinner";

export default function CenteredSpinner(props) {
  return (
    <div
      style={{
        position: "fixed",
        top: "calc(50% - 16px)",
        left: "calc(50% - 16px)",
      }}
    >
      <Spinner animation="border" {...props} />
    </div>
  );
}
