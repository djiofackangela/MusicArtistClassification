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



Phase 5 – Authentication, Authorization & MFA (README Content)
Overview

In Phase 5, I implemented full user authentication, role-based authorization, and email-based multi-factor authentication (OTP verification) into the MusicArtistClassification application. This phase secures both the backend and frontend by ensuring only authenticated and authorized users can access sensitive routes such as adding artists, viewing profiles, or managing favorites.

This phase also introduces user-specific features such as a Favorites system, allowing logged-in users to save and manage their favorite artists.
All authentication is implemented using JWT tokens, and OTP-based MFA is incorporated during login.

 1. Authentication Features Implemented
1.1 User Registration

Added /users/register endpoint.

Allows creation of new users with:

email

password

role (admin or user)

Passwords are securely hashed using bcrypt before being stored.

Prevents duplicate accounts.

1.2 Login + Email-Based OTP MFA

Implemented /users/login route:

Validates email + password.

Generates a 6-digit OTP using a random number generator.

Stores OTP + expiration timestamp in the user document.

Sends OTP by simulated email (printed in backend console).

Implemented /users/verify-login route:

Confirms email + OTP.

Invalid or expired OTP rejects login.

On success → returns JWT token containing:

user ID

email

role

This fulfills the MFA requirement.

1.3 Token Storage & Automatic Authorization

JWT token is stored in browser localStorage.

Token is automatically attached to all protected API requests via Axios.

Logout clears the token and resets the authentication context.

 2. Authorization & RBAC (Role-Based Access Control)
2.1 Roles Implemented

admin

user

2.2 Authentication Middleware (Backend)

authenticate.js:

Checks for a valid Bearer <token> header.

Verifies token using JWT.

Attaches decoded user info to req.user.

2.3 Role-Based Middleware

requireRole.js:

Accepts allowed roles (e.g., requireRole("admin"))

Ensures only users with those roles can access the route.

Returns 403 Forbidden if access is denied.

 3. Updated Route Protection
Public Routes (No Token Required)
Route	Purpose
GET /artists	List all artists
Protected Routes (Any Logged-In User)
Route	Purpose
GET /users/me	View logged-in user profile
GET /users/favorites	List user’s favorite artists
POST /users/favorites/:id	Add favorite artist
DELETE /users/favorites/:id	Remove favorite artist
Admin-Only Routes
Route	Purpose
POST /artists	Add new artist
PUT /artists/:id	Edit artist
DELETE /artists/:id	Delete artist

All admin routes require both:

Valid JWT token

role: "admin"

This fully satisfies RBAC requirements.

 4. Frontend Authentication Flow
4.1 Login Page

Form accepts email + password.

On success → OTP screen.

4.2 OTP Verification Page

User enters OTP from backend console.

On success:

Receives JWT token

Auth context is updated

User is redirected to Home page

4.3 Auth Context

Stores:

token

email

role

Automatically updates Axios headers:

Authorization: Bearer <token>


Manages login + logout behavior.

4.4 Protected UI Elements

Favorites page visible only when logged in.

Profile page visible only when logged in.

Add Artist page visible only for admin users.

Logged-out users cannot access protected routes (redirect to login).

 5. Favorites Feature (Extra Feature Beyond Requirements)

To enhance the user experience and make the app more professional, I added a full Favorites system:

Backend

Added favorites array to User model.

Endpoints:

GET /users/favorites

POST /users/favorites/:artistId

DELETE /users/favorites/:artistId

Populates favorite artists using Mongoose relations.

Frontend

Favorite button added to each artist card:

★ Add to Favorites

★ Remove from Favorites

"My Favorites" page displays the user’s saved artists.

Only shown when logged in (ProtectedRoute).

This feature goes beyond the lab requirements and demonstrates full-stack integration.

 6. Phase 5 Testing Completed
Authentication Tests

✔ Successful login (correct credentials → valid OTP → JWT)

✔ Incorrect password → login rejected

✔ Incorrect OTP → login rejected

✔ OTP expiry tested

Authorization Tests

✔ Accessing protected routes without token → rejected

✔ Accessing admin-only routes as normal user → 403 Forbidden

✔ Accessing admin-only routes as admin → success

✔ Add Artist page visible only to admins

Frontend Visibility Tests

✔ Logged-out users cannot see protected pages

✔ Logged-in users can view Favorites/Profile

✔ Admin users see Add Artist link

Token Handling Tests

✔ Axios automatically includes Authorization header

✔ Logging out removes token and hides protected links

 7. Summary of Phase 5 Deliverables

Implemented full authentication (register + login + OTP MFA)

Implemented JWT-based session handling

Implemented RBAC with admin and user roles

Secured backend routes with middleware

Added protected pages and UI restrictions to frontend

Added Favorites feature to enhance functionality

Added user profile page

Performed complete multi-scenario testing

Updated README with all Phase 5 details