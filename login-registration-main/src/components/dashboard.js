import React from "react";
export default function Dashboard({ userData }) {
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
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
<section id="kibana-dashboard">
<iframe src="http://localhost:5601/app/kibana#/dashboard/3e5872a0-0476-11ee-9aed-03e5b268fa40?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fw%2Cto%3Anow%2Fw))" height="1000" width={window.innerWidth}></iframe>

</section>



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
}
