import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  Box,
  Typography,
  InputLabel,
  FormControl,
  FormLabel,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaFileSignature } from "react-icons/fa";

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import apiService from '../../../apiService';
import './guest_reg.css';

const GuestRegistration = ({ setSelectedView }) => {
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (registrationSuccess) {
      setOpenModal(true);
      const timer = setTimeout(() => {
        setSelectedView("home")
        navigate('/');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate]);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .matches(/^[A-Za-z ]*$/, 'Only alphabets are allowed for this field'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'invalid email format'),
    mobileno: Yup.string()
      .required('Mobile number is required')
      .matches(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6,7,8,9 and contain exactly 10 digits'),
    altmobileno: Yup.string()
      .required('Alternative mobile number is required')
      .matches(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6,7,8,9 and contain exactly 10 digits')
      .notOneOf([Yup.ref('mobileno')], 'mobile numbers should not match'),

      batchno: Yup.string()
      .required('Batch number is required')
      .matches(/^[0-9]+$/, 'Batch number can only numbers')
      .max(20, 'Batch number cannot be longer than 20 characters'),
    address: Yup.string()
      .required('Address is required')
      .min(10, 'Address must be at least 10 characters long')
      .max(100, 'Address cannot be longer than 100 characters'),
      modeOfTraining: Yup.string().required('Please select your mode of Training'),
    megadriveStatus: Yup.string().required('This field is required'),
    BelongedToVasaviFoundation: Yup.string().required('This field is required'),
    domain: Yup.string().required('Please select your domain'),
    program: Yup.string().required('Please select your program'),
    
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("values :", values);

      const response = await apiService.post('/api/register/guest', values);

      toast.success('Registered successfully!', { autoClose: 5000 });
      setRegistrationDetails(values);
      setRegistrationSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning(`${error.response.data.message}. ${error.response.data.suggestion}`);
      } else if (error.response && error.response.status === 401) {
        setSelectedView("home")
        toast.warning(`${error.response.data.message}.`);
      } else {
        console.error('Registration failed:', error);
        toast.error('Failed to register. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const SuccessModal = ({ open, onClose, registrationDetails }) => {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
      if (open && countdown > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
      } else if (countdown === 0) {
        onClose();
      }
    }, [open, countdown, onClose]);

    return (
      <Modal
        open={open}
        onClose={() => setSelectedView('home')}
        aria-labelledby="registration-success"
        aria-describedby="registration-success-details"
      >
        <Box
          sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: theme.palette.background.paper,
            border: '2px solid #000',
            borderRadius: 2, // rounded corners
            boxShadow: theme.shadows[5], // soft shadow
            p: 4,
            transition: 'all 0.3s ease-in-out', // smooth transition
            animation: 'fadeIn 0.5s', // fade-in animation
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setSelectedView('home')}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
                transition: 'color 0.3s',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {registrationDetails ? (
            <>
              <Typography
                sx={{
                  mt: 2,
                  fontFamily: theme.typography.fontFamily,
                  color: theme.palette.text.primary,
                }}
              >
                You have been successfully registered! <br />
                We will send your registration details to the admin, <br />
                you will receive a mail to <strong>{registrationDetails.email}</strong> once admin approves your registration.
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                }}
              >
                Registered Details:
              </Typography>
              <Typography>
                <strong>Full Name:</strong> {registrationDetails.fullName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {registrationDetails.email}
              </Typography>
              <Typography>
                <strong>Mobile No:</strong> {registrationDetails.mobileno}
              </Typography>
              <Typography>
                <strong>Alternative Mobile No:</strong> {registrationDetails.altmobileno}
              </Typography>
              <Typography>
                <strong>Address:</strong> {registrationDetails.address}
              </Typography>
              <Typography>
                <strong>Mode of Training:</strong> {registrationDetails.modeOfTraining}
              </Typography>
              <Typography>
                <strong>Program:</strong> {registrationDetails.program}
              </Typography>
              <Typography>
                <strong>Domain:</strong> {registrationDetails.domain}
              </Typography>
              <Typography>
                <strong>Batch No:</strong> {registrationDetails.batchno}
              </Typography>
              <Typography>
                <strong>Belonged To Vasavi Foundation:</strong> {registrationDetails.BelongedToVasaviFoundation}
              </Typography>
              <Typography>
                <strong>Mega Drive Status:</strong> {registrationDetails.megadriveStatus}
              </Typography>

            </>
          ) : (
            <Typography>
              No registration details available.
            </Typography>
          )}
          <Typography
            sx={{
              mt: 2,
              fontFamily: theme.typography.fontFamily,
              color: theme.palette.text.secondary,
            }}
          >
            Redirecting to the home page in {countdown} seconds...
          </Typography>
        </Box>
      </Modal>
    );
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="intern_reg_container">
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          mobileno: '',
          altmobileno: '',
          address: '',
          modeOfTraining: '',
          program:'',
          domain: '',
          batchno: '',
          megadriveStatus: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-100 intern_reg_section" autoComplete="off">
            <div style={{display:"flex", gap:"10px"}}>
            <h2 className="intern_reg_section_title"> 
              Guest Registration Form 
            </h2>
            <i style={{fontSize:"17px"}}> <FaFileSignature /> </i>
            </div>
            <div className="intern_reg_form_group">
              <Field
                as={TextField}
                label="Full Name"
                variant="outlined"
                className="intern_reg_input"
                name="fullName"
                fullWidth
                required
              />
              <ErrorMessage name="fullName" component="div" className="error-message" />
            </div>
            <div className="intern_reg_form_group">
              <Field
                as={TextField}
                label="Email"
                variant="outlined"
                className="intern_reg_input"
                name="email"
                fullWidth
                required
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <div className="intern_reg_form_group">
              <Field
                as={TextField}
                label="Mobile No"
                variant="outlined"
                className="intern_reg_input"
                name="mobileno"
                fullWidth
                required
                inputProps={{
                  maxLength: 10,
                  inputMode: 'numeric', // Ensures numeric keyboard on mobile devices
                  pattern: '[0-9]*' // Ensures only numbers are allowed
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="bg-secondary-subtle rounded p-2">+91</span>
                    </InputAdornment>
                  ),
                  className: 'fw-bold'
                }}
                onKeyPress={(e) => {
                  // Allow only digits (0-9)
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <ErrorMessage name="mobileno" component="div" className="error-message" />
            </div>
            <div className="intern_reg_form_group">
              <Field
                as={TextField}
                label="Guardian/Parent Mobile No"
                variant="outlined"
                className="intern_reg_input"
                name="altmobileno"
                fullWidth
                required
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="bg-secondary-subtle rounded p-2">+91</span>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <ErrorMessage name="altmobileno" component="div" className="error-message" />
            </div>
            <div className="intern_reg_form_group">
              <Field
                as={TextField}
                label="Address"
                variant="outlined"
                className="intern_reg_input"
                name="address"
                fullWidth
                required
              />
              <ErrorMessage name="address" component="div" className="error-message" />
            </div>

            <div className="intern_reg_form_group">
              <FormControl fullWidth>
                <InputLabel required>Domain</InputLabel>
                <Field
                  as={Select}
                  label="Domain"
                  name="domain"
                  fullWidth
                  required
                >
                  <MenuItem value="Cloud Data Engineer">Cloud Data Engineer</MenuItem>
                  <MenuItem value="Al & Data Science">AI & Data Science</MenuItem>
                  <MenuItem value="DevOps & Cloud Computing">DevOps & Clooud Computing</MenuItem>
                  <MenuItem value="Testing Tools">Testing Tools</MenuItem>
                  <MenuItem value="Project Management & Agile">Project Management & Agile</MenuItem>
                  <MenuItem value="Business Analyst">Business Analyst</MenuItem>
                  <MenuItem value="Cyber Security">Cyber Security</MenuItem>
                  <MenuItem value="SalesForce">Salesforce</MenuItem>
                  <MenuItem value="Full Stack Development">FullStack Development</MenuItem>
                  <MenuItem value="Medical Coding">Medical Coding</MenuItem>
                  <MenuItem value="Investment Banking">Investment Banking</MenuItem>
                  <MenuItem value="BI Reporting Tools">BI Reporting Tools</MenuItem>
                  <MenuItem value="Microsoft Dynamics">Microsoft Dynamics</MenuItem>
                  <MenuItem value="Service Now">Service Now</MenuItem>
                </Field>
                <ErrorMessage name="domain" component="div" className="error-message" />
              </FormControl>
            </div>

            <div className="intern_reg_form_group">
              <FormControl fullWidth>
                <InputLabel required>Program</InputLabel>
                <Field
                  as={Select}
                  label="Program"
                  name="program"
                  fullWidth
                  required
                >
                  <MenuItem value="Training">Training</MenuItem>
                  <MenuItem value="JOIP">JOIP</MenuItem>
                  <MenuItem value="Placement">Placement</MenuItem>

                </Field>
                <ErrorMessage name="program" component="div" className="error-message" />
              </FormControl>
            </div>


            <div className="intern_reg_form_group">
              <Field
                as={TextField}
                label="Batch No"
                variant="outlined"
                className="intern_reg_input"
                name="batchno"
                fullWidth
                required

                inputProps={{ 
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />
              <ErrorMessage name="batchno" component="div" className="error-message" />
            </div>




            <div className="intern_reg_form_group">
              <FormControl fullWidth>
                <InputLabel required>Mode of Training</InputLabel>
                <Field
                  as={Select}
                  label="Mode of Internship"
                  name="modeOfTraining"
                  fullWidth
                  required
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Field>
                <ErrorMessage name="modeOfTraining" component="div" className="error-message" />
              </FormControl>
            </div>


            <div className="intern_reg_form_group">
              <FormControl component="fieldset">
                <FormLabel component="legend" required>Belonged To Vasavi Foundation</FormLabel>
                <Field
                  as={RadioGroup}
                  name="BelongedToVasaviFoundation"
                  row
                  required
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </Field>
                <ErrorMessage name="megadriveStatus" component="div" className="error-message" />
              </FormControl>
            </div>
 


            <div className="intern_reg_form_group">
              <FormControl component="fieldset">
                <FormLabel component="legend" required>Mega Drive Status</FormLabel>
                <Field
                  as={RadioGroup}
                  name="megadriveStatus"
                  row
                  required
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Qualified" />
                  <FormControlLabel value="No" control={<Radio />} label="Not Qualified" />
                </Field>
                <ErrorMessage name="megadriveStatus" component="div" className="error-message" />
              </FormControl>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="intern_reg_submit_button"
            >
              {isSubmitting ? 'Submitting...' : 'Register'}
            </Button>
          </Form>
        )}
      </Formik>

      <SuccessModal
        open={openModal}
        onClose={handleCloseModal}
        registrationDetails={registrationDetails}
      />
    </div>
  );
};

export default GuestRegistration;

