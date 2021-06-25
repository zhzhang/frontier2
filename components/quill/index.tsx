import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const Quill = dynamic(import("./Quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

export default Quill;
