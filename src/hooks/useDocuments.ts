import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Document } from '../interfaces/Document';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Document[]>('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const updateDocuments = useCallback((updater: (docs: Document[]) => Document[]) => {
    setDocuments((prevDocs) => {
      const newDocs = updater(prevDocs);
      setHasChanges(true);
      return newDocs;
    });
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    updateDocuments((prevDocs) => {
      const newDocs = [...prevDocs];
      const [removedDoc] = newDocs.splice(dragIndex, 1);
      newDocs.splice(hoverIndex, 0, removedDoc);
      return newDocs;
    });
  }, [updateDocuments]);

  const saveDocuments = useCallback(async () => {
    if (!hasChanges) return;

    setSaving(true);
    try {
      await axios.post('/api/documents', { documents });
      setLastSaveTime(new Date());
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving documents:', error);
    } finally {
      setSaving(false);
    }
  }, [documents, hasChanges]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveDocuments();
    }, 5000); // Save every 5 seconds if there are changes

    return () => clearInterval(saveInterval);
  }, [saveDocuments]);

  return { 
    documents, 
    updateDocuments, 
    selectedDocument, 
    setSelectedDocument,
    moveCard,
    loading,
    saving,
    lastSaveTime,
    hasChanges
  };
};
