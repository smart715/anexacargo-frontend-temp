// Angular
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

class ISearchResult {
	icon?: string;
	svg?: string;
	img?: string;
	text: string;
	type: number;
}

@Component({
	selector: 'kt-search-default',
	templateUrl: './search-default.component.html',
})
export class SearchDefaultComponent implements OnInit {
	// Public properties

	// Set icon class name
	@Input() icon = 'flaticon2-search-1';

	// Set true to icon as SVG or false as icon class
	@Input() useSVG: boolean;

	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;

	data: any[];
	result: ISearchResult[];
	loading: boolean;

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	constructor(private cdr: ChangeDetectorRef) {
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		// simulate result from API
		// type 0|1 as separator or item
		this.result = [
			{
				text: 'Documents',
				type: 0,
			}, {
				svg: 'assets/media/svg/files/doc.svg',
				text: 'Annual finance report',
				type: 1,
			}, {
				svg: 'assets/media/svg/files/pdf.svg',
				text: 'Company meeting schedule',
				type: 1,
			}, {
				svg: 'assets/media/svg/files/xml.svg',
				text: 'Project quotations',
				type: 1,
			}, {
				text: 'Customers',
				type: 0,
			}, {
				img: 'assets/media/users/300_20.jpg',
				text: 'Amanda Anderson',
				type: 1,
			}, {
				img: 'assets/media/users/300_15.jpg',
				text: 'Kennedy Lloyd',
				type: 1,
			}, {
				img: 'assets/media/users/300_12.jpg',
				text: 'Megan Weldon',
				type: 1,
			}, {
				img: 'assets/media/users/300_16.jpg',
				text: 'Marc-André ter Stegen',
				type: 1,
			}, {
				text: 'Files',
				type: 0,
			}, {
				icon: 'flaticon-psd text-primary',
				text: 'Revenue report',
				type: 1,
			}, {
				icon: 'flaticon2-supermarket text-warning',
				text: 'Anual finance report',
				type: 1,
			}, {
				icon: 'flaticon-safe-shield-protection text-info',
				text: 'Tax calculations',
				type: 1,
			}, {
				icon: 'flaticon-safe-shield-protection text-warning',
				text: '4 New items submitted',
				type: 1,
			},
		];
	}

	/**
	 * Search
	 * @param e: Event
	 */
	search(e) {
		this.data = null;
		if (e.target.value.length > 2) {
			this.loading = true;
			// simulate getting search result
			setTimeout(() => {
				this.data = this.result;
				this.loading = false;
				this.cdr.markForCheck();
			}, 500);
		}
	}

	/**
	 * Clear search
	 *
	 * @param e: Event
	 */
	clear(e) {
		this.data = null;
		this.searchInput.nativeElement.value = '';
	}
}
