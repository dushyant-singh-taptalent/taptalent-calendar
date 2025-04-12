import { useState } from 'react';
import { Modal, TextInput, Button, Group, Box, Stack, Paper, Text, Title, Avatar } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { clientId, aurinkoBaseUrl } from '../config';
import { IconCalendarEvent } from '@tabler/icons-react';

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
      
      await axios.post(
        `${aurinkoBaseUrl}/${clientId}/${profileName}/meeting`,
        bookingPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
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
      setBookingError('Failed to book meeting. Please try again.');
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

  return (
    <Modal 
      opened={isOpen} 
      onClose={handleClose}
      title="Complete your booking"
      size="md"
      radius="md"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: 'var(--mantine-font-size-lg)',
        }
      }}
    >
      {selectedTimeSlot && (
        <Stack gap="md">
          {bookingSuccess ? (
            <Box style={{ padding: '20px 0', textAlign: 'center' }}>
              <Avatar color="green" size="xl" radius="xl" mx="auto" mb="md">
                <IconCalendarEvent size={32} />
              </Avatar>
              <Title order={3} size="h4" mb="xs">Meeting scheduled successfully!</Title>
              <Text c="dimmed" size="sm">A confirmation has been sent to your email</Text>
            </Box>
          ) : (
            <>
              <Paper p="md" radius="md" withBorder mb="md">
                <Stack gap="xs">
                  <Box>
                    <Text size="sm" fw={500} c="dimmed">Meeting</Text>
                    <Text fw={600}>{bookingData.subject}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" fw={500} c="dimmed">Date & Time</Text>
                    <Text>{format(parseISO(selectedTimeSlot.start), 'EEEE, MMMM d, yyyy')} at {format(parseISO(selectedTimeSlot.start), 'h:mm a')}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" fw={500} c="dimmed">Duration</Text>
                    <Text>{bookingData.durationMinutes} minutes</Text>
                  </Box>
                </Stack>
              </Paper>
              
              <TextInput
                label="Your Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={bookingLoading}
              />
              
              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={bookingLoading}
              />
              
              {bookingError && (
                <Text c="red">{bookingError}</Text>
              )}
              
              <Group justify="flex-end" mt="md">
                <Button 
                  variant="subtle" 
                  onClick={handleClose}
                  disabled={bookingLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSchedule}
                  disabled={!name || !email || bookingLoading}
                  loading={bookingLoading}
                >
                  Confirm booking
                </Button>
              </Group>
            </>
          )}
        </Stack>
      )}
    </Modal>
  );
};

export default BookingModal; 