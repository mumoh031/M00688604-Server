M00688604-Server

Express.js back-end for the After School lessons app (CST3144 coursework).
It stores lessons, orders and teachers in MongoDB Atlas and is hosted on render.com.

Links
- GitHub repository: https://github.com/mumoh031/M00688604-Server
- All lessons on render.com: https://m00688604-server.onrender.com/lessons
- Front-end on GitHub Pages: https://mumoh031.github.io/mevn-frontend/

Routes
- GET /lessons - returns all lessons as JSON
- GET /search?q=text - returns lessons whose subject, location, price or spaces contain the text
- POST /orders - saves a new order
- DELETE /orders/:_id - deletes an order (used by the Postman tests)
- PUT /lessons/:_id - updates any field of a lesson, e.g. availableInventory
- GET /teachers - returns all teachers
- GET /teachers/:_id/lessons - returns the lessons taught by one teacher
- POST /teachers - creates a teacher
- DELETE /teachers/:_id - deletes a teacher
- GET /enrolment/:lessonid - returns how many spaces of a lesson have been bought
- GET /images/:file - returns a lesson image, or "Image not found!" if it doesn't exist

Middleware
- Logger: prints the time, method, URL, status code and response time of every request.
- Static files: serves the lesson images in staticFiles at /images.

Running locally
1. npm install
2. Create config.env containing URI=<your MongoDB Atlas connection string>
3. npm start (runs on port 8080 unless PORT is set)
