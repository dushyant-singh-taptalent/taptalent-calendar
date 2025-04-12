import { useState, useEffect } from 'react';
import { Calendar } from '@mantine/dates';
import { Text, Button, Paper, Stack, Grid, rem, Box, Avatar, Title, Divider, ScrollArea } from '@mantine/core';
import { format, parseISO, isSameDay, getHours } from 'date-fns';
import { IconClock, IconCalendar, IconSun, IconMoon } from '@tabler/icons-react';

const BookingCalendar = ({ availableSlots, selectedDate, setSelectedDate, onSelectTimeSlot }) => {
  const [availableDates, setAvailableDates] = useState(new Set());

  useEffect(() => {
    // Extract unique dates from available slots
    const dates = new Set();
    availableSlots.forEach(slot => {
      const date = format(parseISO(slot.start), 'yyyy-MM-dd');
      dates.add(date);
    });
    setAvailableDates(dates);
  }, [availableSlots]);

  // Filter time slots for the selected date
  const timeSlots = availableSlots.filter(slot => {
    if (!selectedDate) return false;
    const slotDate = parseISO(slot.start);
    return isSameDay(slotDate, selectedDate);
  });

  // Group time slots by morning, afternoon and evening
  const groupTimeSlots = (slots) => {
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];
    
    slots.forEach(slot => {
      const startTime = parseISO(slot.start);
      const hour = getHours(startTime);
      
      if (hour < 12) {
        morningSlots.push(slot);
      } else if (hour >= 12 && hour < 17) {
        afternoonSlots.push(slot);
      } else {
        eveningSlots.push(slot);
      }
    });
    
    return { morningSlots, afternoonSlots, eveningSlots };
  };

  const { morningSlots, afternoonSlots, eveningSlots } = groupTimeSlots(timeSlots);

  return (
    <Paper
      radius="lg"
      p={0}
      style={{
        overflow: 'hidden',
        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--mantine-color-gray-2)'
      }}
    >
      <Grid columns={24} gutter={0}>
        {/* Calendar Section */}
        <Grid.Col span={{ base: 24, md: 14 }}>
          <Box
            style={{
              padding: '2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Title order={3} mb="lg" fw={600} c="gray.8">Select a Date & Time</Title>

            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              defaultDate={new Date()}
              styles={{
                calendarBase: {
                  width: '100%'
                },
                calendarHeader: {
                  maxWidth: '100%'
                },
                monthCell: {
                  fontSize: rem(16),
                  fontWeight: 600
                },
                month: {
                  width: '100%'
                },
                day: {
                  height: rem(55),
                  width: rem(55),
                  fontSize: rem(16),
                  margin: '2px auto',
                  borderRadius: '50%',
                },
                weekday: {
                  height: rem(40),
                  fontWeight: 600,
                  color: 'var(--mantine-color-gray-7)',
                  fontSize: rem(14),
                  paddingBottom: rem(10),
                  textTransform: 'uppercase'
                },
                weekdayCell: {
                  fontSize: rem(12),
                  height: rem(40),
                  padding: '10px 0'
                },
                // Override default selected day styling
                selected: {
                  backgroundColor: 'transparent',
                  borderRadius: '50%',
                  color: 'inherit'
                },
                // Make sure the calendar doesn't add its own styles for selection
                selectedInRange: {
                  backgroundColor: 'transparent',
                  color: 'inherit'
                }
              }}
              renderDay={(date) => {
                const day = date.getDate();
                const dateStr = format(date, 'yyyy-MM-dd');
                const isAvailable = availableDates.has(dateStr);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                
                if (!isAvailable) {
                  return <div style={{ 
                    color: 'var(--mantine-color-gray-5)',
                    height: rem(40),
                    width: rem(40),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{day}</div>;
                }
                
                if (isSelected) {
                  return (
                    <div style={{
                      backgroundColor: '#6E58FF', // Updated to our primary color
                      color: 'white',
                      borderRadius: '50%',
                      height: rem(50),
                      width: rem(50),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: rem(16)
                    }}>{day}</div>
                  );
                }
                
                return (
                  <div style={{
                    color: '#6E58FF', // Updated to our primary color
                    fontWeight: 600,
                    borderRadius: '50%',
                    height: rem(40),
                    width: rem(40),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EDE9FF', // Light shade of our primary color
                    cursor: 'pointer',
                    fontSize: rem(16)
                  }}>{day}</div>
                );
              }}
              getDayProps={(date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isAvailable = availableDates.has(dateStr);
                return {
                  disabled: !isAvailable,
                  onClick: isAvailable ? () => setSelectedDate(date) : undefined,
                  style: {
                    border: 'none',
                    cursor: isAvailable ? 'pointer' : 'default',
                    backgroundColor: 'transparent', // Remove any background color
                    outline: 'none', // Remove any outline
                  }
                };
              }}
              firstDayOfWeek={1} // Monday as first day
              weekdayFormat="ddd" // Use 3-letter format
              size="xl"
            />
          </Box>
        </Grid.Col>

        {/* Time Slots Section */}
        <Grid.Col 
          span={{ base: 24, md: 10 }} 
          style={{ 
            backgroundColor: 'var(--mantine-color-gray-0)',
            borderLeft: '1px solid var(--mantine-color-gray-2)'
          }}
        >
          <Box
            style={{
              padding: '2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: '1.5rem'
              }}
            >
              <Avatar
                color="brand"
                radius="xl"
                size="md"
              >
                <IconClock size={20} />
              </Avatar>
              <Text fw={600} c="gray.8" size="lg">
                {selectedDate ? 'Available times' : 'Select a date'}
              </Text>
            </Box>

            {selectedDate ? (
              <Box>
                <Text c="dimmed" fw={500} mb="md" style={{ fontSize: '0.9rem' }}>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </Text>

                <ScrollArea h={400} offsetScrollbars>
                  {timeSlots.length > 0 ? (
                    <>
                      {morningSlots.length > 0 && (
                        <>
                          <Box 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 8, 
                              marginBottom: '0.75rem'
                            }}
                          >
                            <IconSun size={18} color="#6E58FF" />
                            <Text size="sm" fw={600} c="gray.7">Morning</Text>
                          </Box>
                          <Grid gutter="xs" mb="md">
                            {morningSlots.map((slot) => {
                              const startTime = parseISO(slot.start);
                              return (
                                <Grid.Col span={6} key={slot.start}>
                                  <Button
                                    variant="outline"
                                    color="brand"
                                    radius="md"
                                    style={{
                                      width: '100%',
                                      fontWeight: 500,
                                      fontSize: '0.9rem',
                                      borderColor: 'var(--mantine-color-brand-1)',
                                      transition: 'all 0.2s',
                                      padding: '8px 0',
                                    }}
                                    styles={{
                                      root: {
                                        '&:hover': {
                                          backgroundColor: 'var(--mantine-color-brand-0)',
                                          borderColor: 'var(--mantine-color-brand-5)',
                                          transform: 'translateY(-2px)',
                                          boxShadow: '0 5px 15px -5px var(--mantine-color-brand-2)',
                                        },
                                      }
                                    }}
                                    onClick={() => onSelectTimeSlot(slot)}
                                  >
                                    {format(startTime, 'h:mm a')}
                                  </Button>
                                </Grid.Col>
                              );
                            })}
                          </Grid>
                        </>
                      )}

                      {afternoonSlots.length > 0 && (
                        <>
                          <Box 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 8, 
                              marginBottom: '0.75rem'
                            }}
                          >
                            <IconSun size={18} color="#6E58FF" />
                            <Text size="sm" fw={600} c="gray.7">Afternoon</Text>
                          </Box>
                          <Grid gutter="xs" mb="md">
                            {afternoonSlots.map((slot) => {
                              const startTime = parseISO(slot.start);
                              return (
                                <Grid.Col span={6} key={slot.start}>
                                  <Button
                                    variant="outline"
                                    color="brand"
                                    radius="md"
                                    style={{
                                      width: '100%',
                                      fontWeight: 500,
                                      fontSize: '0.9rem',
                                      borderColor: 'var(--mantine-color-brand-1)',
                                      transition: 'all 0.2s',
                                      padding: '8px 0',
                                    }}
                                    styles={{
                                      root: {
                                        '&:hover': {
                                          backgroundColor: 'var(--mantine-color-brand-0)',
                                          borderColor: 'var(--mantine-color-brand-5)',
                                          transform: 'translateY(-2px)',
                                          boxShadow: '0 5px 15px -5px var(--mantine-color-brand-2)',
                                        },
                                      }
                                    }}
                                    onClick={() => onSelectTimeSlot(slot)}
                                  >
                                    {format(startTime, 'h:mm a')}
                                  </Button>
                                </Grid.Col>
                              );
                            })}
                          </Grid>
                        </>
                      )}

                      {eveningSlots.length > 0 && (
                        <>
                          <Box 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 8, 
                              marginBottom: '0.75rem'
                            }}
                          >
                            <IconMoon size={18} color="#6E58FF" />
                            <Text size="sm" fw={600} c="gray.7">Evening</Text>
                          </Box>
                          <Grid gutter="xs">
                            {eveningSlots.map((slot) => {
                              const startTime = parseISO(slot.start);
                              return (
                                <Grid.Col span={6} key={slot.start}>
                                  <Button
                                    variant="outline"
                                    color="brand"
                                    radius="md"
                                    style={{
                                      width: '100%',
                                      fontWeight: 500,
                                      fontSize: '0.9rem',
                                      borderColor: 'var(--mantine-color-brand-1)',
                                      transition: 'all 0.2s',
                                      padding: '8px 0',
                                    }}
                                    styles={{
                                      root: {
                                        '&:hover': {
                                          backgroundColor: 'var(--mantine-color-brand-0)',
                                          borderColor: 'var(--mantine-color-brand-5)',
                                          transform: 'translateY(-2px)',
                                          boxShadow: '0 5px 15px -5px var(--mantine-color-brand-2)',
                                        },
                                      }
                                    }}
                                    onClick={() => onSelectTimeSlot(slot)}
                                  >
                                    {format(startTime, 'h:mm a')}
                                  </Button>
                                </Grid.Col>
                              );
                            })}
                          </Grid>
                        </>
                      )}
                    </>
                  ) : (
                    <Box 
                      style={{ 
                        padding: '2rem 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        color: 'var(--mantine-color-gray-5)'
                      }}
                    >
                      <IconClock size={32} stroke={1.5} />
                      <Text c="dimmed" size="sm" ta="center">No available slots for this date</Text>
                    </Box>
                  )}
                </ScrollArea>
              </Box>
            ) : (
              <Box 
                style={{ 
                  padding: '4rem 0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  color: 'var(--mantine-color-gray-5)'
                }}
              >
                <IconCalendar size={32} stroke={1.5} />
                <Text c="dimmed" size="sm" ta="center">Select a date to view available times</Text>
              </Box>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default BookingCalendar; 