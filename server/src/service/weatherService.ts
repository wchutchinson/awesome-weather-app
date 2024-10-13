import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}                     

// TODO: Define a class for the Weather object
class Weather {
  name: string;
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  date: string;
  icon: string;

  constructor (temperature: number, humidity: number, description: string, windSpeed: number, name: string, date: string, icon: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windSpeed = windSpeed;
    this.name = name;
    this.date = date;
    this.icon = icon;
  }

}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseGeocodeURL: string;
  private baseWeatherURL: string;
  private forecastURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseGeocodeURL = 'http://api.openweathermap.org/geo/1.0/direct';
    this.baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastURL = 'https://api.openweathermap.org/data/2.5/forecast';
    this.apiKey = process.env.WEATHER_API_KEY || 'a0ecd6da3773b9005898fa0e255a02ec';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeURL = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeURL);
    return response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }
  
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseGeocodeURL}?q=${query}&limit=1&appid=${this.apiKey}`;
  }
  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseWeatherURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.forecastURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }
  
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherURL = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherURL);
    return response.json();
  }

  // TODO: Create a fetchForecastData method
  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const forecastURL = this.buildForecastQuery(coordinates);
    const response = await fetch(forecastURL);
    return response.json();
  }
  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp, humidity } = response.main;
    const { description, icon } = response.weather[0];
    const { speed: windSpeed } = response.wind;
    const date = new Date(response.dt * 1000).toLocaleDateString();

    return new Weather(temp, humidity, description, windSpeed, this.cityName, date, icon);
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
      // Filter the forecast to get only one entry per day, preferably around noon
      const forecastArray: Weather[] = [];
      const uniqueDays = new Set(); // To track unique dates
    
      for (let data of weatherData) {
        const forecastDate = new Date(data.dt * 1000);
        const forecastDay = forecastDate.getUTCDate(); // Get day of the month (UTC to avoid timezone issues)
        const forecastHour = forecastDate.getUTCHours(); // Get hour in UTC
    
        // Select forecasts around 12:00 PM
        if (!uniqueDays.has(forecastDay) && forecastHour === 12) {
          uniqueDays.add(forecastDay);
          
          const { temp, humidity } = data.main;
          const { description, icon } = data.weather[0];
          const { speed: windSpeed } = data.wind;
          const date = forecastDate.toLocaleDateString();
    
          // Create a new Weather object and push it to the array
          forecastArray.push(new Weather(temp, humidity, description, windSpeed, this.cityName, date, icon));
          
          // Stop adding more entries for this day
          if (forecastArray.length === 5) break; 
        }
      }
    
      forecastArray.unshift(currentWeather); // Add the current weather to the beginning
      return forecastArray;
    }
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherResponse = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherResponse);
      const forecastResponse = await this.fetchForecastData(coordinates);
      const forecastWeatherData = forecastResponse.list;
      return this.buildForecastArray(currentWeather, forecastWeatherData);
    }
}

export default new WeatherService();
