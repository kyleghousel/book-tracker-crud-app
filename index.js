// const { createElement } = require("react");

const endpoint = 'http://localhost:3000/books'
const form = document.querySelector('#book-form')
const content = document.querySelector('#content-area')
const dropdown = document.querySelector('#mode-select')
const bookSearchDiv = document.querySelector('#book-search-div')
const bookAddDiv = document.querySelector('#book-add-div')
const bookDeleteDiv = document.querySelector('#book-delete-div')
const bookEditDiv = document.querySelector('#book-edit-div')
const addTitle = document.querySelector('#title-add')
const addAuthor = document.querySelector('#author-add')
const addShelf = document.querySelector('#shelf-add')
const addEditId = document.querySelector('#edit-book')
const editTarget = document.querySelector('#edit-target')
const addEditValue = document.querySelector('#edit-book-value')

document.addEventListener("DOMContentLoaded", () => {
  getAndDisplayBooks(endpoint)
  getDropdownValue()
})

form.addEventListener("submit", (e) => {
  e.preventDefault()
    if (dropdown.value === 'add') {
    addBook(endpoint)
    } else if (dropdown.value === 'edit') {
      editBook(endpoint)
    } else if (dropdown.value === 'delete') {
      deleteBook(endpoint)
    }
})

dropdown.addEventListener('change', () => getDropdownValue())

const getDropdownValue = () => {
  if (dropdown.value === 'search') {
    bookSearchDiv.classList.remove('hidden')
    bookAddDiv.classList.add('hidden')
    bookDeleteDiv.classList.add('hidden')
    bookEditDiv.classList.add('hidden')
  } else if (dropdown.value === 'add') {
    bookAddDiv.classList.remove('hidden')
    bookDeleteDiv.classList.add('hidden')
    bookSearchDiv.classList.add('hidden')
    bookEditDiv.classList.add('hidden')
  } else if (dropdown.value === 'delete') {
    bookAddDiv.classList.add('hidden')
    bookDeleteDiv.classList.remove('hidden')
    bookSearchDiv.classList.add('hidden')
    bookEditDiv.classList.add('hidden')
  } else if (dropdown.value === 'edit') {
    bookAddDiv.classList.add('hidden')
    bookDeleteDiv.classList.add('hidden')
    bookSearchDiv.classList.add('hidden')
    bookEditDiv.classList.remove('hidden')
  }
}

const getAndDisplayBooks = (url) => {
  content.innerHTML = ''

  fetch(url)
    .then(res => res.json())
    .then(data => {
      data.forEach(book => {
        const bookDiv = document.createElement('div')
        bookDiv.setAttribute('class', 'book-div')
        content.appendChild(bookDiv)
        const bookTitle = document.createElement('h3')
        const bookAuthor = document.createElement('p')
        const shelf = document.createElement('p')
        const id = document.createElement('p')
        shelf.setAttribute('class', 'shelf-tag')
        bookTitle.textContent = book.title
        bookAuthor.textContent = `Author: ${book.author}`
        shelf.textContent = `Shelf: ${book.shelf}`
        id.textContent = `Book ID: ${book.id}`
        bookDiv.appendChild(bookTitle)
        bookDiv.appendChild(bookAuthor)
        bookDiv.appendChild(shelf)
        bookDiv.appendChild(id)
      })
    })
  }

const addBook = (url) => {

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      title: addTitle.value,
      author: addAuthor.value,
      shelf: addShelf.value
    })
  })
    .then(res => res.json())
    .then(data => {

      addTitle.value = ''
      addAuthor.value = ''
      addShelf.value = ''

      getAndDisplayBooks(endpoint)
    })
    .catch(err => console.log('Error: ' + err.message));
}

const editBook = (url) => {
  const idInput = addEditId.value
  const editSelect = editTarget.value
  const editValue = addEditValue.value.trim()
  let editObject = {}
  console.log(idInput)
  console.log(editSelect)
  console.log(editValue)

  if (editSelect === 'title') {
    editObject = {
      title: editValue
    }
  } else if (editSelect === 'author') {
    editObject = {
      author: editValue
    }
  } else if (editSelect === 'shelf') {
    editObject = {
      shelf: editValue
    }
  } else {
    console.log('Something went wrong.')
  }

  fetch(`http://localhost:3000/books/${idInput}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(editObject)
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Server error: ${response.status} - ${text}`);
        });
      }
      return response.json();
    })
    .then(updatedBook => {
      console.log("Updated Book:", updatedBook);
      getAndDisplayBooks(url)
    })
    .catch(error => {
      console.error("Error updating book:", error);
    });
}

const deleteBook = (url) => {
  const idInput = document.querySelector('#deleted-book').value

  fetch(`http://localhost:3000/books/${idInput}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(deletedBook => {
      console.log(`${deletedBoo.title} was deleted.`)
      getAndDisplayBooks(url)
      document.querySelector('#deleted-book').value = ''
    })
    .catch(error => {
      console.log('Something went wrong:', error)
    })
}
