import CenteredSpinner from "@/components/CenteredSpinner";
import { PdfAnnotator } from "@/components/pdf-annotator";
import { useRef } from "@/lib/firebase";
import * as pdfjs from "@/lib/pdfjs";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";

export default function ReviewRequestActionPane({ article, children }) {
  const [tab, setTab] = useState("0");
  const [document, setDocument] = useState(null);
  const ref = article.latestVersion.ref;
  const file = useRef(ref);
  useEffect(() => {
    if (file) {
      const loadingTask = pdfjs.getDocument(file);
      loadingTask.promise.then((pdfDocument) => {
        setDocument(pdfDocument);
      });
    }
  }, [file]);

  const handleChange = (_event, newValue) => {
    setTab(newValue);
  };
  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Article" value="0" />
          <Tab label="Actions" value="1" />
        </TabList>
      </Box>
      <TabPanel value="0">
        {document ? (
          <PdfAnnotator
            document={document}
            sx={{
              height: "calc(100vh - 195px)",
              position: "relative",
              overflow: "auto",
            }}
          />
        ) : (
          <CenteredSpinner />
        )}
      </TabPanel>
      <TabPanel value="1">{children}</TabPanel>
    </TabContext>
  );
}
