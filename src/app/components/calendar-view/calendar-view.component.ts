import { Component, OnInit } from '@angular/core';
import { MoodService, MoodEntry } from '../../services/mood.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  moodEntry?: MoodEntry;
}

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  currentDate = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  moodEntries: MoodEntry[] = [];

  moods = [
    { value: 5, emoji: '😊', color: '#FFD700' },
    { value: 4, emoji: '🙂', color: '#98FB98' },
    { value: 3, emoji: '😐', color: '#87CEEB' },
    { value: 2, emoji: '😕', color: '#FFA07A' },
    { value: 1, emoji: '😢', color: '#CD5C5C' }
  ];

  constructor(private moodService: MoodService) {}

  ngOnInit() {
    this.loadMoodEntries();
    this.generateCalendar();
  }

  private loadMoodEntries() {
    this.moodService.getMoodEntries().subscribe(entries => {
      this.moodEntries = entries;
      this.generateCalendar();
    });
  }

  generateCalendar() {
    this.calendarDays = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        moodEntry: this.getMoodEntryForDate(date)
      });
    }

    // Add days of current month
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const currentDate = new Date(year, month, date);
      this.calendarDays.push({
        date: currentDate,
        isCurrentMonth: true,
        moodEntry: this.getMoodEntryForDate(currentDate)
      });
    }

    // Add days from next month
    const remainingDays = 42 - this.calendarDays.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        moodEntry: this.getMoodEntryForDate(date)
      });
    }
  }

  private getMoodEntryForDate(date: Date): MoodEntry | undefined {
    return this.moodEntries.find(entry => 
      entry.date.toDateString() === date.toDateString()
    );
  }

  getMonthYear(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  getMoodEmoji(moodValue: number): string {
    return this.moods.find(m => m.value === moodValue)?.emoji || '';
  }

  getMoodColor(moodValue: number): string {
    return this.moods.find(m => m.value === moodValue)?.color || 'transparent';
  }

  getDayAriaLabel(day: CalendarDay): string {
    const dateStr = day.date.toLocaleDateString('default', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!day.moodEntry) {
      return dateStr;
    }

    const moodStr = this.moods.find(m => m.value === day.moodEntry?.mood)?.emoji || '';
    const noteStr = day.moodEntry.note ? ` with note: ${day.moodEntry.note}` : '';
    const weatherStr = `, temperature: ${day.moodEntry.weather.temperature}°C`;

    return `${dateStr}, mood: ${moodStr}${noteStr}${weatherStr}`;
  }
}
