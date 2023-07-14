import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const CheckNews = () => {
  const [feedsData, setFeedsData] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedOption, setSelectedOption] = useState(''); // New state for selected option
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state




  useEffect(() => {
    fetchFeedsData(); // Fetch feeds data on component mount
  }, []);

  useEffect(() => {
    if (feedsData.length > 0 && selectedOption === '') {
      setSelectedOption(feedsData[0].metadata.title); // Set the first option as the default selected option
      handleOptionChange({ target: { value: feedsData[0].metadata.title } }); // Call handleOptionChange manually

    }
  }, [feedsData]);

  const fetchFeedsData = () => {
    axios.get('http://localhost:5000/api/feeds')
      .then(response => {
        setFeedsData(response.data);
        setSuggestions(response.data.map(feed => feed.metadata.title));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  
  const handleCheckNews = () => {
    setIsLoading(true); // Set loading state to true
    axios.post('http://localhost:5000/api/feeds/refresh')
      .then(response => {
        setFeedsData(response.data);
        setSuggestions(response.data.map(feed => feed.metadata.title));
        setSelectedFeed(null);
        setIsLoading(false); // Set loading state to false

      })
      .catch(error => {
        console.error(error);
        setIsLoading(false); // Set loading state to false in case of error

      });
  };

  const handleOptionChange = e => {
    setSelectedOption(e.target.value);
    const selected = feedsData.find(feed => feed.metadata.title === e.target.value);
    setSelectedFeed(selected);
  };



  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };


  return (
    <div>
    <section id="nav-bar">


<nav className="navbar navbar-expand-lg bg-body-tertiary">
<div className="container-fluid">
  <a className="navbar-brand" href="./userDetails"><img src="images/Talan2.png" /></a>
  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <i className="fa fa-bars"></i>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav ms-auto">
    <li className="nav-item">
        <a className="nav-link"href="./telegram"> <img src="images/telegram.png"  style={{ width: '30px', height: '30px', marginRight: '5px' }}/></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" style={{ fontWeight: 600 }} >{window.localStorage.getItem("name")}</a>
      </li>
      <li className="nav-item">
        <a>
      <button onClick={logOut} className="btn btn-clear btn-cr">
          Log Out
        </button></a>
      </li>
    </ul>
  </div>
</div>
</nav>	
</section>
    <div className="check-news-container">
    <h1 className="creative-title">SecureBytes: Unveiling the Latest Cyber Security News</h1>
      <div className="option-bar">
      <select value={selectedOption} onChange={handleOptionChange} className="option-input">
            <option value="">Select a website title...</option>
            {feedsData.map(feed => (
              <option key={feed.metadata.title} value={feed.metadata.title}>
                {feed.metadata.title}
              </option>
            ))}
          </select>
      </div>

      <button
        onClick={handleCheckNews}
        className="check-button"
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? 'Loading...' : 'Check News'}
      </button>

      <div className="feed-container">
          {selectedFeed ? (
            <div className="feed-card">
              <h3 className="feed-title">{selectedFeed.metadata.title}</h3>
              <div className="metadata">
                <p>{selectedFeed.metadata.description}</p>
                <p>{selectedFeed.metadata['published-date']}</p>
              </div>

              <div className="entries">
                {selectedFeed.entries.map(entry => (
                  <div key={entry.title} className="blog">

                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                      onClick={() => handleLinkClick(entry.link)}
                    >
                    <h4>{entry.title}</h4>
                    </a>
                    <p>{entry.updated}</p>
                  </div>
                ))}
              </div>
            </div>
        ) : (
          <p className="no-feed">No feed selected. Please search for a feed title.</p>
        )}
      </div>
    </div>
    <section id="footer">
<div className="container">
<div className="row">
</div>
<hr/>
<p className="copyright">Talan Threat Intelligence Framework </p>
</div>

</section>
    </div>
  );
};

export default CheckNews;
