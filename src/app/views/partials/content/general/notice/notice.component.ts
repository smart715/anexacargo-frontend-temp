// Angular
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kt-notice',
  templateUrl: './notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeComponent implements OnInit {
  // Public properties
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  /**
   * Component constructor
   */
  constructor() {
  }

  /**
   * On init
   */
  ngOnInit() {
  }
}
