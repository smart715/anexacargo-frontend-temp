// Angular
import { Component, Input } from '@angular/core';

@Component({
  selector: 'kt-widget4-todo',
  templateUrl: './widget4-todo.component.html'
})
export class Widget4TodoComponent {
  @Input() cssClasses = '';
}
