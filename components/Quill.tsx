import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

export const Quill = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
