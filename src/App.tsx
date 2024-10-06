import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import "./App.css"; // Add your CSS file here

// Define TypeScript types for the document
interface Document {
  type: string;
  title: string;
  position: number;
}

const TYPE_TO_IMAGE_ID: { [key: string]: number } = {
  "bank-draft": 1000,
  "bill-of-lading": 1001,
  invoice: 1002,
  "bank-draft-2": 1003,
  "bill-of-lading-2": 1004,
};

const DraggableCard: React.FC<{ doc: Document; index: number; moveCard: (dragIndex: number, hoverIndex: number) => void }> = ({ doc, index, moveCard }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id: doc.type, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} className={`card ${isDragging ? 'dragging' : ''}`} style={{ opacity }} data-handler-id={handlerId}>
      <img src={`https://picsum.photos/id/${TYPE_TO_IMAGE_ID[doc.type] || 1005}/200/300`} alt={doc.title} />
      <h3>{doc.title}</h3>
    </div>
  );
};

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get<Document[]>("/api/fetch/documents");
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const moveCard = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setDocuments((prevDocs) => {
      const newDocs = [...prevDocs];
      const draggedDoc = newDocs[dragIndex];
      newDocs.splice(dragIndex, 1);
      newDocs.splice(hoverIndex, 0, draggedDoc);
      return newDocs.map((doc, index) => ({ ...doc, position: index }));
    });
    setHasChanges(true);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        {loading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <div className="grid">
            {documents.map((doc, index) => (
              <DraggableCard key={doc.type} doc={doc} index={index} moveCard={moveCard} />
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
