// Angular
import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
	selector: 'kt-code-preview',
	templateUrl: './code-preview.component.html',
	styleUrls: ['./code-preview.component.scss'],
})
export class CodePreviewComponent implements OnInit, AfterViewInit {
	// Public properties
	@Input() viewItem: any;

	/**
	 * Component constructor
	 */
	constructor(private el: ElementRef) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	ngAfterViewInit() {
		// init code preview examples
		// see /src/assets/js/layout/extended/examples.js
		const elements = this.el.nativeElement.querySelectorAll('.example.example-compact');
		KTLayoutExamples.init(elements);
	}
}
