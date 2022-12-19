
import ChangerDropdown from "../changer-dropdown/changerDropdown";

function BookShelf(props) {
  const { books } = props;
console.log(books, ' books')
  const onOptionChange = (value, selectedBook) => {
    props.onMovingBook({
      selectedOption: value,
      selectedBook
    })
  }
  return (

    <div className="bookshelf-books">
      <ol className="books-grid">
        {books && books.length > 0 ? (books.map((book, index) => {
          // console.log(book)
          return (
            <li key={index}>
              <div className="book">
                <div className="book-top">
                  <div
                    className="book-cover"
                    style={{
                      width: 128,
                      height: 193,
                      backgroundImage:
                        `url(${book.imageLinks? book.imageLinks.thumbnail: ''})`,
                    }}
                  ></div>
                  <ChangerDropdown search = {props.search} selectedOption={onOptionChange} book={book} key={index} />
                </div>
                <div className="book-title"> {book.title}</div>
                <div className="book-authors">{book.authors && book.authors.join(", ")}</div>
              </div>
            </li>
          )
        })) : null}
      </ol>
    </div>
  )
}

export default BookShelf;