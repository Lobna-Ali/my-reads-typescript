import React, { useEffect, useState } from 'react';
import { getAll, update } from '../BooksAPI'
import { useNavigate } from 'react-router-dom';
import BookShelf from '../common/components/book-shelf/bookShelf';

/**
 * My Reads component
 * @param props 
 * @returns JSx
 */
function MyReads(props) {
    const [data, setData] = useState(props.books || []);
    const [readedBooks, setReadedBooks] = useState([]);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [wantToRead, setWantToRead] = useState([]);
    const [forceUpdateDataAfterChange, setDataAfterChange] = useState(false);

    useEffect(() => {
        let isSubscribed = true;
        if ((data && data.length < 1 || forceUpdateDataAfterChange)) {
            const getAllData = async () => {
                const result: [] = await getAll();
                if (isSubscribed) {
                    setData([...result]);
                    setDetailsForBooks([...result]);
                    props.onBooksUpdated([...result]);
                    setDataAfterChange(false);
                }
            }
            getAllData();
        } else if (wantToRead.length < 1 || readedBooks.length < 1 || currentlyReading.length < 1) {
            setDetailsForBooks([...data]);
        }

        return () => { isSubscribed = false; }

    }, [data, forceUpdateDataAfterChange]);

    /**
     * categorize data returned from api based on the book shelf
     * @param booksList 
     */
    function setDetailsForBooks(booksList) {
        setWantToRead((booksList.filter((book) => book.shelf === 'wantToRead')))
        setCurrentlyReading((booksList.filter((book) => book.shelf === 'currentlyReading')))
        setReadedBooks((booksList.filter((book) => book.shelf === 'read')))

    }
    /**
     * set updated shelf for books
     * @param updateBookDetails 
     */
    const updateBookDetails = async (updateBookDetails) => {
        updateBookDetails.selectedBook.shelf = updateBookDetails.selectedOption;
        await update(updateBookDetails.selectedBook, updateBookDetails.selectedOption);
        setDataAfterChange(true);
    }

    const navigate = useNavigate();
    return (
        <div>
            {data && data.length < 1 || forceUpdateDataAfterChange ? (
                <div className="spinner"><img src={require('../icons/spinner.gif')} alt="Loading ...." /> </div>) : (

                <div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                        <div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Currently Reading</h2>
                                <BookShelf onMovingBook={updateBookDetails} books={currentlyReading} />

                            </div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Want to Read</h2>
                                <BookShelf onMovingBook={updateBookDetails} books={wantToRead} />
                            </div>
                            <div className="bookshelf">
                                <h2 className="bookshelf-title">Read</h2>
                                <BookShelf onMovingBook={updateBookDetails} books={readedBooks} />

                            </div>
                        </div>
                    </div>
                    <div className="open-search">
                        <a onClick={() => navigate('/search')}>Add a book</a>
                    </div>
                </div>
            )}
        </div>)
}
const MyReadsMemo = React.memo(MyReads)
export default MyReadsMemo;