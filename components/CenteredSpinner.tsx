import CircularProgress from "@mui/material/CircularProgress";

export default function CenteredSpinner(props) {
  return (
    <CircularProgress
      style={{
        position: "relative",
        top: "calc(50% - 20px)",
        left: "calc(50% - 20px)",
      }}
      {...props}
    />
  );
}
