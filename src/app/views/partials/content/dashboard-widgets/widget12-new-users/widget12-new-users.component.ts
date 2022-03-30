// Angular
import {Component, Input, OnInit} from '@angular/core';
import {LayoutConfigService} from '../../../../../core/_base/layout';


@Component({
  selector: 'kt-widget12-new-users',
  templateUrl: './widget12-new-users.component.html'
})
export class Widget12NewUsersComponent implements OnInit {
  @Input() cssClasses = '';
  chartOptions: any = {};
  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBaseDanger = '';
  colorsThemeBasePrimary = '';
  colorsThemeLightPrimary = '';

  constructor(private layoutConfigService: LayoutConfigService) {
    this.fontFamily = this.layoutConfigService.getConfig('js.fontFamily');
    this.colorsGrayGray500 = this.layoutConfigService.getConfig('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layoutConfigService.getConfig('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layoutConfigService.getConfig('js.colors.gray.gray300');
    this.colorsThemeBaseDanger = this.layoutConfigService.getConfig('js.colors.theme.base.danger');
    this.colorsThemeBasePrimary = this.layoutConfigService.getConfig('js.colors.theme.base.primary');
    this.colorsThemeLightPrimary = this.layoutConfigService.getConfig('js.colors.theme.light.primary');
  }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
  }

  getChartOptions() {
    return {
      series: [
        {
          name: 'Net Profit',
          data: [40, 40, 30, 30, 35, 35, 50]
        }
      ],
      chart: {
        type: 'area',
        height: 150,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {},
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid',
        opacity: 1
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [this.colorsThemeBasePrimary]
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        },
        crosshairs: {
          show: false,
          position: 'front',
          stroke: {
            color: this.colorsGrayGray300,
            width: 1,
            dashArray: 3
          }
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      yaxis: {
        min: 0,
        max: 55,
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily
        },
        y: {
          // tslint:disable-next-line
          formatter: function (val) {
            return '$' + val + ' thousands';
          }
        },
        marker: {
          show: false
        }
      },
      colors: [this.colorsThemeLightPrimary],
      markers: {
        colors: this.colorsThemeLightPrimary,
        strokeColor: [this.colorsThemeBasePrimary],
        strokeWidth: 3
      }
    };
  }
}
