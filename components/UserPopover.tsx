import UserCard from "@/components/UserCard";
import Popover from "@mui/material/Popover";

export default function UserPopover({ user, anchorEl }) {
  const anonymized = user.id === "anonymous";
  return (
    <Popover
      sx={{
        pointerEvents: "none",
      }}
      open={Boolean(anchorEl) && !anonymized}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      disableRestoreFocus
    >
      <UserCard user={user} />
    </Popover>
  );
}
