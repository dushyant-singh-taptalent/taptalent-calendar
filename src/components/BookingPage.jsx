import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text, Paper, LoadingOverlay, Box, Avatar } from '@mantine/core';
import axios from 'axios';
import { IconClock, IconCalendarEvent } from '@tabler/icons-react';
import { clientId, aurinkoBaseUrl } from '../config';
import BookingCalendar from './BookingCalendar';
import BookingModal from './BookingModal';

const BookingPage = () => {
  const { profileName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${aurinkoBaseUrl}/${clientId}/${profileName}/meeting`);
        setBookingData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (profileName) {
      fetchBookingData();
    }
  }, [profileName]);

  const handleSelectTimeSlot = (slot) => {
    setSelectedTimeSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTimeSlot(null);
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Paper p="lg" radius="md" shadow="sm" withBorder>
          <Text c="red">{error}</Text>
        </Paper>
      </Container>
    );
  }

  if (!bookingData) {
    return (
      <Container size="md" py="xl">
        <Paper p="lg" radius="md" shadow="sm" withBorder>
          <Text>No booking data available.</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container 
      size="lg" 
      py="xl" 
      style={{
        maxWidth: '1100px',
      }}
    >
      {/* Header with meeting info */}
      <Box mb="xl" style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          size="xl" 
          radius="xl" 
          color="blue" 
          style={{ marginRight: 24 }}
        >
          <IconCalendarEvent size={32} />
        </Avatar>
        <Box>
          <Title order={1} size="h3" style={{ marginBottom: 8 }}>{bookingData.subject}</Title>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
            <Text size="sm">{bookingData.durationMinutes} minutes</Text>
          </Box>
        </Box>
      </Box>

      <BookingCalendar
        availableSlots={bookingData.items || []}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSelectTimeSlot={handleSelectTimeSlot}
      />

      <BookingModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        selectedTimeSlot={selectedTimeSlot}
        bookingData={bookingData}
        profileName={profileName}
      />
    </Container>
  );
};

export default BookingPage; 