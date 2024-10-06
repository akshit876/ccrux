import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDocuments } from "./hooks/useDocuments";
import { DraggableCard } from "./components/DraggableCard";
import "./App.css";

const App: React.FC = () => {
  const { documents, loading, isSaving, lastSaveTime, moveCard } =
    useDocuments();

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        {loading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <div className="grid">
            {documents.map((doc, index) => (
              <DraggableCard
                key={doc.type}
                doc={doc}
                index={index}
                moveCard={moveCard}
              />
            ))}
          </div>
        )}
        {isSaving && <div>Saving...</div>}
        {lastSaveTime && (
          <div>
            Last saved:{" "}
            {Math.round((Date.now() - lastSaveTime.getTime()) / 1000)} seconds
            ago
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
