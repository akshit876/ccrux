import { http } from "msw";
import data from "../mock.json";

interface DocumentsPayload {
  documents: Document[];
}

function loadInitialDocuments() {
  const existingDocuments = localStorage.getItem("documents");
  if (!existingDocuments) {
    localStorage.setItem("documents", JSON.stringify(data));
  }
}

export const handlers = [
  http.get("/api/fetch/documents", () => {
    console.log("askdnskj");
    loadInitialDocuments();
    const storedDocuments = JSON.parse(
      localStorage.getItem("documents") || "[]"
    );

    // Return a response object
    return new Response(JSON.stringify(storedDocuments), {
      headers: { "Content-Type": "application/json" },
    });
  }),

  // POST handler for saving documents
  http.post("/api/documents", async ({ request }) => {
    const { documents } = (await request.json()) as DocumentsPayload;
    localStorage.setItem("documents", JSON.stringify(documents));

    // Return a success response
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
];
