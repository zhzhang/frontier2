import styles from "./Tip.module.css";

const Tip = ({ onConfirm }) => {
  return (
    <div className={styles.TipCompact} onClick={onConfirm}>
      Add reference
    </div>
  );
};

export default Tip;
