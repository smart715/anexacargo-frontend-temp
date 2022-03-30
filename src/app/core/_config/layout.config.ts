import { LayoutConfigModel } from '../_base/layout';

export class LayoutConfig {
  public defaults: LayoutConfigModel = {
    demo: 'demo1',
    js: {
      breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1200,
      },
      colors: {
        theme: {
          base: {
            white: '#ffffff',
            primary: '#6993FF',
            secondary: '#E5EAEE',
            success: '#1BC5BD',
            info: '#8950FC',
            warning: '#FFA800',
            danger: '#F64E60',
            light: '#F3F6F9',
            dark: '#212121',
          },
          light: {
            white: '#ffffff',
            primary: '#E1E9FF',
            secondary: '#ECF0F3',
            success: '#C9F7F5',
            info: '#EEE5FF',
            warning: '#FFF4DE',
            danger: '#FFE2E5',
            light: '#F3F6F9',
            dark: '#D6D6E0',
          },
          inverse: {
            white: '#ffffff',
            primary: '#ffffff',
            secondary: '#212121',
            success: '#ffffff',
            info: '#ffffff',
            warning: '#ffffff',
            danger: '#ffffff',
            light: '#464E5F',
            dark: '#ffffff',
          },
        },
        gray: {
          gray100: '#F3F6F9',
          gray200: '#ECF0F3',
          gray300: '#E5EAEE',
          gray400: '#D6D6E0',
          gray500: '#B5B5C3',
          gray600: '#80808F',
          gray700: '#464E5F',
          gray800: '#1B283F',
          gray900: '#212121',
        },
      },
      fontFamily: 'Poppins',
    },
    // == Base Layout
    self: {
      layout: 'default', // blank/default page mode
    },
    // == Page Splash Screen loading
    'page-loader': {
      type: 'default' // default|spinner-message|spinner-logo
    },
    header: {
      self: {
        display: true,
        width: 'fluid', // fixed|fluid,
        theme: 'light', // light|dark
        fixed: {
          desktop: true,
          mobile: true,
        },
      },
      menu: {
        self: {
          display: true,
          layout: 'default', // tab/default,
          rootArrow: false,
          'icon-style': 'duotone', // duotone, line, bold, solid
        },
        desktop: {
          arrow: true,
          toggle: 'click',
          submenu: {
            theme: 'light', // light/dark
            arrow: true,
          },
        },
        mobile: {
          submenu: {
            theme: 'dark',  // light/dark
            accordion: true,
          },
        },
      },
    },
    subheader: {
      display: true,
      displayDesc: false,
      displayDaterangepicker: true,
      layout: 'subheader-v1', // 'subheader-v2'|'subheader-v3'
      fixed: true,
      width: 'fluid', // fixed|fluid
      clear: false,
      style: 'solid', // transparent/solid
    },
    content: {
      width: 'fixed', // fluid/fixed
    },
    brand: {
      self: {
        theme: 'dark', // light/dark
      },
    },
    aside: {
      self: {
        theme: 'dark', // light/dark
        display: true,
        fixed: true,
        minimize: {
          toggle: true, // allow toggle
          default: false, // default state
          hoverable: true
        },
      },
      footer: {
        self: {
          display: true,
        },
      },
      menu: {
        dropdown: false, // ok
        scroll: false, // ok
        'icon-style': 'duotone',
        submenu: {
          accordion: true,
          dropdown: {
            arrow: true,
            'hover-timeout': 500 // in milliseconds
          },
        },
      },
    },
    footer: {
      width: 'fluid',
      fixed: false
    },
    extras: {
      search: {
        display: true,
        layout: 'dropdown', // offcanvas, dropdown
        offcanvas: {
          direction: 'right'
        }
      },
      notifications: {
        display: true,
        layout: 'dropdown', // offcanvas, dropdown
        dropdown: {
          style: 'dark' // light|dark
        },
        offcanvas: {
          direction: 'right'
        }
      },
      user: {
        display: true,
        layout: 'offcanvas', // offcanvas, dropdown
        dropdown: {
          style: 'dark', // light|dark
        },
        offcanvas: {
          direction: 'right'
        }
      },
      languages: {
        display: true
      },
      cart: {
        display: true,
        dropdown: {
          style: 'dark'
        }
      },
      'quick-actions': {
        display: true,
        layout: 'dropdown', // offcanvas, dropdown
        dropdown: {
          style: 'dark'
        },
        offcanvas: {
          direction: 'right'
        }
      },
      'quick-panel': {
        display: true,
        offcanvas: {
          direction: 'right'
        }
      },
      chat: {
        display: false
      },
      toolbar: {
        display: true
      },
      scrolltop: {
        display: true
      }
    }
  };

  /**
   * Good place for getting the remote config
   */
  public get configs(): LayoutConfigModel {
    return this.defaults;
  }
}
