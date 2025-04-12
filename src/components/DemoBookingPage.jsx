import { useState } from 'react';
import { Container, Title, Text, Paper, Stack, Button, Modal, TextInput, Group, Box, Avatar } from '@mantine/core';
import { parseISO, addDays, format } from 'date-fns';
import BookingCalendar from './BookingCalendar';
import { IconClock, IconCalendarEvent } from '@tabler/icons-react';

const DemoBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
    setBookingSuccess(false);
  };

  const handleSchedule = () => {
    if (!name || !email) return;
    
    // Demo booking process with loading state to mimic real API call
    setBookingLoading(true);
    
    setTimeout(() => {
      setBookingLoading(false);
      setBookingSuccess(true);
      
      // Close modal after showing success
      setTimeout(() => {
        setModalOpen(false);
        setName('');
        setEmail('');
        setSelectedTimeSlot(null);
      }, 2000);
    }, 1000);
  };

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
          <Title order={1} size="h3" style={{ marginBottom: 8 }}>{dummyBookingData.subject}</Title>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
            <Text c="dimmed" size="sm">{dummyBookingData.durationMinutes} minutes</Text>
          </Box>
        </Box>
      </Box>

      <BookingCalendar
        availableSlots={dummyBookingData.items || []}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSelectTimeSlot={handleSelectTimeSlot}
      />

      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)}
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
                      <Text fw={600}>{dummyBookingData.subject}</Text>
                    </Box>
                    <Box>
                      <Text size="sm" fw={500} c="dimmed">Date & Time</Text>
                      <Text>{format(parseISO(selectedTimeSlot.start), 'EEEE, MMMM d, yyyy')} at {format(parseISO(selectedTimeSlot.start), 'h:mm a')}</Text>
                    </Box>
                    <Box>
                      <Text size="sm" fw={500} c="dimmed">Duration</Text>
                      <Text>{dummyBookingData.durationMinutes} minutes</Text>
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
                
                <Group justify="flex-end" mt="md">
                  <Button 
                    variant="subtle" 
                    onClick={() => setModalOpen(false)}
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
    </Container>
  );
};

export default DemoBookingPage; 