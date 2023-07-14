import React from "react";
export default function UserHome({ userData }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  return (
    <div>
      <section id="nav-bar">


<nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#"><img src="images/Talan2.png" /></a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <i className="fa fa-bars"></i>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <a className="nav-link"  href="#top">HOME</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#services">SERVICES</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#about-us">ABOUT US</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#footer">CONTACT US</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" style={{ fontWeight: 600 }} >{userData.fname}</a>
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


<section id="banner">
<div className="container">
<div className="row">
<div className="col-md-6">
<p className="promo-title">Talan Threat Intelligence Framework</p>
<p>A powerful platform for threat intelligence and security analysis</p>
<img src="images/play.png" className="play-btn"/>
<a href="dashboard">
  <button type="button"className="btn btn-clear btn-creative" >Take a look</button></a>
  <span style={{ margin: '0 10px' }}></span>
  <a href="CveTable"><button type="button"className="btn btn-clear btn-creative" >Check CVE</button></a>
  <span style={{ margin: '0 10px' }}></span>
  <a href="checknews"><button type="button"className="btn btn-clear btn-creative" >Check News</button></a>
</div>
<div className="col-md-6 text-center">
<img src="images/ban (2).png" className="img-fluid"/>
</div>
</div>
</div>

<img src="images/wave1.png" className="bottom-img" />
</section>


<section id="services">
<div className="container text-center">
<h1 className="title">WHAT WE DO ?</h1>
<div className="row text-center">
<div className="col-md-4 services">
<img src="images/land.png" className="service-img"/>
<h4>Threatlandscape</h4>
<p>Explore the current threat landscape and stay updated with the latest threats</p>
</div>
<div className="col-md-4 services">
<img src="images/shar.png" className="service-img"/>
<h4>Sharing is Caring</h4>
<p>Collaborate with other security professionals by sharing threat intelligence</p>
</div>
<div className="col-md-4 services">
<img src="images/integ.png" className="service-img"/>
<h4>Integration</h4>
<p>Integrate our threat intelligence platform with your existing security systems</p>
</div>
</div>
<button type="button"className="btn btn-primary">All Services</button>
</div>
</section>



<section id="about-us">
<div className="container">
<h1 className="title text-center">WHY CHOOSE US?</h1>
<div className="row">
<div className="col-md-6 about-us">
<p className="about-title">Benefits of our Framework</p>
    <ul>
    <li>Allows organizations to anticipate and prepare for potential threats, enabling proactive defense measures rather than reacting after an attack has occurred</li>
    <li>Organizations gain a deeper understanding of the threat landscape, including emerging threats, attack techniques, and threat actors</li>
    <li>Empowers organizations to make strategic decisions by providing insights into the motivations, tactics, and capabilities of threat actors</li>
    <li>Helps organizations identify vulnerabilities in their infrastructure, software, or systems that threat actors may exploit</li>
    <li>Assists organizations in combating fraud by identifying patterns and indicators of compromise associated with fraudulent activities</li>
    <li>Sharing relevant threat information with employees, organizations can educate their workforce on potential risks, phishing scams, and best security practices, reducing the likelihood of successful social engineering attacks</li>
    <li>Organizations can demonstrate a commitment to protecting customer data and gain the trust of their stakeholders</li>
    </ul>
</div>
<div className="col-md-6">
<img src="images/network.png" className="img-fluid"/>
</div>
</div> 
</div>
</section>


<section id="social-media">
<div className="container text-center">
<p>FIND US ON SOCIAL MEDIA</p>
<div className="social-icons">
<a href="#"><img src="images/facebook-icon.png"/></a>
<a href="#"><img src="images/instagram-icon.png"/></a>
<a href="#"><img src="images/linkedin-icon.png"/></a>
<a href="#"><img src="images/twitter-icon.png"/></a>
</div>
</div>
</section>


<section id="footer">
<img src="images/wave2.png" className="footer-img"/>
<div className="container">
<div className="row">
<div className="col-md-6 footer-box">
<img src="images/Talan2.png"/>
<p>Our Threat Intelligence Framework is a powerful and comprehensive tool designed to enhance your organization's cybersecurity posture. It provides a centralized hub for gathering, analyzing, and visualizing threat intelligence data from various sources, empowering your security teams to proactively detect and mitigate potential threats.</p>
</div>
<div className="col-md-6 footer-box">
  <p><b>CONTACT US</b></p>
  <p><i className="fa fa-location-dot"></i>Talan Tunisie International, Charguia 1</p>
  <p><i className="fa fa-phone"></i>70 015 010</p>
  <p><i className="fa fa-envelope"></i>Talan@gmail.com</p>
</div>
</div>
<hr/>
<p className="copyright">Talan Threat Intelligence Framework </p>
</div>

</section>
    </div>
  );
}
