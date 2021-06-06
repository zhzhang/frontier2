import Spinner from "react-bootstrap/Spinner";

export default function CenteredSpinner(props) {
  return (
    <Spinner
      animation="border"
      style={{
        position: "absolute",
        top: "calc(50% - 16px)",
        left: "calc(50% - 16px)",
      }}
      {...props}
    />
  );
}
