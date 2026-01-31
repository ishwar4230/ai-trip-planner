import { useState } from 'react';
import {
  Container,
  Title,
  Select,
  Button,
  SimpleGrid,
  Card,
  Text,
  Group,
  Badge,
  Timeline,
  Loader,
  Divider
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

const states = [
  "Kerala","Rajasthan","Himachal Pradesh","Uttarakhand","Goa",
  "Karnataka","Tamil Nadu","Sikkim","Meghalaya","Ladakh"
];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const API_PREFIX = 'https://ai-trip-planner-irb4.onrender.com';
export default function App() {
  const [state, setState] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [itinerary, setItinerary] = useState(null);

  const getTripOptions = async () => {
    if (!state || !month) {
      return showNotification({
        color: 'red',
        title: 'Missing fields',
        message: 'Please select state and month'
      });
    }

    try {
      setLoading(true);
      setItinerary(null);

      const { data } = await axios.post(`/trip/options`, {
        state, month
      });

      setOptions(data.options);
    } catch (err) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Failed to fetch trip options'
      });
    } finally {
      setLoading(false);
    }
  };

  const getItinerary = async (place) => {
    try {
      setLoading(true);

      const { data } = await axios.post(`/trip/itinerary`, {
        state, month, place
      });

      setItinerary(data.data);
    } catch (err) {
      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Failed to fetch itinerary'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py={40}>
      <Title align="center" mb="md">🧠 AI Trip Planner</Title>
      <Text align="center" c="dimmed" mb={30}>
        Enter your travel details and let AI plan your perfect trip
      </Text>

      <Group grow>
        <Select
          label="Select State"
          placeholder="Pick one"
          data={states}
          value={state}
          onChange={setState}
        />
        <Select
          label="Select Month"
          placeholder="Pick one"
          data={months}
          value={month}
          onChange={setMonth}
        />
      </Group>

      <Group position="center" mt="xl">
        <Button size="md" onClick={getTripOptions} loading={loading}>
          Generate Trip Options
        </Button>
      </Group>

      {loading && (
        <Group position="center" mt="xl">
          <Loader size="lg" />
        </Group>
      )}

      {!!options.length && (
        <>
          <Divider my="xl" label="Top Travel Destinations" labelPosition="center" />

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {options.map((opt, idx) => (
              <Card key={idx} shadow="md" radius="lg" p="lg">
                <Group position="apart">
                  <Text fw={600}>{opt.place}</Text>
                  <Badge color="blue">
                    {opt.weather.min}°C - {opt.weather.max}°C
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mt={4}>
                  {opt.weather.condition}
                </Text>

                <Text size="sm" mt="sm">
                  {opt.why}
                </Text>

                <Button
                  fullWidth
                  mt="md"
                  variant="light"
                  onClick={() => getItinerary(opt.place)}
                >
                  Plan Trip
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}

      {itinerary && (
        <>
          <Divider my="xl" label={`Best Itinerary for ${itinerary.place}`} labelPosition="center" />

          <Text align="center" mb="sm">
            Best Time: <b>{itinerary.best_time_to_visit}</b> | Style: <b>{itinerary.trip_style}</b>
          </Text>

          <Timeline active={itinerary.itinerary.length} bulletSize={24} lineWidth={3}>
            {itinerary.itinerary.map((d, i) => (
              <Timeline.Item key={i} title={`Day ${d.day}`}>
                <Text size="sm">{d.plan}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      )}

    </Container>
  );
}
