import React, { useState, useRef, useEffect } from 'react';
// import { Container, Button, Grid, Card, CardContent, Typography, TextField, Avatar, Divider } from '@mui/material';
import { Camera, Mail, Phone, MapPin, BookOpen, Users, User2 } from 'lucide-react';
import { Form, Row, Col } from 'react-bootstrap';
import avatar2 from '../images/avatar2.avif';
import Cookies from 'js-cookie';
import apiService from '../../apiService';
import { toast } from 'react-toastify';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    candidateID: '',
    fullName: '',
    email: '',
    mobileNo: '',
    altMobileNo: '',
    domain: '',
    belongedToVasaviFoundation: '',
    address: '',
    batchNo: '',
    modeOfInternship: '',
    profile_img: '',

  });
  const [originalFormData, setOriginalFormData] = useState({});
  const [profileImage, setProfileImage] = useState(avatar2);
  const fileInputRef = useRef(null);

  const internID = Cookies.get("internID");

  useEffect(() => {
    console.log('Fetching profile data for internID:', internID);
    apiService.get(`/api/intern_data/${internID}`)
      .then(response => {
        console.log('Response status:', response.status);
        return response.data;
      })
      .then(data => {
        console.log('Fetched data:', data);
        if (Array.isArray(data) && data.length > 0) {
          const profileData = data[0];

          const newFormData = {
            candidateID: profileData.candidateID,
            fullName: profileData.fullName,
            email: profileData.email,
            mobileNo: profileData.mobileNo,
            altMobileNo: profileData.altMobileNo,
            domain: profileData.domain,
            belongedToVasaviFoundation: profileData.belongedToVasaviFoundation,
            address: profileData.address,
            batchNo: profileData.batchNo,
            modeOfInternship: profileData.modeOfInternship,
            profile_img: profileData.profile_img
          };

          setFormData(newFormData);
          setOriginalFormData(newFormData);
          // Set profile image if available
          if (profileData.profile_img) {
            console.log("profileData.profile_img :", profileData.profile_img);
            setProfileImage(`https://backend.ramanasoft.com:5000/uploads/profiles/${profileData.profile_img}`);
          }
        }
      })
      .catch(error => console.error('Error fetching profile data:', error));
  }, [internID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Prepare for upload
      const formDataWithImage = new FormData();
      formDataWithImage.append('profile_image', file);

      // Upload the image
      apiService.post(`/api/upload-profile-image/${internID}`, formDataWithImage)
        .then(response => {
          setFormData(prev => ({ ...prev, profile_img: response.data.filename }));
          toast.success('Profile image uploaded successfully!');
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload profile image');
          // Revert to previous image if upload fails
          if (formData.profile_img) {
            setProfileImage(`https://backend.ramanasoft.com:5000/uploads/profiles/${formData.profile_img}`);
          } else {
            setProfileImage(avatar2);
          }
        });
    }
  };



  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 20px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
    },
    header: {
      // background: 'linear-gradient(135deg, #013356 0%, #013356 100%)',
      background:"#1e1f21",
      padding: '3rem 2rem',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
    },
    avatarContainer: {
      position: 'relative',
      width: '150px',
      height: '150px',
      margin: '0 auto',
    },
    avatar: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      border: '4px solid white',
      objectFit: 'cover',
      backgroundColor: '#f3f4f6',
    },
    cameraButton: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      backgroundColor: '#013356',
      border: '1px white solid',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    content: {
      padding: '2rem',
    },
    nameSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    name: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
    },
    button: {
      padding: '0.5rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    primaryButton: {
      backgroundColor: '#1e1f21',
      color: 'white',
      '&:hover': {
        backgroundColor: '#4338ca',
      },
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      '&:hover': {
        backgroundColor: '#e5e7eb',
      },
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    fieldGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#4f46e5',
      },
      '&:disabled': {
        backgroundColor: '#f9fafb',
        cursor: 'not-allowed',
      },
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    icon: {
      color: '#013356',
    },
  };


  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleSave = async () => {
    const updatedProfile = {
      fullName: formData.fullName,
      email: formData.email,
      mobileNo: formData.mobileNo,
      altMobileNo: formData.altMobileNo,
      domain: formData.domain,
      belongedToVasaviFoundation: formData.belongedToVasaviFoundation,
      address: formData.address,
      batchNo: formData.batchNo,
      modeOfInternship: formData.modeOfInternship,
      profile_img: formData.profile_img,
    };

    try {
      const response = await apiService.put(`/api/intern_data/${internID}`, updatedProfile);
      console.log("Profile updated successfully:", response.data);
      toast.success('Updated successfully!', {
        autoClose: 5000
      });
      setIsEditing(false);
      setOriginalFormData(formData);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning(`${error.response.data.message}. ${error.response.data.suggestion}`);
      } else if (error.response && error.response.status === 401) {
        toast.warning(`${error.response.data.message}.`);
      } else {
        console.error('Update failed:', error);
        toast.error('Update failed. Please try again later.');
      }
    }
  };


  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatarContainer}>
            <img
              src={profileImage}
              alt="Profile"
              style={styles.avatar}
            />
            {/* {isEditing && ( */}
            <button
              style={styles.cameraButton}
              onClick={() => fileInputRef.current.click()}
            >
              <Camera size={20} />
            </button>
            {/* )} */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.nameSection}>
            <h1 style={styles.name}>{formData.fullName}</h1>
            {/* <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div> */}
          </div>

          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <div style={styles.infoItem}>
                <User2 size={20} style={styles.icon} />
                <input
                  style={styles.input}
                  name="candidateID"
                  value={formData.candidateID}
                  disabled
                  placeholder="Candidate ID"
                />
              </div>

              <div style={styles.infoItem}>
                <Mail size={20} style={styles.icon} />
                <input
                  style={styles.input}
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="Email"
                />
              </div>

              <div style={styles.infoItem}>
                <Phone size={20} style={styles.icon} />
                <input
                  style={styles.input}
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  // disabled={!isEditing}
                  disabled
                  placeholder="Mobile Number"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              {/* <div style={styles.infoItem}>
              <Phone size={20} style={styles.icon} />
              <input
                style={styles.input}
                name="altMobileNo"
                value={formData.altMobileNo}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Parent/Guardian Mobile"
              />
            </div> */}

              <div style={styles.infoItem}>
                <BookOpen size={20} style={styles.icon} />
                <input
                  style={styles.input}
                  name="domain"
                  value={formData.domain}
                  disabled
                  placeholder="Domain"
                />
              </div>

              <div style={styles.infoItem}>
                <Users size={20} style={styles.icon} />
                <input
                  style={styles.input}
                  name="batchNo"
                  value={formData.batchNo}
                  onChange={handleChange}
                  // disabled={!isEditing}
                  disabled
                  placeholder="Batch Number"
                />
              </div>
            </div>
          </div>

          <div style={styles.infoItem}>
            <MapPin size={20} style={styles.icon} />
            <input
              style={styles.input}
              name="address"
              value={formData.address}
              onChange={handleChange}
              // disabled={!isEditing}
              disabled
              placeholder="Address"
            />
          </div>
        </div>
      </div>
    </div>

    // <Container style={{ margin: "none" }}>
    //   <Card sx={{ width: 1000, height: 700 }} style={{ marginTop: '30px', padding: '20px', background: "none", border: "none" }}>
    //     <Grid container spacing={4} >
    //       <Grid item xs={12} md={4} style={{ textAlign: 'center' }} sx={{ width: 1000, height: 700, margin: 'auto', mb: 2 }}>
    //         <Avatar
    //           src={profileImage}
    //           alt="Profile"
    //           sx={{ width: 200, height: 200, margin: 'auto', mb: 2 }}
    //         />
    //         {isEditing && (
    //           <Button
    //             variant="contained"
    //             color="primary"
    //             onClick={() => fileInputRef.current.click()}
    //           >
    //             Upload New Photo
    //           </Button>
    //         )}
    //         <input
    //           type="file"
    //           ref={fileInputRef}
    //           style={{ display: 'none' }}
    //           accept="image/*"
    //           onChange={(e) => {
    //             // Handle image change
    //           }}
    //         />
    //       </Grid>

    //       {/* Profile Information Section */}
    //       <Grid item xs={12} md={8}>
    //         <CardContent>
    //           <div style={{ display: 'flex' }}>
    //             <Typography variant="h5" gutterBottom>
    //               {formData.fullName || 'Full Name'}
    //             </Typography>

    //             <Button
    //               variant="contained"
    //               color="primary"
    //               onClick={isEditing ? handleSave : handleEdit}
    //               sx={{ mt: 3, mr: 2 }}
    //             >
    //               {isEditing ? 'Save' : 'Edit'}
    //             </Button>
    //             {isEditing && (
    //               <Button
    //                 variant="outlined"
    //                 color="secondary"
    //                 onClick={handleCancel}
    //                 sx={{ mt: 3 }}
    //               >
    //                 Cancel
    //               </Button>
    //             )}
    //           </div>
    //           <Divider sx={{ mb: 2 }} />

    //           <Grid container spacing={2}>
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 label="Candidate ID"
    //                 value={formData.candidateID}
    //                 fullWidth
    //                 disabled
    //               />
    //             </Grid>
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 label="Email"
    //                 value={formData.email}
    //                 fullWidth
    //                 disabled
    //               />
    //             </Grid>
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 label="Mobile Number"
    //                 name="mobileNo"
    //                 value={formData.mobileNo}
    //                 fullWidth
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //               />
    //             </Grid>
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 label="Parent/Guardian Mobile Number"
    //                 name="altMobileNo"
    //                 value={formData.altMobileNo}
    //                 fullWidth
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //               />
    //             </Grid>
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 label="Domain"
    //                 value={formData.domain}
    //                 fullWidth
    //                 disabled
    //               />
    //             </Grid>
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 label="Batch Number"
    //                 name="batchNo"
    //                 value={formData.batchNo}
    //                 fullWidth
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //               />
    //             </Grid>
    //             <Grid item xs={12}>
    //               <TextField
    //                 label="Address"
    //                 name="address"
    //                 value={formData.address}
    //                 fullWidth
    //                 onChange={handleChange}
    //                 disabled={!isEditing}
    //               />
    //             </Grid>
    //           </Grid>
    //         </CardContent>
    //       </Grid>
    //     </Grid>
    //   </Card>
    // </Container>
  );
};



export default Profile;