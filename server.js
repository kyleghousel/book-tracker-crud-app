const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let books = [
  { id: 1, title: '1984', author: 'George Orwell', shelf: "Read" },
  { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', shelf: "Read" },
  { id: 3, title: `Assassin's Apprentice`, author: 'Robin Hobb', shelf: "TBR" }
];

// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

// POST new book
app.post('/books', (req, res) => {
  const { title, author, shelf } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    author,
    shelf
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.patch('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author, shelf } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (shelf !== undefined) book.shelf = shelf;

  console.log("PATCH body:", req.body);

  res.json(book); // <-- Important! Always return JSON here.
});

// DELETE a book by ID
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
