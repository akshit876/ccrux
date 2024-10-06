import React, { useEffect, useCallback, useState } from "react";
import { Document } from "../interfaces/Document";
import { TYPE_TO_IMAGE_ID } from "../utils";

interface ImageOverlayProps {
  doc: Document | null;
  onClose: () => void;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({ doc, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setImageLoaded(false);
  }, [doc]);

  if (!doc) return null;

  const imageUrl = `https://picsum.photos/id/${
    TYPE_TO_IMAGE_ID[doc.type] || 1005
  }/800/600`;

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-container">
        {!imageLoaded && (
          <div className="loading-spinner" style={{ width: 800, height: 600 }}>
            Loading...
          </div>
        )}
        <img
          src={imageUrl}
          alt={doc.title}
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? "block" : "none" }}
        />
        {imageLoaded && <h2>{doc.title}</h2>}
      </div>
    </div>
  );
};
