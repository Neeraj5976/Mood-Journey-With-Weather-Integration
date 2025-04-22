import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoodEntryComponent } from './components/mood-entry/mood-entry.component';
import { MoodListComponent } from './components/mood-list/mood-list.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/entry', pathMatch: 'full' },
  { path: 'entry', component: MoodEntryComponent },
  { path: 'list', component: MoodListComponent },
  { path: 'calendar', component: CalendarViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
