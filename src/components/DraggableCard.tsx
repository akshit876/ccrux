import React, { useRef, useState, useCallback } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import {
  DraggableCardProps,
  DragItem,
} from "../interfaces/Document";
import { TYPE_TO_IMAGE_ID } from "../utils";

export const DraggableCard: React.FC<DraggableCardProps> = ({
  doc,
  index,
  moveCard,
  onImageClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOver, setIsOver] = useState(false);

  const handleImageClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onImageClick(doc);
  }, [doc, onImageClick]);

  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
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


      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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

  return (
    <div
      ref={ref}
      className={`card ${isDragging ? "dragging" : ""} ${
        isOver ? "highlight" : ""
      }`}
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
      {isOver && <div className="reorder-indicator">Will be reordered</div>}
    </div>
  );
};
