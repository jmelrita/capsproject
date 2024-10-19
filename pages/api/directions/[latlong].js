export default async function handler(req, res) {
  const { latlong } = req.query;
  const { lat, lng, originLat, originLng } = JSON.parse(latlong);

  const formattedLat = lat;
  const formattedLng = lng;

  const YOUR_GOOGLE_MAP_API_KEY = 'AIzaSyAwk5DsXfcCdS7OQDzJ4dfwLLAfBqWHrd8';
  // Construct the URL with potential location data
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${formattedLat},${formattedLng}&mode=walking&departure_time=now&key=${YOUR_GOOGLE_MAP_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const duration = data.routes[0].legs[0].duration.text;
      res.status(200).json({ duration });

    } else {
      res.json({ error: 'Failed to retrieve ETA' });

    }
  } catch (error) {
    console.error('Error fetching massage data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
