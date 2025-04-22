import { Component, OnInit, HostListener } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { MoodService, MoodEntry } from '../../services/mood.service';

interface Mood {
  value: number;
  emoji: string;
  color: string;
  label: string;
}

@Component({
  selector: 'app-mood-entry',
  templateUrl: './mood-entry.component.html',
  styleUrls: ['./mood-entry.component.scss']
})
export class MoodEntryComponent implements OnInit {
  currentDate = new Date();
  selectedMood: number | null = null;
  note: string = '';
  weather: any = null;
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  calendarDates: Date[] = [];
  isMobileView = false;

  moods: Mood[] = [
    { value: 5, emoji: '😊', color: '#FFD700', label: 'Great' },
    { value: 4, emoji: '🙂', color: '#98FB98', label: 'Good' },
    { value: 3, emoji: '😐', color: '#87CEEB', label: 'Okay' },
    { value: 2, emoji: '😕', color: '#FFA07A', label: 'Not Great' },
    { value: 1, emoji: '😢', color: '#CD5C5C', label: 'Bad' }
  ];

  constructor(
    private weatherService: WeatherService,
    private moodService: MoodService
  ) {
    this.checkMobileView();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
  }

  private checkMobileView() {
    this.isMobileView = window.innerWidth <= 768;
  }

  ngOnInit() {
    this.loadWeather();
    this.generateCalendarDates();
  }

  private loadWeather() {
    this.weatherService.getWeather().subscribe(
      weather => this.weather = weather,
      error => console.error('Error fetching weather:', error)
    );
  }

  private generateCalendarDates() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Add dates from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      this.calendarDates.push(new Date(year, month, -i));
    }
    
    // Add all dates of current month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      this.calendarDates.push(new Date(year, month, date));
    }
  }

  getWeatherIcon(iconCode: string): string {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }

  selectMood(moodValue: number) {
    this.selectedMood = moodValue;
  }

  saveMoodEntry() {
    if (!this.selectedMood || !this.weather) return;

    const entry: Omit<MoodEntry, 'id'> = {
      date: this.currentDate,
      mood: this.selectedMood,
      note: this.note.trim(),
      weather: this.weather
    };

    this.moodService.addMoodEntry(entry);
    this.resetForm();
  }

  private resetForm() {
    this.selectedMood = null;
    this.note = '';
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  hasEntry(date: Date): boolean {
    return !!this.moodService.getEntriesByDate(date);
  }

  getEntryColor(date: Date): string {
    const entry = this.moodService.getEntriesByDate(date);
    if (!entry) return 'transparent';
    return this.moods.find(m => m.value === entry.mood)?.color || 'transparent';
  }

  getMoodLabel(moodValue: number): string {
    return this.moods.find(m => m.value === moodValue)?.label || '';
  }
}
