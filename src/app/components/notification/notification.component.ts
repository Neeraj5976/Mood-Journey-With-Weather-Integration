import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  isVisible: boolean = false;

  ngOnInit() {
    this.show();
  }

  show() {
    this.isVisible = true;
    setTimeout(() => {
      this.hide();
    }, 3000); // Hide after 3 seconds
  }

  hide() {
    this.isVisible = false;
  }
} 