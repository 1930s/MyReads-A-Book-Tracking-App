import React from 'react'
import { Switch, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'
import './App.css'

class BooksApp extends React.Component {
  state = {
    allBooks: [],
    filteredBooks: []
  }

  // Get all the books
  componentDidMount() {
    BooksAPI
      .getAll()
      .then((books) => {
        this.setState({ allBooks: books })
      })
  }

  // Search books with the search terms
  searchBooks = (query) => {
    if (query) {
      BooksAPI
        .search(query)
        .then((result) => {
          if (result.error !== 'empty query') {
            this.updateSearchedResult(result)
            this.setState({ filteredBooks: result })
          } else {
            this.setState({ filteredBooks: [] })
          }
        })
    } else {
      this.setState({ filteredBooks: [] })
    }
  }

  // Update when a shelf of the book is changed
  updateShelf = (book, shelf) => {
    BooksAPI
      .update(book, shelf)
      .then(updated => (BooksAPI.getAll().then((books) => {
        this.setState({ allBooks: books })
        this.updateSearchedResult(this.state.filteredBooks)
      })))
  }

  // Update state of the book on both pages
  updateSearchedResult = (values) => {
    for (let value of values) {
      for (let book of this.state.allBooks) {
        if (value.id === book.id) {
          value.shelf = book.shelf
        }
      }
    }
    this.setState({ filteredBooks: values })
  }

  render() {
    return (
      <div className="app">

        <Switch>
          <Route
            exact
            path="/"
            render={() => (<ListBooks
              books={this.state.allBooks}
              updateOption={(book, shelf) => this.updateShelf(book, shelf)} />)} />

          <Route
            path="/search"
            render={() => (
              <div >
                <SearchBooks
                  filteredBooks={this.state.filteredBooks}
                  searchBooks={(query) => this.searchBooks(query)}
                  updateOption={(book, shelf) => this.updateShelf(book, shelf)} />
              </div>
            )} />

        </Switch>
      </div>
    )
  }
}

export default BooksApp
