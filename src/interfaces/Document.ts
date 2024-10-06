export interface Document {
  type: string;
  title: string;
  position: number;
}

export interface DraggableCardProps {
  doc: Document;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onImageClick: (doc: Document) => void;
}

export interface DragItem {
  index: number;
  id: string;
  type: string;
}
