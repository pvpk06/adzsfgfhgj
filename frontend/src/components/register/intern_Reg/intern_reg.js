import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextField,
  MenuItem,
  Button,
  Select,
  Box,
  Typography,
  InputLabel,
  FormControl,
  Divider,
  FormLabel,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Paper,
  CircularProgress,
  Stack, useTheme,
  InputAdornment,
  colors,
} from '@mui/material';


import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FaFileSignature } from "react-icons/fa";
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import apiService from '../../../apiService';
import { toast } from 'react-toastify';

const InternRegistration = ({ setSelectedView }) => {
  const navigate = useNavigate();
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const theme = useTheme();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full Name is required *')
      .matches(
        /^[A-Za-z]+ [A-Za-z]+$/,
        'Full Name must consist of a first name and a last name, separated by a space, and should contain only letters'
      ),
      email: Yup.string()
      .matches(emailRegex, 'Invalid email format')
      .required('Email is required *'),

    mobileno: Yup.string().required('Mobile number is required').matches(/^[6-9][0-9]{9}$/, 'Must be a valid 10-digit number'),
    altmobileno: Yup.string().required('Alternative mobile number is required').matches(/^[6-9][0-9]{9}$/, 'Must be a valid 10-digit number'),
    address: Yup.string().required('Address is required'),
    batchno: Yup.string().required('Batch number is required'),
    modeOfInternship: Yup.string().required('This field is required'),
    belongedToVasaviFoundation: Yup.string().required('This field is required'),
    domain: Yup.string().required('Please select your domain'),
  });

  const handleFormSubmit = (values, { setSubmitting }) => {
    setRegistrationDetails(values);
    setOpenConfirmModal(true);
    setSubmitting(false);
  };


  const handleConfirmSubmit = async () => {
    try {
      const response = await apiService.post('/api/register/intern', registrationDetails);
      toast.success('Registered successfully!', { autoClose: 5000 });
      setOpenConfirmModal(false);
      setOpenSuccessModal(true);
      setCountdown(10);
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
    }
  };

  useEffect(() => {
    if (openSuccessModal && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setOpenSuccessModal(false);
      setSelectedView("home");
      navigate('/');
    }
  }, [openSuccessModal, countdown, navigate, setSelectedView]);

  const handleCloseModal = () => {
    setOpenSuccessModal(false);
  };

  const ConfirmationModal = ({ open, onClose, onConfirm, registrationDetails }) => {
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="confirmation-modal-title"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '600px' },
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography
              id="confirmation-modal-title"
              variant="h6"
              component="h2"
              style={{ color: "#013356" }}
              sx={{
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              Confirm Registration Details
            </Typography>
          </Box>

          {/* Content */}
          <Box
            sx={{
              p: 3,
              overflowY: 'auto',
              flexGrow: 1
            }}
          >
            {registrationDetails ? (
              <Stack spacing={2}>
                <DetailRow label="Full Name" style={{ color: "#013356" }} value={registrationDetails.fullName} />
                <DetailRow label="Email" style={{ color: "#013356" }} value={registrationDetails.email} />
                <DetailRow label="Mobile No" style={{ color: "#013356" }} value={registrationDetails.mobileno} />
                <DetailRow label="Alternative Mobile No" style={{ color: "#013356" }} value={registrationDetails.altmobileno} />
                <DetailRow label="Address" style={{ color: "#013356" }} value={registrationDetails.address} />
                <DetailRow label="Batch No" style={{ color: "#013356" }} value={registrationDetails.batchno} />
                <DetailRow label="Domain" style={{ color: "#013356" }} value={registrationDetails.domain} />
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                  Loading details...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                px: 3,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Edit
            </Button>
            <Button
              onClick={onConfirm}
              style={{ backgroundColor: "#013356" }}
              variant="contained"
              sx={{
                px: 3,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Confirm & Submit
            </Button>
          </Box>
        </Paper>
      </Modal>
    );
  };


  const DetailRow = ({ label, value }) => (
    <Box sx={{
      '&:last-child': {
        borderBottom: 'none'
      }
    }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            {label}:
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            {value || "—"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );


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
                <strong>Batch No:</strong> {registrationDetails.batchno}
              </Typography>
              <Typography>
                <strong>Mode of Internship:</strong> {registrationDetails.modeOfInternship}
              </Typography>
              <Typography>
                <strong>Belonged to Vasavi Foundation:</strong> {registrationDetails.belongedToVasaviFoundation}
              </Typography>
              <Typography>
                <strong>Domain:</strong> {registrationDetails.domain}
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

  return (
    <div className="intern_reg_container">
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          mobileno: '',
          altmobileno: '',
          address: '',
          batchno: '',
          modeOfInternship: '',
          belongedToVasaviFoundation: '',
          domain: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-100 intern_reg_section" autoComplete="off">
            <div style={{ display: "flex", gap: "10px" }}>
              <h2 className="intern_reg_section_title">
                Intern Registration Form
              </h2>
              <i style={{ fontSize: "17px" }}> <FaFileSignature /> </i>
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
                type='email'
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
                  <MenuItem value="Python Full Stack">Full Stack Python</MenuItem>
                  <MenuItem value="Java Full Stack">Full Stack Java</MenuItem>
                  <MenuItem value="Mern Full Stack">Mern Full Stack</MenuItem>
                  <MenuItem value="Testing Tools">Testing Tools</MenuItem>
                  <MenuItem value="Scrum Master">Scrum Master</MenuItem>
                  <MenuItem value="Businesses Analyst">Businesses Analyst</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                  <MenuItem value="Cyber Security">Cyber Security</MenuItem>

                </Field>
                <ErrorMessage name="domain" component="div" className="error-message" />
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
                <InputLabel required>Mode of Internship</InputLabel>
                <Field
                  as={Select}
                  label="Mode of Internship"
                  name="modeOfInternship"
                  fullWidth
                  required
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Field>
                <ErrorMessage name="modeOfInternship" component="div" className="error-message" />
              </FormControl>
            </div>
            <div className="intern_reg_form_group">
              <FormControl component="fieldset">
                <FormLabel component="legend" required>Belonged to Vasavi Foundation</FormLabel>
                <Field
                  as={RadioGroup}
                  name="belongedToVasaviFoundation"
                  row
                  required
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </Field>
                <ErrorMessage name="belongedToVasaviFoundation" component="div" className="error-message" />
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        registrationDetails={registrationDetails}
      />


      {/* Success Modal */}
      {/* <SuccessModal
        open={openSuccessModal}
        onClose={handleCloseModal}
        registrationDetails={registrationDetails}
      /> */}

    </div>
  );
};

export default InternRegistration;
