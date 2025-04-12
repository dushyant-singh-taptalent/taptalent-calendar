import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { clientId, aurinkoBaseUrl, backendBaseUrl } from '../config';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  selectedTimeSlot, 
  bookingData, 
  profileName 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSchedule = async () => {
    if (!name || !email || !selectedTimeSlot) return;
    
    try {
      setBookingLoading(true);
      setBookingError(null);
      
      // Extract accountIds from the selected time slot
      const accountIds = selectedTimeSlot.accountIds || [];
      
      const bookingPayload = {
        name,
        email,
        time: {
          start: selectedTimeSlot.start,
          end: selectedTimeSlot.end
        },
        substitutionData: {},
        accountIds
      };
      
      // Call Aurinko API
      try {
        await axios.post(
          `${aurinkoBaseUrl}/${clientId}/${profileName}/meeting`,
          bookingPayload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (aurinkoError) {
        // Handle Aurinko-specific error
        if (aurinkoError.response && aurinkoError.response.data) {
          const { message, code } = aurinkoError.response.data;
          throw new Error(message || `Aurinko error: ${code}`);
        }
        throw aurinkoError;
      }
      
      // After successful Aurinko API call, call our backend API
      try {
        const backendResponse = await axios.post(
          `${backendBaseUrl}/calendar/bookings/${profileName}`,
          {
            name,
            email,
            time: {
              start: selectedTimeSlot.start,
              end: selectedTimeSlot.end
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Check if backend sends an error in the response
        if (backendResponse.data && backendResponse.data.error) {
          throw new Error(backendResponse.data.error);
        }
      } catch (backendError) {
        // Handle backend-specific error
        if (backendError.response && backendError.response.data && backendError.response.data.error) {
          throw new Error(backendError.response.data.error);
        }
        throw backendError;
      }
      
      setBookingSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setBookingSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error booking meeting:', err);
      setBookingError(err.message || 'Failed to book meeting. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setName('');
    setEmail('');
    setBookingError(null);
    setBookingSuccess(false);
    onClose();
  };

  // CSS variables for gradient and colors
  const primaryGradient = 'linear-gradient(135deg, #6E58FF 0%, #8976FF 100%)';
  const secondaryGradient = 'linear-gradient(135deg, rgba(110, 88, 255, 0.08) 0%, rgba(137, 118, 255, 0.08) 100%)';

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="booking-dialog-title"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          background: '#FFFFFF',
          position: 'relative',
          padding: 0
        }
      }}
    >
      {/* Top decorative gradient bar */}
      <Box
        sx={{
          height: '8px',
          width: '100%',
          background: primaryGradient,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      />
      
      {/* Close button (positioned absolute in top right) */}
      <IconButton 
        aria-label="close"
        onClick={handleClose}
        sx={{ 
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'rgba(0,0,0,0.5)',
          zIndex: 2,
          '&:hover': { 
            backgroundColor: 'rgba(110, 88, 255, 0.08)'
          }
        }}
      >
        <CloseIcon />
      </IconButton>
      
      {selectedTimeSlot && (
        <>
            {bookingSuccess ? (
            <Box 
              sx={{ 
                padding: '60px 40px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: secondaryGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 64,
                    color: '#6E58FF'
                  }}
                />
              </Box>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: '#2A2A2A',
                  mb: 2
                }}
              >
                Booking Confirmed!
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(0,0,0,0.6)',
                  maxWidth: '320px',
                  lineHeight: 1.6
                }}
              >
                Your meeting has been scheduled. A confirmation has been sent to your email with all details.
              </Typography>
            </Box>
          ) : (
            <>
              <DialogTitle 
                id="booking-dialog-title" 
                sx={{ 
                  pt: 5,
                  pb: 2,
                  px: 4,
                }}
              >
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#2A2A2A',
                    textAlign: 'center',
                  }}
                >
                  Complete Your Booking
                </Typography>
              </DialogTitle>
              
              <DialogContent sx={{ px: 4, pt: 2, pb: 4 }}>
                <Stack spacing={4}>
                  {/* Meeting Info Card */}
                  <Box
                    sx={{
                      background: secondaryGradient,
                      borderRadius: '16px',
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    <Box 
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(110, 88, 255, 0.1) 0%, rgba(137, 118, 255, 0.15) 100%)',
                        zIndex: 0
                      }}
                    />
                    
                    <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '12px',
                            background: primaryGradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EventNoteIcon sx={{ color: 'white', fontSize: 20 }}/>
              </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2A2A2A', ml: 1 }}>
                        {bookingData.subject}
                      </Typography>
                      </Stack>
                      
                      <Divider sx={{ opacity: 0.6 }} />
                      
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <CalendarTodayIcon sx={{ color: '#6E58FF', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(0,0,0,0.7)' }}>
                            {format(parseISO(selectedTimeSlot.start), 'EEEE, MMMM d, yyyy')}
                      </Typography>
                        </Stack>
                        
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <AccessTimeIcon sx={{ color: '#6E58FF', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(0,0,0,0.7)' }}>
                            {format(parseISO(selectedTimeSlot.start), 'h:mm a')} • {bookingData.durationMinutes} minutes
                      </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    </Box>
                  
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'rgba(0,0,0,0.7)',
                      fontSize: '0.95rem',
                      mt: 1
                    }}
                  >
                    Enter your details
                      </Typography>
                
                  {/* Form Fields */}
                  <Stack spacing={3}>
                <TextField
                      label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  disabled={bookingLoading}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: '#6E58FF' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6E58FF',
                            borderWidth: '1px',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(110, 88, 255, 0.5)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0,0,0,0.08)',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#6E58FF',
                        },
                        '& .MuiInputBase-input': {
                          padding: '14px 14px 14px 0',
                        }
                      }}
                />
                
                <TextField
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  disabled={bookingLoading}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: '#6E58FF' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6E58FF',
                            borderWidth: '1px',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(110, 88, 255, 0.5)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0,0,0,0.08)',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#6E58FF',
                        },
                        '& .MuiInputBase-input': {
                          padding: '14px 14px 14px 0',
                        }
                      }}
                    />
                  </Stack>
                
                {/* Error message removed from here */}
          </Stack>
        </DialogContent>
              
              <DialogActions 
                sx={{ 
                  px: 4, 
                  pb: 4,
                  pt: 1,
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                {/* Error message added here */}
                {bookingError && (
                  <Box
                    sx={{
                      background: 'rgba(211, 47, 47, 0.05)',
                      border: '1px solid rgba(211, 47, 47, 0.2)',
                      borderRadius: '12px',
                      p: 2,
                      mb: 2,
                      width: '100%'
                    }}
                  >
                    <Typography 
                      color="error" 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {bookingError}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button 
                    onClick={handleClose} 
                    disabled={bookingLoading}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                      color: 'rgba(0,0,0,0.6)',
                      fontSize: '0.95rem',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSchedule}
                    disabled={!name || !email || bookingLoading}
                    variant="contained"
                    disableElevation
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '12px',
                      py: 1.2,
                      px: 3.5,
                      background: primaryGradient,
                      color: 'white',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(110, 88, 255, 0.4)',
                        background: primaryGradient,
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        opacity: 0.6,
                        color: 'white'
                      }
                    }}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </DialogActions>
            </>
          )}
        </>
      )}
    </Dialog>
  );
};

export default BookingModal; 