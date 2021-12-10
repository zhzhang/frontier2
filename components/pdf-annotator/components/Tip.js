import styles from "./Tip.module.css";
import Typography from "@mui/material/Typography"

const Tip = ({ onConfirm }) => {
  return (
    <div className={styles.TipCompact} onClick={onConfirm}>
      <Typography>Add Reference</Typography>
    </div>
  );
};

export default Tip;
