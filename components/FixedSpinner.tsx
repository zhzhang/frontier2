import CircularProgress from "@mui/material/CircularProgress";

export default function CenteredSpinner(props) {
  return (
    <CircularProgress
      style={{
        position: "absolute",
        top: "calc(50% - 25px)",
        left: "calc(50% - 25px)",
      }}
      {...props}
    />
  );
}
