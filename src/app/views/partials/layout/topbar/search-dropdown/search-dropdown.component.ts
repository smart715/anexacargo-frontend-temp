// Angular
import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

const documents = {
  title: 'Documents',
  type: 0,
  items: [
    {
      svgPath: 'assets/media/svg/files/doc.svg',
      title: 'AirPlus Requirements',
      description: 'by Grog John'
    },
    {
      svgPath: 'assets/media/svg/files/pdf.svg',
      title: 'TechNav Documentation',
      description: 'by Mary Brown'
    },
    {
      svgPath: 'assets/media/svg/files/xml.svg',
      title: 'All Framework Docs',
      description: 'by Nick Stone'
    },
    {
      svgPath: 'assets/media/svg/files/csv.svg',
      title: 'Finance & Accounting Reports',
      description: 'by Jhon Larson'
    }
  ]
};

const members = {
  title: 'Members',
  type: 1,
  items: [
    {
      imgPath: 'assets/media/users/300_20.jpg',
      title: 'Milena Gibson',
      description: 'UI Designer'
    },
    {
      imgPath: 'assets/media/users/300_15.jpg',
      title: 'Stefan JohnStefan',
      description: 'Marketing Manager'
    },
    {
      imgPath: 'assets/media/users/300_12.jpg',
      title: 'Anna Strong',
      description: 'Software Developer'
    },
    {
      imgPath: 'assets/media/users/300_16.jpg',
      title: 'Nick Bold',
      description: 'Project Coordinator'
    }
  ]
};

const files = {
  title: 'Files',
  type: 2,
  items: [
    {
      iconClasses: 'flaticon-psd text-primary',
      title: '79 PSD files generated',
      description: 'by Grog John'
    },
    {
      iconClasses: 'flaticon2-supermarket text-warning',
      title: '$2900 worth products sold',
      description: 'Total 234 items'
    },
    {
      iconClasses: 'flaticon-safe-shield-protection text-info',
      title: '4 New items submitted',
      description: 'Marketing Manager'
    },
    {
      iconClasses: 'flaticon-safe-shield-protection text-warning',
      title: '4 New items submitted',
      description: 'Marketing Manager'
    }
  ]
};

@Component({
  selector: 'kt-search-dropdown',
  templateUrl: './search-dropdown.component.html'
})
export class SearchDropdownComponent implements OnInit {
  // Public properties
  @Input() layout = 'dropdown';
  // Set icon class name
  @Input() icon = 'flaticon2-search-1';

  // Set true to icon as SVG or false as icon class
  @Input() useSVG: boolean;

  @Input() type: 'brand' | 'success' | 'warning' = 'success';

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  data: any[] = null;
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
  }

  /**
   * Search
   * @param e: Event
   */
  search(e) {
    this.data = null;
    if (e.target.value.length > 1) {
      this.loading = true;
      // simulate getting search result
      setTimeout(() => {
        // Uncomment this. Right now it's just mock
        // this.data = this.searchInData(e.target.value);
        this.data = [documents, members, files];
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

  openChange() {
    setTimeout(() => this.searchInput.nativeElement.focus());
  }

  showCloseButton() {
    return this.data && this.data.length && !this.loading;
  }

  // searchInData(searchText: string): any {
  //   searchText = searchText.toLowerCase().trim();
  //   const result = [];
  //   const docsResult = this.searchInContainer(searchText, documents);
  //   if (docsResult) {
  //     result.push(docsResult);
  //   }
  //
  //   const membersResult = this.searchInContainer(searchText, members);
  //   if (membersResult) {
  //     result.push(membersResult);
  //   }
  //
  //   const filesResult = this.searchInContainer(searchText, files);
  //   if (filesResult) {
  //     result.push(filesResult);
  //   }
  //
  //   return result;
  // }

  // searchInContainer(searchText, source) {
  //   const items = source.items.filter(
  //     el =>
  //       el.title.toLowerCase().indexOf(searchText) > -1 ||
  //       el.description.toLowerCase().indexOf(searchText) > -1
  //   );
  //   if (items.length === 0) {
  //     return undefined; // No results
  //   }
  //
  //   return Object.assign({items}, source);
  // }
}
