// Angular
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { result } from 'lodash';
// Object-Path
import * as objectPath from 'object-path';
import { ImageService } from 'src/app/service/image.service';
// Layout
import { LayoutConfigService, SplashScreenService } from '../../../../core/_base/layout';

@Component({
  selector: 'kt-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  // Public properties
  loaderType: string;
  image_url;
  @ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;

  /**
   * Component constructor
   *
   * @param el: ElementRef
   * @param layoutConfigService: LayoutConfigService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private el: ElementRef,
    private layoutConfigService: LayoutConfigService,
    private uploader: ImageService,
    private cdr: ChangeDetectorRef,

    private splashScreenService: SplashScreenService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    // init splash screen, see loader option in layout.config.ts
    this.uploader.getImageUrl().then(result => {
      this.image_url = result[0]?.image_url;
      // console.log(result)
      // console.log(this.image_url)
      // console.log(result[0]["image_url"])
      this.cdr.detectChanges();
    })
    const loaderConfig = this.layoutConfigService.getConfig('loader');
    this.loaderType = objectPath.get(loaderConfig, 'page-loader.type');

    this.splashScreenService.init(this.splashScreen);
  }
}
