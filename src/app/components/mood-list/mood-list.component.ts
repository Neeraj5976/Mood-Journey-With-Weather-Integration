import { Component, OnInit } from '@angular/core';
import { MoodService, MoodEntry } from '../../services/mood.service';

interface Mood {
  value: number;
  emoji: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-mood-list',
  templateUrl: './mood-list.component.html',
  styleUrls: ['./mood-list.component.scss']
})
export class MoodListComponent implements OnInit {
  entries: MoodEntry[] = [];
  filteredEntries: MoodEntry[] = [];
  selectedMood: string = '';

  moods: Mood[] = [
    { value: 5, emoji: '😊', label: 'Great', color: '#FFD700' },
    { value: 4, emoji: '🙂', label: 'Good', color: '#98FB98' },
    { value: 3, emoji: '😐', label: 'Okay', color: '#87CEEB' },
    { value: 2, emoji: '😕', label: 'Not Great', color: '#FFA07A' },
    { value: 1, emoji: '😢', label: 'Bad', color: '#CD5C5C' }
  ];

  constructor(private moodService: MoodService) {}

  ngOnInit() {
    this.moodService.getMoodEntries().subscribe(entries => {
      this.entries = entries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.filterEntries();
    });
  }

  filterEntries() {
    if (!this.selectedMood) {
      this.filteredEntries = this.entries;
    } else {
      this.filteredEntries = this.entries.filter(
        entry => entry.mood === parseInt(this.selectedMood)
      );
    }
  }

  getMoodEmoji(moodValue: number): string {
    return this.moods.find(m => m.value === moodValue)?.emoji || '';
  }

  getMoodColor(moodValue: number): string {
    return this.moods.find(m => m.value === moodValue)?.color || 'transparent';
  }

  getWeatherIcon(iconCode: string): string {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }
}
