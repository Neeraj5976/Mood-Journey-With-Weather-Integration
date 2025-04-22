import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { WeatherData } from '../models/mood-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // TODO: Replace with your OpenWeatherMap API key
  // Sign up at https://openweathermap.org/api to get your API key
  private apiKey = '4d8fb5b93d4af21d66a2948710284366'; // Replace with your actual API key
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  getWeather(): Observable<WeatherData> {
    return from(this.getCurrentLocation()).pipe(
      switchMap(position => {
        const params = {
          lat: position.coords.latitude.toString(),
          lon: position.coords.longitude.toString(),
          appid: this.apiKey,
          units: 'metric'
        };
        return this.http.get<any>(this.apiUrl, { params });
      }),
      map(response => ({
        temperature: Math.round(response.main.temp),
        description: response.weather[0].main,
        icon: response.weather[0].icon,
        location: response.name
      })),
      catchError(this.handleError)
    );
  }

  getWeatherData(lat: number, lon: number): Observable<WeatherData> {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    
    return this.http.get<any>(url).pipe(
      map(response => ({
        temperature: Math.round(response.main.temp),
        description: response.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
        location: response.name
      }))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching weather data';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid API key. Please make sure you have set up your OpenWeatherMap API key correctly.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(errorMessage);
  }
} 