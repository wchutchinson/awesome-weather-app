import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try {
    const { cityName } = req.body;
    
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }
    //Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
    // TODO: save city to search history
    await HistoryService.addCity(cityName);

    return res.status(200).json(weatherData);
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});

// TODO: GET search history
// /api/weather/history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    
    //Return  with the list of cities in the search history
    return res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
// /api/weather/history/:id
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    //Remove city from search history
    await HistoryService.removeCity(id);

    // Respoind with success message
    return res.status(200).json({ message: `City with ID ${id} removed from search history.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to remove city from search history.' });
  }
});

export default router;
