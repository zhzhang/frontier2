import { useRef } from "@/lib/firebase";
import Avatar from "@mui/material/Avatar";

export default function FirebaseAvatar({
  storeRef,
  name,
  anonymous = false,
  ...props
}) {
  if (anonymous) {
    return <Avatar {...props} />;
  } else if (storeRef) {
    const url = useRef(storeRef);
    return <Avatar {...props} src={url} alt={name} />;
  }
  return <Avatar {...props} />;
}
