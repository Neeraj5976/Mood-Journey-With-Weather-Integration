import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MoodEntry {
  id: string;
  date: Date;
  mood: number;
  note: string;
  weather: {
    temperature: number;
    description: string;
    icon: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private moodEntries = new BehaviorSubject<MoodEntry[]>([]);

  constructor() {
    this.loadEntriesFromStorage();
  }

  private loadEntriesFromStorage() {
    const entries = localStorage.getItem('moodEntries');
    if (entries) {
      const parsedEntries = JSON.parse(entries).map((entry:any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      this.moodEntries.next(parsedEntries);
    }
  }

  private saveEntriesToStorage(entries: MoodEntry[]) {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }

  getMoodEntries(): Observable<MoodEntry[]> {
    return this.moodEntries.asObservable();
  }

  addMoodEntry(entry: Omit<MoodEntry, 'id'>) {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    const currentEntries = this.moodEntries.value;
    const updatedEntries = [...currentEntries, newEntry];
    this.moodEntries.next(updatedEntries);
    this.saveEntriesToStorage(updatedEntries);
  }

  getEntriesByMood(mood: number): MoodEntry[] {
    return this.moodEntries.value.filter(entry => entry.mood === mood);
  }

  getEntriesByDate(date: Date): MoodEntry | undefined {
    return this.moodEntries.value.find(entry => 
      entry.date.toDateString() === date.toDateString()
    );
  }
} 