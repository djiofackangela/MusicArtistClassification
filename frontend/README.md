Frontend Features Implemented


1- Artist Listing Page (Home Page)

Fetches all artists from the backend using Axios.

Requests a higher limit so that all artists stored in MongoDB become visible.

Displays each artist in a card-style layout with custom CSS styling.

Shows a message if no artists exist or if an API error occurs.

2- Add Artist Page

A complete form that allows the user to insert a new music artist into the system.

Features:

Input fields for:

Name

Genres (comma-separated, converted to array)

Country

Popularity Score (optional)

Client-side validation blocks empty required fields.

On success:

Artist is stored in MongoDB Atlas

Success message appears

Form clears automatically

On failure:

A user-friendly error message appears

3- Routing Between Pages

Implemented using React Router:

Path	Page
/	ArtistList (Home)
/add	AddArtist (form)

Navigation links at the top allow the user to switch between screens seamlessly.

4- API Integration

All API communication is handled through a separate api.js file:

baseURL: http://localhost:3000


This ensures a clean separation between UI and backend logic.
Every artist added through the frontend immediately appears in MongoDB Atlas under:

Database: MusicArtistClassification
Collection: artists

5- User Interface and Styling

A custom CSS theme was created inside App.css to make the interface visually appealing. Styling includes:

Modern gradient headers

Card-grid layout for artists

Smooth hover animations

Rounded borders and soft shadows

Responsive design for smaller screens

The UI is simple, clean, and fully aligned with the music-themed aesthetic of the project.

6- Testing Performed for Phase 4

Verified that the Home page retrieves and displays all artists from MongoDB.

Tested form validation for required fields.

Successfully added multiple artists and confirmed:

They appear instantly on the frontend

They are stored in the MongoDB Atlas cluster

Confirmed backend and frontend communication over Axios.

Ensured the full application runs using:

npm run dev (backend)

npm start (frontend)