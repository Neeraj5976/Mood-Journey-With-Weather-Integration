export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  location: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  note: string;
  weather: WeatherData;
} 