import { useRef } from "@/lib/firebase";
import Avatar from "@material-ui/core/Avatar";

export default function FirebaseAvatar({ storeRef, name, ...props }) {
  if (storeRef) {
    const url = useRef(storeRef);
    return <Avatar {...props} src={url} />;
  }
  return <Avatar>{name[0]}</Avatar>;
}
