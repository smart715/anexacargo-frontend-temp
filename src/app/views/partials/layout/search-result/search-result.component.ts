// Angular
import { Component, Input } from '@angular/core';

@Component({
  selector: 'kt-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
  // Public properties
  @Input() data: [];
}
