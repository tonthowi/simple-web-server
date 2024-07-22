// Import the express module
const express = require('express');

// Import the cors module to handle Cross-Origin Resource Sharing
const cors = require('cors');

// Create an instance of express
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// Parse incoming JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Initialize an array of notes with some default values
let notes = [
    {
      id: "1",
      content: "HTML is hard",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
];

// Define a route for the root URL that responds with a simple HTML message
app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>');
});

// Define a route to get all notes
app.get('/api/notes', (request, response) => {
    response.json(notes); // Respond with the array of notes in JSON format
});

// Define a route to get a single note by its ID
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id; // Get the ID from the request parameters
    const note = notes.find(note => note.id === id); // Find the note with the matching ID
    
    if (note) {
        response.json(note); // Respond with the found note
    } else {
        response.status(404); // Set the status to 404 (Not Found)
        response.send('Note not found'); // Respond with a 'Note not found' message
    }
});

// Define a route to delete a note by its ID
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id; // Get the ID from the request parameters
    notes = notes.filter(note => note.id !== id); // Remove the note with the matching ID
    response.status(204).end(); // Respond with status 204 (No Content) and end the response
});

// Function to generate a new unique ID for a note
const generateId = () => {
    const MaxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id))) // Find the highest existing ID
        : 0;
    return String(MaxId + 1); // Return the next ID as a string
};

// Define a route to add a new note
app.post('/api/notes', (request, response) => {
    const body = request.body; // Get the body of the request

    if (!body.content) {
        return response.status(400).json({
            error: 'Content is missing'
        }); // If the content is missing, respond with status 400 (Bad Request) and an error message
    }

    // Create a new note object
    const note = {
        id: generateId(), // Generate a new ID
        content: body.content, // Get the content from the request body
        important: Boolean(body.important) || false // Get the importance from the request body, defaulting to false
    };

    notes = notes.concat(note); // Add the new note to the notes array
    
    response.json(note); // Respond with the new note in JSON format
});

// Define the port the server will listen on, defaulting to 3001 if not specified in environment variables
const PORT = process.env.PORT || 3001;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`); // Log a message when the server starts
});