// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect ScrollBar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CodePreviewComponent } from './code-preview.component';
// Core Module
import { CoreModule } from '../../../../../core/core.module';
// Highlight JS
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
	imports: [
		CommonModule,
		CoreModule,
		HighlightModule,
		PerfectScrollbarModule,
		ClipboardModule,

		// ngbootstrap
		NgbTabsetModule,
		NgbTooltipModule,
	],
	exports: [CodePreviewComponent],
	declarations: [CodePreviewComponent]
})
export class CodePreviewModule {
}
