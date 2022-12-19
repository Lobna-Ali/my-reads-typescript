import React, { useEffect, useState } from "react";
import { search, update } from "../BooksAPI";
import BookShelf from "../common/components/book-shelf/bookShelf";
import { Link } from 'react-router-dom';

function Search(props) {
  const [booksAfterSearch, setBooksAfterSearch] = useState([]);
  const [dataFromMyReads, setDataFromMyReads] = useState(props.books || []);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (searchValue) {
      const searcList = async () => {
        const result = await search(searchValue, 20);
        if (!result.hasOwnProperty('error') && result.length > 0) {
          const enrichedResult = enrichBooksWithShelf([...result]);
          setBooksAfterSearch([...enrichedResult]);
        } else {
          setBooksAfterSearch(new Array());
        }
      }
      searcList();
      } else if (!searchValue) {
        setBooksAfterSearch(new Array());
      }
     

  }, [searchValue, dataFromMyReads]);

  /**
   * set search string value
   * @param value 
   */
  const setSearchInput = (value) => {
    setSearchValue(value)

  }

  /**
   * update selected data with the right shelf
   * @param selectedData 
   */
  const updatedBook = async (selectedData) => {
    const selectedBook = { ...selectedData.selectedBook, shelf: selectedData.selectedOption };
    const indexOfMyReadsBook = dataFromMyReads.findIndex(el => el.id === selectedData.selectedBook.id);
    if (indexOfMyReadsBook > - 1) {
      dataFromMyReads[indexOfMyReadsBook] = selectedBook;
    } else {
      dataFromMyReads.push(selectedBook);
    }
    setDataFromMyReads([...dataFromMyReads]);

    booksAfterSearch[booksAfterSearch.findIndex(el => el.id === selectedBook.id)] = selectedBook;
    setBooksAfterSearch([...booksAfterSearch]);
    await update(selectedData.selectedBook, selectedData.selectedOption);
  }

  /**
   * enrich books from search with the one already added for the user
   * @param searchResults 
   */
  const enrichBooksWithShelf = (searchResults) => {
    dataFromMyReads.forEach((book) => {
      searchResults[searchResults.findIndex(el => el.id === book.id)] = {...book};
    });
    
    return searchResults;
  }
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link
          className="close-search"
          to='/'
          onClick={() => {

            props.onBooksUpdated([]);
          }}
        >
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search by title, author, or ISBN"
          />
        </div>
      </div>
      <div>
        <div className="search-books-results">
          <BookShelf onMovingBook={updatedBook} search={true} books={booksAfterSearch} />
        </div>
      </div>
    </div>
  )
}
const SearchMemo = React.memo(Search);
export default SearchMemo;