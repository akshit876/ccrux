# Document Grid Application

This application displays a grid of draggable document cards with images. Users can reorder the cards and view larger images by clicking on them.

# Frontend Role

I have built parts pertaining to the frontend of the application. As mentioned in the project description, the frontend is built with React and TypeScript.

Please evaluate for the frontend role.

## Detailed Project Creation Steps

1. **Project Initialization**

   - Created a new React project using Vite with TypeScript:
     ```
     npm create vite@latest document-grid-app -- --template react-ts
     ```
   - Intuition: Vite offers a faster development experience with hot module replacement and a simpler configuration compared to Create React App, making it a great choice for modern React applications.

2. **Cleaning Boilerplate**

   - Removed unnecessary files and code from the initial setup.
   - Intuition: Start with a clean slate to avoid confusion and unused code.

3. **Dependency Installation**

   - Installed necessary packages:
     ```
     npm install axios react-dnd react-dnd-html5-backend @types/react-dnd msw
     ```
   - Intuition:
     - axios: For making HTTP requests to the backend API.
     - react-dnd and react-dnd-html5-backend: To implement drag-and-drop functionality.
     - @types/react-dnd: TypeScript type definitions for react-dnd.
     - msw: Mock Service Worker for API mocking during development.

4. **Creating Interfaces**

   - Created `src/interfaces/Document.ts` to define the structure of document objects:
     ```typescript
     export interface Document {
       id: string;
       title: string;
       type: string;
       position: number;
     }
     ```
   - Intuition: Defining interfaces early helps in maintaining consistent data structures throughout the application.

5. **API Hook Implementation**

   - Created `src/hooks/useDocuments.ts` to handle document-related operations:
     ```typescript
     export const useDocuments = () => {
       // ... implementation details ...
     };
     ```
   - Implemented functions for fetching, updating, and auto-saving documents.
   - Intuition: Custom hooks encapsulate complex logic and state management, making components cleaner and more focused.

6. **Component Creation**

   - Implemented `DraggableCard` component in `src/components/DraggableCard.tsx`:
     ```typescript
     export const DraggableCard: React.FC<DraggableCardProps> = ({
       doc,
       index,
       moveCard,
     }) => {
       // ... implementation details ...
     };
     ```
   - Created `DocumentGrid` component in `src/components/DocumentGrid.tsx`:
     ```typescript
     export const DocumentGrid: React.FC = () => {
       // ... implementation details ...
     };
     ```
   - Intuition: Breaking the UI into smaller, reusable components improves maintainability and readability.

7. **Drag and Drop Implementation**

   - Set up React DnD in the main App component:

     ```typescript
     import { DndProvider } from "react-dnd";
     import { HTML5Backend } from "react-dnd-html5-backend";

     function App() {
       return (
         <DndProvider backend={HTML5Backend}>
           <DocumentGrid />
         </DndProvider>
       );
     }
     ```

   - Implemented drag and drop logic in `DraggableCard` and `DocumentGrid` components.
   - **Caveat**: For the drag-and-drop functionality, the drop is considered successful only if the dragged item is moved more than 50% of its size. This ensures a more intentional user experience.
   - Intuition: React DnD provides a flexible, declarative API for implementing drag and drop functionality.

8. **Styling**

   - Added CSS for the grid layout and card styling in `src/styles/DocumentGrid.css` and `src/styles/DraggableCard.css`.
   - Intuition: Separating styles into their own files keeps components clean and makes styles easier to manage.

9. **Auto-save Functionality**

   - Implemented auto-save logic in the `useDocuments` hook:

     ```typescript
     useEffect(() => {
       const saveInterval = setInterval(() => {
         saveDocuments();
       }, 5000);

       return () => clearInterval(saveInterval);
     }, [saveDocuments]);
     ```

   - Intuition: Using `useEffect` with `setInterval` allows for periodic saving without blocking the main thread.

10. **Loading and Saving Indicators**

    - Added loading spinner and last save time display in the `DocumentGrid` component:
      ```typescript
      {
        loading && <div className="loading-spinner">Loading...</div>;
      }
      {
        lastSaveTime && (
          <div className="last-save-time">
            Last saved: {formatTimeSince(lastSaveTime)}
          </div>
        );
      }
      ```
    - Intuition: Providing visual feedback improves user experience by keeping them informed about the application's state.

11. **Image Overlay Feature**

    - Created `ImageOverlay` component in `src/components/ImageOverlay.tsx`:
      ```typescript
      export const ImageOverlay: React.FC<ImageOverlayProps> = ({
        doc,
        onClose,
      }) => {
        // ... implementation details ...
      };
      ```
    - Implemented ESC key functionality to close the overlay:
      ```typescript
      useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            onClose();
          }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }, [onClose]);
      ```
    - Intuition: An image overlay provides a better viewing experience for users, and keyboard shortcuts enhance usability.

12. **Loading Indicator for Images**

    - Added a loading state to the `ImageOverlay` component:
      ```typescript
      const [imageLoaded, setImageLoaded] = useState(false);
      // ...
      {
        !imageLoaded && <div className="loading-spinner">Loading...</div>;
      }
      <img
        src={imageUrl}
        alt={doc.title}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? "block" : "none" }}
      />;
      ```
    - Intuition: Showing a loading indicator while the image loads provides a smoother user experience, especially for larger images or slower connections.

13. **Styling Enhancements**
    - Refined CSS for the image overlay and loading spinner in `src/styles/ImageOverlay.css`.
    - Intuition: Polishing the visual design enhances the overall user experience and makes the application feel more professional.

## Caveats

- **Mock Service Worker (MSW)**: The MSW will only work in development mode. Make sure to start the development server to test the application locally.
- **Drag and Drop Functionality**: The drop is considered successful only if the dragged item is moved more than 50% of its size. This is to ensure that users have a clear intention when reordering items.

## Features

- Drag and drop functionality for reordering documents
- Auto-save every 5 seconds
- Image overlay on click
- Close image overlay with ESC key
- Loading indicator for images

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/document-grid-app.git
   cd document-grid-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

1. Start the development server:

   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `build` directory.

## Technologies Used

- React
- TypeScript
- Vite (for project setup and development)
- react-dnd (for drag and drop functionality)
- axios (for API calls)
- Mock Service Worker (MSW) for API mocking during development

## Project Structure

- `src/components`: React components
- `src/hooks`: Custom React hooks
- `src/interfaces`: TypeScript interfaces
- `src/utils`: Utility functions and constants
- `src/styles`: CSS files
