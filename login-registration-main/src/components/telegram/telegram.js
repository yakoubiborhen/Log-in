import React, { useEffect, useState } from 'react';
import axios from 'axios';


const MessageComponent = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [isLoading, setIsLoading] = useState(true); // New loading state

  
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0 && selectedGroup === null) {
      setSelectedGroup(groups[0][0]); // Set the first groupName as the default selectedGroup
    }
  }, [groups]);

  const fetchGroups = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.get('http://localhost:5000/api/telegram');
      console.log(response.data); // Log the response to inspect its structure
      if (typeof response.data === 'object') {
        setGroups(Object.entries(response.data));
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false); // Set loading state to false after data fetching completes
    }
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
<h1 className="page-title">ThreatWatch: Explore Cyber Threat Intelligence Groups and Channels</h1>

<div className="message-container">
      <div className="group-filter">
        {groups.map(([groupName, messages]) => (
          <div
            key={groupName}
            className={`group-box ${groupName === selectedGroup ? 'selected' : ''}`}
            onClick={() => setSelectedGroup(groupName)}
          >
            {groupName}
          </div>
        ))}
      </div>
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        groups.map(([groupName, messages]) => (
          <div
            key={groupName}
            className={`group-container ${groupName === selectedGroup ? 'active' : ''}`}
          >
          <h3 className="group-title">{groupName}</h3>
          <div className="message-list">
            {messages.map((message, index) => (
              <div key={index} className="message-card">
                <p className="description">{message.description}</p>
                <p className="timestamp">{message.timestamp}</p>
                <a href={message.reference} target="_blank" rel="noopener noreferrer" className="reference-link">
                  {message.reference}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))
    )}
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

export default MessageComponent;
