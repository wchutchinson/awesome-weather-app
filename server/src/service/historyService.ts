import fs from 'fs/promises';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error && error.message.includes('ENOENT')) {
        return [];
      }
      throw new Error ('An error occured while reading the file: ${error.message}');
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();

    if (cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
      console.log('City already exists in the search history');
      return;
  }
  const cityId = await this.fetchCityId(cityName);

  const newCity = new City(cityId, cityName);
  cities.push(newCity);
  await this.write(cities);
}
  
  private async fetchCityId(cityName: string): Promise<string> {
    const apiKey = process.env.WEATHER_API_KEY || 'a0ecd6da3773b9005898fa0e255a02ec';
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    );
    const data = await response.json();

    if (!response.ok || !data.id) {
      throw new Error(`Couild not fetch city ID for ${cityName}.`);
    }

    return data.id.toString();
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(cityId: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== cityId);

    if (cities.length === updatedCities.length) {
      console.log(`City with ID "${cityId}" not found.`);
      return;
    }

    // Write the updated cities array back to the file
    await this.write(updatedCities);
  }
}

export default new HistoryService();
