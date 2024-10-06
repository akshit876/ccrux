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
  http.get("/api/documents", () => {
    loadInitialDocuments();
    const storedDocuments = JSON.parse(
      localStorage.getItem("documents") || "[]"
    );

    return new Response(JSON.stringify(storedDocuments), {
      headers: { "Content-Type": "application/json" },
    });
  }),

  http.post("/api/documents", async ({ request }) => {
    const { documents } = (await request.json()) as DocumentsPayload;
    localStorage.setItem("documents", JSON.stringify(documents));

    // Return a success response
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
];
