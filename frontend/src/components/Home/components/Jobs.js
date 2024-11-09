import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { FaAngleRight } from 'react-icons/fa';
import apiService from '../../../apiService';
import { toast } from 'react-toastify';

const ViewJobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date();
  const noofCols = selectedJob ? 2 : 3;

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const filtered = jobs.filter(job =>
        (job.jobId && job.jobId.toString().includes(searchQuery)) ||
        (job.jobTitle && job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.jobRole && job.jobRole.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.Location && job.Location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredJobs(filtered);

      // Set selectedJob if there's a matching job ID in the URL
      if (id) {
        const job = jobs.find(job => job.jobId.toString() === id);
        setSelectedJob(job || null);
      }
    }
  }, [jobs, searchQuery, id]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const fetchJobs = async () => {
    try {
      const response = await apiService.get("/api/view-jobs");
      const sortedJobs = response.data.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
      setJobs(sortedJobs);
      setFilteredJobs(sortedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    // Instead of navigating, just update the URL to include the job ID
    navigate(`/jobs/${job.jobId}`, { replace: true });
  };

  const handleApplyNow = () => {
    toast.warning("Login to continue applying");
    navigate('/login');
  };

  const isJobOpen = (lastDate) => currentDate <= new Date(lastDate);

  return (
    <Container className="my-4">
      <Row>
        {/* Job List Section */}
        <Col xs={selectedJob ? 12 : 6} md={selectedJob ? 6 : 12} style={{
          height: selectedJob ? '800px' : 'auto',
          overflowY: selectedJob ? 'auto' : 'unset',
        }}>
          <h1 style={{ color: "white" }}>Available Jobs</h1>
          <TextField
            variant="outlined"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            style={{ color: "white", border: "1px solid white", marginBottom: "20px" }}
            InputProps={{
              style: {
                color: "white",
              },
            }}
            inputProps={{
              style: {
                color: "white",
              },
              placeholder: "Search jobs..."
            }}
            sx={{
              '& .MuiInputBase-input::placeholder': {
                color: 'white', // Placeholder text color
              },
            }}
          />

          <Row xs={1} sm={1} md={2} lg={noofCols}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <Col key={job.jobId} style={{ marginBottom: "20px" }}>
                  <div className="card h-100" style={{
                    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 8px 0 rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    border:"2px solid white",
                    background: "none",
                    color: "white",
                    padding: '5px',
                  }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="card-title fw-bold">{job.companyName}</h5>
                          <p className="card-subtitle mb-2">{job.jobTitle}</p>
                        </div>
                        {new Date(job.lastDate) < currentDate && (
                          <span style={{ color: isJobOpen(job.lastDate) ? 'inherit' : 'red', fontWeight: isJobOpen(job.lastDate) ? '' : 'bold' }}>
                            {isJobOpen(job.lastDate) ? '' : 'Closed'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p><strong>Job ID:</strong> {job.jobId}</p>
                        <p><strong>Location: </strong>{job.Location}</p>
                        <p><strong>Posted By: </strong>{job.name}</p>
                        <p><strong>Date Posted: </strong>{formatDate(job.postedOn)}</p>
                      </div>
                      <div className="d-flex justify-content-end mt-4">
                        <button onClick={() => handleJobClick(job)} className="btn btn-outline-secondary">
                          <FaAngleRight /> Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <p style={{color:"white", height:"260px"}}>No jobs available</p>
            )}
          </Row>
        </Col>

        {selectedJob && (
          <Col xs={12} md={6} style={{ padding: '20px', position: 'relative', color:"whitesmoke" }}>
            <button onClick={() => setSelectedJob(null)} className="btn btn-secondary mb-3" style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <h3 className='text-center fw-bold text-decoration-underline mb-4' >Job Description</h3>
            <div className='border p-4 rounded shadow-lg mt-3'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h1 className='fw-bold'>{selectedJob.companyName}</h1>
                <span className={`badge ${isJobOpen(selectedJob.lastDate) ? 'bg-success' : 'bg-danger'}`}>
                  {isJobOpen(selectedJob.lastDate) ? 'Open' : 'Closed'}
                </span>
              </div>
              <p><strong>Job ID:</strong> {selectedJob.jobId}</p>
              <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
              <p><strong>Job Category:</strong> {selectedJob.jobCategory}</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>City:</strong> {selectedJob.Location}</p>
              <p><strong>Experience:</strong> {selectedJob.jobExperience}</p>
              <p><strong>Qualification:</strong> {selectedJob.jobQualification}</p>
              <p><strong>Salary:</strong> {selectedJob.salary}</p>
              <p><strong>Description:</strong> {selectedJob.jobDescription}</p>
              <p><strong>Posted On:</strong> {formatDate(selectedJob.postedOn)}</p>
              <p><strong>Last Date:</strong> {formatDate(selectedJob.lastDate)}</p>
              <h5 className='fw-bold text-danger mb-3'>Posted by: {selectedJob.name}</h5>
              <div className='text-center mt-4'>
                <button className='btn btn-primary px-4 py-2' onClick={handleApplyNow}>Apply Now</button>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ViewJobs;

