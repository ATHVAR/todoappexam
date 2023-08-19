const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;


app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://AthiraJayavarma:Pihoomaitreyi@cluster0.ledhl3s.mongodb.net/Database2', {

  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);
app.get('/api/todos', async (req, res) => {
  try {
    // Fetch todos from the database
    const todos = await Todo.find();

    // Send the todos as a response
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
