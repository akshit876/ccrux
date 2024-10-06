import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Document } from "../interfaces/Document";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get<Document[]>("/api/documents");
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setDocuments((prevDocs) => {
      const newDocs = [...prevDocs];
      const [removed] = newDocs.splice(dragIndex, 1);
      newDocs.splice(hoverIndex, 0, removed);
      return newDocs.map((doc, index) => ({ ...doc, position: index }));
    });
    setHasChanges(true);
  }, []);

  const saveDocuments = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await axios.post("/api/documents", documents);
      setHasChanges(false);
      setLastSaveTime(new Date());
    } catch (error) {
      console.error("Error saving documents:", error);
    } finally {
      setIsSaving(false);
    }
  }, [documents, hasChanges]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveDocuments();
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [saveDocuments]);

  return { documents, loading, hasChanges, isSaving, lastSaveTime, moveCard };
};
