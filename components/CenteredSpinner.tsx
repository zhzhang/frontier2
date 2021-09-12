import CircularProgress from "@material-ui/core/CircularProgress";

export default function CenteredSpinner(props) {
  return (
    <CircularProgress
      style={{
        position: "relative",
        top: "calc(50% - 16px)",
        left: "calc(50% - 16px)",
      }}
      {...props}
    />
  );
}
