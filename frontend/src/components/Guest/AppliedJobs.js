import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import apiService from '../../apiService';
import { Card, Container, Row, Col } from 'react-bootstrap';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const guestID = Cookies.get('guestID');

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await apiService.get(`/api/guest-applied-jobs/${guestID}`);
      console.log("response :", response);
      if (Array.isArray(response.data)) {
        setAppliedJobs(response.data);
      } else {
        setAppliedJobs([]);
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };
  

  const getStatusColor = (status) => {
    if (status.toLowerCase() === 'eligible') return 'green';
    if (status.toLowerCase() === 'not-interested' || status.toLowerCase() === 'not-eligible') return 'red';
    return 'blue';
  };

  return (
    <Container>
      <h2 className="mb-4" style={{color:"white"}}>Applied Jobs</h2>
      <Row>
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <Col key={job.jobId} sm={12} md={6} lg={4} className="mb-4">
                <Card style={{ borderRadius: '10px', border: '1px solid 1e1f21', background:"#1e1f21" }}>
                <Card.Body>
                  <Card.Title style={{color:"white"}}>{job.jobRole}</Card.Title>
                  <Card.Text>
                    <strong>Job ID:</strong> {job.jobID}
                  </Card.Text>
                  <Card.Text>
                    <strong>Company Name:</strong> {job.companyName}
                  </Card.Text>
                  <Card.Text>
                    <strong>Applied On:</strong> {new Date(job.applied_on).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Posted By HR:</strong> {job.hrName}
                  </Card.Text>
                  <Card.Text>
                    <strong>HR Contact:</strong> {job.hrContact}
                  </Card.Text>
                  <span style={{display:"flex", gap:"5px"}}>
                  <strong style={{color:"white"}}>Status:</strong>
                  <Card.Text style={{ color: getStatusColor(job.status), fontWeight: 'bold' }}>
                     {job.status}
                  </Card.Text>
                  </span>
                  
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p style={{color:"white"}}>No jobs applied yet.</p>
        )}
      </Row>
    </Container>
  );
};

export default AppliedJobs;
