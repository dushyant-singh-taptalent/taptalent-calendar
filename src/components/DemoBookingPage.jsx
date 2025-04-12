import { useState } from 'react';
import { Container, Title, Text, Paper, Box, Image } from '@mantine/core';
import { addDays } from 'date-fns';
import BookingCalendar from './BookingCalendar';
import DemoBookingModal from './DemoBookingModal';
import { IconClock, IconCalendarEvent } from '@tabler/icons-react';

const DemoBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Generate dummy booking data that mimics the API response
  const generateDummyBookingData = () => {
    const startDate = new Date();
    const items = [];
    
    // Generate slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(startDate, day);
      
      // Add slots every 30 minutes from 9am to 5pm
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          if (Math.random() > 0.3) { // 70% chance of slot being available
            const start = new Date(currentDate);
            start.setHours(hour, minute, 0, 0);
            
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + 30);
            
            items.push({
              start: start.toISOString(),
              end: end.toISOString(),
              accountIds: [12345]
            });
          }
        }
      }
    }
    
    return {
      items,
      startTime: startDate.toISOString(),
      endTime: addDays(startDate, 7).toISOString(),
      timeAvailableFor: "P7D",
      durationMinutes: 30,
      availabilityStep: 30,
      subject: "Demo Meeting",
      primaryColor: "#6e58ff",
      secondaryColor: "#57D26B",
      done: true,
      totalSize: 1
    };
  };

  const dummyBookingData = generateDummyBookingData();

  const handleSelectTimeSlot = (slot) => {
    setSelectedTimeSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTimeSlot(null);
  };

  const handleConfirmBooking = (bookingDetails) => {
    console.log('Booking confirmed:', bookingDetails);
    // In a real app, this would handle form submission to your API
  };

  // CSS variables for gradient
  const primaryGradient = 'linear-gradient(135deg, #6E58FF 0%, #8976FF 100%)';
  const secondaryGradient = 'linear-gradient(135deg, rgba(110, 88, 255, 0.05) 0%, rgba(137, 118, 255, 0.08) 100%)';

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
            background: secondaryGradient,
            border: '1px solid rgba(110, 88, 255, 0.1)',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Box
              style={{ 
                width: 50,
                height: 50,
                borderRadius: 12,
                background: primaryGradient,
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
                {dummyBookingData.subject}
              </Title>
              <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconClock size={16} style={{ color: '#6E58FF' }} />
                <Text size="sm" style={{ color: 'rgba(0,0,0,0.7)' }}>
                  {dummyBookingData.durationMinutes} minutes
                </Text>
              </Box>
            </Box>
          </Box>
        </Paper>

        <BookingCalendar
          availableSlots={dummyBookingData.items || []}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onSelectTimeSlot={handleSelectTimeSlot}
        />

        <DemoBookingModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          selectedTimeSlot={selectedTimeSlot}
          bookingData={dummyBookingData}
          onConfirm={handleConfirmBooking}
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

export default DemoBookingPage; 