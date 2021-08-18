import { useRef } from "@/lib/firebase";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";

export default function FirebaseAvatar({
  storeRef,
  name,
  anonymous = false,
  ...props
}) {
  if (anonymous) {
    return (
      <Avatar {...props}>
        <PersonIcon />
      </Avatar>
    );
  } else if (storeRef) {
    const url = useRef(storeRef);
    return <Avatar {...props} src={url} />;
  }
  return <Avatar {...props}>{name[0]}</Avatar>;
}
