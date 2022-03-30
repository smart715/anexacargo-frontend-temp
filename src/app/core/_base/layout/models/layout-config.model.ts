export interface LayoutConfigModel {
  demo: string;
  js: {
    breakpoints: {
      sm?: number,
      md?: number,
      lg?: number,
      xl?: number,
      xxl?: number,
    },
    colors: {
      theme?: {
        base: any;
        light: any;
        inverse: any;
      },
      gray?: any;
    },
    fontFamily?: 'Poppins';
  };
  self: {
    layout?: 'default' | 'blank';
  };
  'page-loader': {
    type?: string | 'default' | 'spinner-message' | 'spinner-logo';
  };
  header: {
    self: {
      display?: boolean;
      width?: 'fluid' | 'fixed';
      theme?: 'light' | 'dark';
      fixed: {
        desktop: boolean;
        mobile: boolean
      }
    };
    menu?: {
      self: {
        display: boolean;
        layout?: 'default' | 'tab';
        rootArrow?: boolean;
        'icon-style'?: 'duotone' | 'line' | 'bold' | 'solid';
      };
      desktop: {
        arrow: boolean;
        toggle: string;
        submenu: {
          theme?: 'light' | 'dark';
          arrow: boolean
        }
      };
      mobile: {
        submenu: {
          theme: 'dark' | 'light';
          accordion: boolean
        }
      }
    }
  };
  subheader?: {
    display: boolean;
    displayDesc?: boolean;
    displayDaterangepicker?: boolean;
    layout?: 'subheader-v1' | 'subheader-v2' | 'subheader-v3' | 'subheader-v4';
    fixed?: boolean;
    width?: 'fluid' | 'fixed';
    clear?: boolean;
    layouts?: any;
    style?: 'light' | 'solid' | 'transparent';
  };
  content?: {
    width?: 'fluid' | 'fixed'
  };
  brand?: {
    self: {
      theme: 'light' | 'dark'
    }
  };
  aside?: {
    self: {
      theme?: 'dark' | 'light';
      display: boolean;
      fixed?: boolean | any;
      minimize?: {
        toggle: boolean;
        default: boolean;
        hoverable: boolean;
      }
    };
    footer?: {
      self: {
        display: boolean
      }
    };
    menu: {
      dropdown: boolean;
      scroll: boolean;
      'icon-style'?: 'duotone' | 'line' | 'bold' | 'solid';
      submenu: {
        accordion: boolean;
        dropdown: {
          arrow: boolean;
          'hover-timeout': number
        }
      }
    }
  };
  footer?: {
    width?: 'fluid' | 'fixed';
    fixed?: boolean
  };
  extras: {
    search?: {
      display?: boolean;
      layout?: 'dropdown' | 'offcanvas';
      offcanvas?: {
        direction: 'right' | 'left'
      };
    };
    notifications?: {
      display?: boolean;
      layout?: 'dropdown' | 'offcanvas';
      dropdown?: {
        style?: 'dark' | 'light';
      };
      offcanvas?: {
        direction?: 'right' | 'left'
      }
    },
    'quick-actions'?: {
      display?: boolean;
      layout?: 'dropdown' | 'offcanvas';
      dropdown?: {
        style: 'light' | 'dark';
      };
      offcanvas?: {
        direction: 'right' | 'left'
      };
    };
    user?: {
      display?: boolean;
      layout?: 'offcanvas' | 'dropdown',
      dropdown?: {
        style?: 'light' | 'dark'
      },
      offcanvas?: {
        direction: 'right' | 'left'
      }
    };
    languages?: {
      display?: boolean;
    };
    cart?: {
      display?: boolean;
      dropdown?: {
        style: 'dark' | 'light'
      };
    };
    'quick-panel'?: {
      display?: true;
      offcanvas?: {
        direction: 'right' | 'left'
      };
    };
    chat?: {
      display?: boolean;
    };
    toolbar?: {
      display?: boolean;
    };
    scrolltop?: {
      display: boolean;
    };
  };
}
