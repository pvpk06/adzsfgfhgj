import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  Paper,
  CircularProgress,
  Dialog
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; // Importing toast
import apiService from '../../../apiService';

const AccessManagement = ({ hrId, onClose }) => {
  const [selectedAccess, setSelectedAccess] = useState({});
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: 'home', label: 'Home Dashboard' },
    { id: 'jobGallery', label: 'Job Gallery' },
    { id: 'lms', label: 'Learning Management' },
    { id: 'quiz', label: 'Quiz Management' },
    { id: 'internRequests', label: 'Internship Requests' },
    { id: 'guestRequests', label: 'Guest Requests' },
    { id: 'internshipCertificate', label: 'Internship Certificates' },
    { id: 'offerLetter', label: 'Offer Letters' },
    { id: 'bulkRegister', label: 'Bulk Registration' },
    { id: 'profile', label: 'Profile Management' }
  ];

  useEffect(() => {
    const fetchCurrentAccess = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/api/hr_access/${hrId}`);
        const data = response.data.access;
        console.log(data);
        const accessObject = {};
        data.forEach(item => {
            console.log(item);
          accessObject[item] = true;
        });
        setSelectedAccess(accessObject);
      } catch (err) {
        toast.error('Failed to load current access settings'); // Show toast on error
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAccess();
  }, [hrId]);

  const handleToggleAccess = (menuId) => {
    setSelectedAccess(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleSaveAccess = async () => {
    try {
      setLoading(true);
      // Convert object back to array of selected items
      const selectedItems = Object.entries(selectedAccess)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      await apiService.put(`/api/hr_access/${hrId}`, {
        accessRights: selectedItems
      });

      toast.success('Access rights updated successfully'); // Show success toast
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      toast.error('Failed to update access settings'); // Show toast on error
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Manage Access Rights for {hrId}
          </Typography>
          <Button 
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormGroup>
            {menuItems.map((item) => (
              <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={!!selectedAccess[item.id]}
                    onChange={() => handleToggleAccess(item.id)}
                    disabled={loading}
                  />
                }
                label={item.label}
                sx={{ mb: 1 }}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAccess}
            disabled={loading}
            sx={{ 
              backgroundColor: '#1f2c39',
              '&:hover': {
                backgroundColor: '#2c3e50'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Box>

        {/* ToastContainer for displaying notifications */}
        <ToastContainer />
      </Paper>
    </Dialog>
  );
};

export default AccessManagement;
