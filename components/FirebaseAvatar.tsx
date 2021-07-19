import { useRef } from "@/lib/firebase";
import Avatar from "@material-ui/core/Avatar";

export default function FirebaseAvatar({ storeRef, ...props }) {
  const url = useRef(storeRef);
  return <Avatar {...props} src={url} />;
}
