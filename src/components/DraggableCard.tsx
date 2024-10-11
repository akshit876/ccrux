import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Document } from "../interfaces/Document";
import { TYPE_TO_IMAGE_ID } from "../utils";

interface DraggableCardProps {
  doc: Document;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onImageClick: (doc: Document) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  doc,
  index,
  moveCard,
  onImageClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "card",
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
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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
    type: "card",
    item: () => {
      return { id: doc.type, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const handleImageClick = () => {
    onImageClick(doc);
  };

  return (
    <div
      ref={ref}
      className={`draggable-card ${isDragging ? "is-dragging" : ""}`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <img
        src={`https://picsum.photos/id/${
          TYPE_TO_IMAGE_ID[doc.type] || 1005
        }/200/300`}
        alt={doc.title}
        onClick={handleImageClick}
      />
      <h3>{doc.title}</h3>
    </div>
  );
};
