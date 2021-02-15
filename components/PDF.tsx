import dynamic from "next/dynamic";

export const Document = dynamic(
  async () => (await import("react-pdf")).Document,
  {
    ssr: false,
  }
);
export const Page = dynamic(async () => (await import("react-pdf")).Page, {
  ssr: false,
});
