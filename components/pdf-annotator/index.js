import dynamic from "next/dynamic";

export const PdfAnnotator = dynamic(
  async () => await import("./components/PdfArticle"),
  {
    ssr: false,
  }
);
export const Tip = dynamic(async () => await import("./components/Tip"), {
  ssr: false,
});
export const Highlight = dynamic(
  async () => await import("./components/Highlight"),
  {
    ssr: false,
  }
);

export const Popup = dynamic(async () => await import("./components/Popup"), {
  ssr: false,
});

export const PdfLoader = dynamic(
  async () => await import("./components/PdfLoader"),
  {
    ssr: false,
  }
);
