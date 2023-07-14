import React, { useEffect, useState , useMemo } from 'react';
import axios from 'axios';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { TagCloud } from 'react-tagcloud';
import { debounce } from 'lodash';


const CveTable = () => {
  const [cveData, setCveData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [wordFrequencyData, setWordFrequencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: ''
  });
  const [cachedData, setCachedData] = useState({});
  const [maxPages] = useState(600); // Set the maximum number of pages
  



  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };


  useEffect(() => {
    fetchCveData();
    setSortConfig({ key: '', direction: '' });
  }, [currentPage, searchQuery]);

  useEffect(() => {
    calculateWordFrequency();
  }, [cveData]);

  const fetchCveData = async () => {
    setIsLoading(true);
    const cacheKey = `${currentPage}-${searchQuery}`;
  
    if (cachedData[cacheKey]) {
      // Use cached data
      const { data, totalPages } = cachedData[cacheKey];
      setCveData(data);
      setTotalPages(totalPages);
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.get(
        `https://services.nvd.nist.gov/rest/json/cves/1.0?resultsPerPage=${perPage}&startIndex=${(currentPage - 1) * perPage}&keyword=${searchQuery}`
      );
      const newData = response.data.result.CVE_Items || [];
      const newTotalPages = Math.min(Math.ceil(response.data.totalResults / perPage), maxPages);
  
      // Cache the data
      const updatedCachedData = {
        ...cachedData,
        [cacheKey]: {
          data: newData,
          totalPages: newTotalPages,
        },
      };
      setCachedData(updatedCachedData);
  
      setCveData(newData);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error('Error fetching CVE data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
    const formattedDate = date.toISOString().slice(0, 10);
      return formattedDate;
    }
    return 'N/A';
  };

  const renderTooltip = (title, values) => (
    <Tooltip id="cvss-tooltip">
      <strong>{title}</strong>
      <br />
      {values.map((value) => (
        <div key={value.key}>
          <strong>{value.key}: </strong>
          {value.value}
        </div>
      ))}
    </Tooltip>
  );

  const goToPage = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  const debouncedFetchCveData = useMemo(
    () =>
      debounce((query) => {
        setCurrentPage(1);
        setSearchQuery(query);
      }, 800),
    []
  );
  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    debouncedFetchCveData(query);
  };
  


  const sortedCveData = useMemo(() => {
    const data = [...cveData];
  
    if (sortConfig.key !== '') {
      data.sort((a, b) => {
        let aValue, bValue;
  
        switch (sortConfig.key) {
          case 'published':
            aValue = formatDate(a.cve.publishedDate?.date || a.publishedDate);
            bValue = formatDate(b.cve.publishedDate?.date || b.publishedDate);
            break;
          case 'lastModified':
            aValue = formatDate(a.cve.lastModifiedDate?.date || a.lastModifiedDate);
            bValue = formatDate(b.cve.lastModifiedDate?.date || b.lastModifiedDate);
            break;
          case 'baseScoreV2':
            aValue = a.impact?.baseMetricV2?.cvssV2?.baseScore || a.impact?.baseMetricV3?.cvssV2?.baseScore || 'N/A';
            bValue = b.impact?.baseMetricV2?.cvssV2?.baseScore || b.impact?.baseMetricV3?.cvssV2?.baseScore || 'N/A';
            if (aValue === 'N/A') aValue = Number.MIN_SAFE_INTEGER;
            if (bValue === 'N/A') bValue = Number.MIN_SAFE_INTEGER;
            break;
          case 'baseScoreV3':
            aValue = a.impact?.baseMetricV3?.cvssV3?.baseScore || 'N/A';
            bValue = b.impact?.baseMetricV3?.cvssV3?.baseScore || 'N/A';
            if (aValue === 'N/A') aValue = Number.MIN_SAFE_INTEGER;
            if (bValue === 'N/A') bValue = Number.MIN_SAFE_INTEGER;
            break;
          default:
            break;
        }
  
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    return data;
  }, [cveData, sortConfig]);
  


  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
  
    if (sortConfig.direction === 'asc') {
      return <i className="fa fa-sort-up sort-icon" />;
    }
  
    return <i className="fa fa-sort-down sort-icon" />;
  };
  

  const calculateWordFrequency = () => {
    const frequencyMap = {};
    cveData.forEach((item) => {
      const description = item.cve.description?.description_data[0]?.value;
      if (description) {
        const words = description.split(' ');
        words.forEach((word) => {
          const normalizedWord = word.toLowerCase();
          if (normalizedWord !== 'the' && normalizedWord !== 'a' && normalizedWord !== 'of' && normalizedWord !== 'this' && normalizedWord !== 'was'&& normalizedWord !== 'that' && normalizedWord !== 'is' && normalizedWord !== 'and' && normalizedWord !== 'by' && normalizedWord !== 'an' && normalizedWord !== 'as' && normalizedWord !== 'on' && normalizedWord !== 'for' && normalizedWord !== 'with' && normalizedWord !== 'on' && normalizedWord !== 'in' && normalizedWord !== 'been' && normalizedWord !== 'be' && normalizedWord !== 'to' && normalizedWord !== 'which' && normalizedWord !== 'can' && normalizedWord !== 'icon' && normalizedWord !== 'versions' && normalizedWord !== 'it' && normalizedWord !== 'have' && normalizedWord !== 'could' && normalizedWord !== 'are' && normalizedWord !== 'has' && normalizedWord !== 'via' && normalizedWord !== 'from' && normalizedWord !== 'version' && normalizedWord !== 'or' && normalizedWord !== 'when' && normalizedWord !== 'certain' && normalizedWord !== 'without' && normalizedWord !== 'might' && normalizedWord !== 'if' && normalizedWord !== 'any' && normalizedWord !== 'contains' && normalizedWord !== 'no' && normalizedWord !== 'not' && normalizedWord !== 'such' && normalizedWord !== 'due' && normalizedWord !== 'there' && normalizedWord !== 'will' && normalizedWord !== 'id:' && normalizedWord !== 'set' && normalizedWord !== 'does' && normalizedWord !== 'may' && normalizedWord !== 'its' && normalizedWord !== 'while') {
            if (frequencyMap[normalizedWord]) {
              frequencyMap[normalizedWord]++;
            } else {
              frequencyMap[normalizedWord] = 1;
            }
          }
        });
      }
    });
    const wordFrequency = Object.entries(frequencyMap)
      .map(([word, frequency]) => ({
        value: `${word} (${frequency})`,
        count: frequency,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
    setWordFrequencyData(wordFrequency);
  };




  const renderPagination = () => {
    const pages = [];
    const visiblePageCount = 5;
    let startPage = currentPage - Math.floor(visiblePageCount / 2);
    if (startPage < 1) {
      startPage = 1;
    }
    const endPage = startPage + visiblePageCount - 1 > totalPages ? totalPages : startPage + visiblePageCount - 1;
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? 'active' : ''}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {startPage > 1 && (
          <button onClick={() => goToPage(1)}>
            1
          </button>
        )}
        {startPage > 2 && (
          <span className="ellipsis">...</span>
        )}
        {pages}
        {endPage < totalPages - 1 && (
          <span className="ellipsis">...</span>
        )}
        {endPage < totalPages && (
          <button onClick={() => goToPage(totalPages)}>
            {totalPages}
          </button>
        )}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    );
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
    <div className="cve-table">
      <h2 className="creative-title">Vulnerabilities</h2>
      {wordFrequencyData.length > 0 && (
        <div className="word-frequency">
          <h3>Description Summary Word Frequency</h3>
          <TagCloud
            minSize={12}
            maxSize={35}
            tags={wordFrequencyData}
            onClick={(tag) => console.log('Clicked on tag:', tag)}

          />
        </div>
      )}
      <input
  type="text"
  placeholder="Search by CVE ID"
  value={searchQuery}
  onChange={handleSearchChange}
  className="form-control search-input"
/>
      {isLoading ? (
          <div className="skeleton-table">
            {/* Skeleton template */}
            <div className="skeleton-row">
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
            </div>
            <div className="skeleton-row">
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
            </div>
            <div className="skeleton-row">
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
            </div>
          </div>
        ) : (
      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Description</th>
            <th onClick={() => requestSort('published')}>Published {renderSortIcon('published')}</th>
            <th onClick={() => requestSort('lastModified')}>Last Modified {renderSortIcon('lastModified')}</th>
            <th onClick={() => requestSort('baseScoreV2')}>CVSS Score (v2) {renderSortIcon('baseScoreV2')}</th>
            <th onClick={() => requestSort('baseScoreV3')}>CVSS Score (v3) {renderSortIcon('baseScoreV3')}</th>
            <th>URL References</th>
          </tr>
        </thead>
        <tbody>
          {sortedCveData.map((item) => {
            const cve = item.cve;
            const publishedDate = formatDate(
              cve.publishedDate?.date || item.publishedDate
            );
            const lastModifiedDate = formatDate(
              cve.lastModifiedDate?.date || item.lastModifiedDate
            );
            const baseScoreV2 =
              item.impact?.baseMetricV2?.cvssV2?.baseScore ||
              item.impact?.baseMetricV3?.cvssV2?.baseScore ||
              'N/A';
            const baseScoreV3 =
              item.impact?.baseMetricV3?.cvssV3?.baseScore || 'N/A';

            const cvssV2Values = [
              { key: 'Attack Complexity', value: item.impact?.baseMetricV2?.cvssV2?.attackComplexity || 'N/A' },
              { key: 'Attack Vector', value: item.impact?.baseMetricV2?.cvssV2?.attackVector || 'N/A' },
              { key: 'Availability Impact', value: item.impact?.baseMetricV2?.cvssV2?.availabilityImpact || 'N/A' },
              { key: 'Base Severity', value: item.impact?.baseMetricV2?.cvssV2?.baseSeverity || 'N/A' },
              { key: 'Confidentiality Impact', value: item.impact?.baseMetricV2?.cvssV2?.confidentialityImpact || 'N/A' },
              { key: 'Integrity Impact', value: item.impact?.baseMetricV2?.cvssV2?.integrityImpact || 'N/A' },
              { key: 'Privileges Required', value: item.impact?.baseMetricV2?.cvssV2?.privilegesRequired || 'N/A' },
              { key: 'Scope', value: item.impact?.baseMetricV2?.cvssV2?.scope || 'N/A' },
              { key: 'User Interaction', value: item.impact?.baseMetricV2?.cvssV2?.userInteraction || 'N/A' },
              { key: 'Vector String', value: item.impact?.baseMetricV2?.cvssV2?.vectorString || 'N/A' },
              { key: 'Exploitability Score', value: item.impact?.baseMetricV2?.exploitabilityScore || 'N/A' },
              { key: 'Impact Score', value: item.impact?.baseMetricV2?.impactScore || 'N/A' },
            ];

            const cvssV3Values = [
              { key: 'Attack Complexity', value: item.impact?.baseMetricV3?.cvssV3?.attackComplexity || 'N/A' },
              { key: 'Attack Vector', value: item.impact?.baseMetricV3?.cvssV3?.attackVector || 'N/A' },
              { key: 'Availability Impact', value: item.impact?.baseMetricV3?.cvssV3?.availabilityImpact || 'N/A' },
              { key: 'Base Severity', value: item.impact?.baseMetricV3?.cvssV3?.baseSeverity || 'N/A' },
              { key: 'Confidentiality Impact', value: item.impact?.baseMetricV3?.cvssV3?.confidentialityImpact || 'N/A' },
              { key: 'Integrity Impact', value: item.impact?.baseMetricV3?.cvssV3?.integrityImpact || 'N/A' },
              { key: 'Privileges Required', value: item.impact?.baseMetricV3?.cvssV3?.privilegesRequired || 'N/A' },
              { key: 'Scope', value: item.impact?.baseMetricV3?.cvssV3?.scope || 'N/A' },
              { key: 'User Interaction', value: item.impact?.baseMetricV3?.cvssV3?.userInteraction || 'N/A' },
              { key: 'Vector String', value: item.impact?.baseMetricV3?.cvssV3?.vectorString || 'N/A' },
              { key: 'Exploitability Score', value: item.impact?.baseMetricV3?.exploitabilityScore || 'N/A' },
              { key: 'Impact Score', value: item.impact?.baseMetricV3?.impactScore || 'N/A' },
            ];

            return (
              <tr key={cve.CVE_data_meta.ID}>
                <td className="cve-id-column">{cve.CVE_data_meta.ID}</td>
                <td>{cve.description?.description_data[0]?.value}</td>
                <td className="cve-id-column">{publishedDate}</td>
                <td className="cve-id-column">{lastModifiedDate}</td>
                <td>
                <OverlayTrigger
  placement="auto"
  overlay={renderTooltip('CVSS Score (v2)', cvssV2Values)}
>
<span className={`cvss-score ${baseScoreV2 === 'N/A' ? 'na' : baseScoreV2 < 7 ? 'green' : 'red'}`}>
  {baseScoreV2}
</span>

</OverlayTrigger>
                </td>
                <td>
                <OverlayTrigger
  placement="auto"
  overlay={renderTooltip('CVSS Score (v3)', cvssV3Values)}
>
<span className={`cvss-score ${baseScoreV3 === 'N/A' ? 'na' : baseScoreV3 < 7 ? 'green' : 'red'}`}>
  {baseScoreV3}
</span>

</OverlayTrigger>

                </td>
                <td className="ref-column">
                  {cve.references?.reference_data.map((reference) => (
                    <div key={reference.url}>
                      <a href={reference.url}>{reference.url}</a>
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
      {renderPagination()}

    </div>
    <section id="footer-pages">
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

export default CveTable;
