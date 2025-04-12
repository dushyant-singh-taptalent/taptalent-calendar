import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text, Paper, LoadingOverlay, Box, Avatar, Image } from '@mantine/core';
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
        minHeight: 'calc(100vh - 120px)', // Leave room for footer
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box style={{ flex: 1 }}>
        {/* Meeting information */}
        <Paper
          p="xl"
          radius="md"
          mb="xl"
          style={{
            background: 'linear-gradient(135deg, rgba(110, 88, 255, 0.05) 0%, rgba(137, 118, 255, 0.08) 100%)',
            border: '1px solid rgba(110, 88, 255, 0.1)',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Box
              style={{ 
                width: 50,
                height: 50,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6E58FF 0%, #8976FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 24,
                boxShadow: '0 4px 12px rgba(110, 88, 255, 0.25)'
              }}
            >
              <IconCalendarEvent size={26} color="white" stroke={1.5} />
            </Box>
            <Box>
              <Title order={3} style={{ marginBottom: 8, fontWeight: 600 }}>
                {bookingData.subject}
              </Title>
              <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconClock size={16} style={{ color: '#6E58FF' }} />
                <Text size="sm" style={{ color: 'rgba(0,0,0,0.7)' }}>
                  {bookingData.durationMinutes} minutes
                </Text>
              </Box>
            </Box>
          </Box>
        </Paper>

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
      </Box>
      
      {/* Footer with logo and branding */}
      <Box 
        mt={40} 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '16px 0',
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Image 
          src="/taptalent_logo.jpg" 
          alt="TapTalent Logo" 
          width={30}
          height={30}
          style={{ marginRight: 12, borderRadius: '6px' }}
        />
        <Text size="sm" style={{ fontWeight: 600, color: '#2A2A2A' }}>
          TapTalent Calendar
        </Text>
      </Box>
    </Container>
  );
};

export default BookingPage; 