import "./App.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import MyReadsMemo from "./my-reads/myReads";
import SearchMemo from "./search/search";
import { useState } from "react";
import React from "react";

/** App Main Component */
function App() {
  const [books, setBooks] = useState([]);

  /** Set State for Books */
  const setBooksData = React.useCallback((books) => {
    setBooks(books);
  }, [])


  /**
   * App Routes, the read route and the Search one
   * @returns Routes
   */
  const App = () => {
    let routes = useRoutes([
      { path: "/", element: <MyReadsMemo onBooksUpdated={setBooksData} books={books} /> },
      { path: "/search", element: <SearchMemo onBooksUpdated={setBooksData} books={books} /> }
    ]);
    return routes;
  };
  return (

    <div className="app">
      <Router>
        <App data-testid="appId" />
      </Router>
    </div>
  );

}

/** Default App */
export default App;
