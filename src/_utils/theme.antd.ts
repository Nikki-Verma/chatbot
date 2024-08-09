export const PRIMARY_BRAND_COLOR = '#602EDF';
export const PRIMARY_ACTIVE_BRAND_COLOR = '#3A1C86';
export const DEFAULT_BUTTON_HOVER = '#E8DDFF';
export const DEFAULT_BUTTON_BORDER = '#AAA';
export const DEFAULT_BUTTON_TEXT_COLOR = '#222';
export const MENU_ITEM_HOVER_COLOR = '#F7F5FF';
export const LAYOUT_BG_COLOR = '#fff';
export const TERTIARY_LAYOUT_BG_COLOR = '#F3F5FB';
export const TEXT_HOVER_BG_COLOR = '#F9F9FF';
export const LINK_COLOR = '#722ED1';
export const LAST_ITEM_COLOR = '#454343e0';
export const DARK_TEXT_COLOR = '#000000';
export const TERTIARY_COLOR = '#EB2F96';
export const TEXT_PRIMARY_COLOR = '#ffffffe0';
export const TEXT_PRIMARY_DIM_COLOR = '#f9f9f9e0';
export const CONTROL_BG_COLOR = '#f5222d00';
export const NODE_SELECT_BG = '#722ed14a';
export const TABLE_BORDER_COLOR = '#CCD3DE';
export const TABLE_SORT_BG_COLOR = '#E5E5EF';
export const WHITE_BG_COLOR = '#FFFFFF';
export const BG_ELEVATED_COLOR = '#2B116E';
export const ICON_COLOR = '#e7e6e673';
export const NOTIFICATION_BG_COLOR = '#1D0E43';
export const PRIMARY_COLOR_AS_BACKGROUND = '#f7f0ff';
export const RADIO_SELECTED_BG = '#EAE1FF';
export const MASK_BACKGROUND = 'rgb(154 ,153, 153, 0.38)';
export const DRAWER_ANIMATION_DURATION = '0.5s';

const theme = {
  token: {
    colorPrimary: PRIMARY_BRAND_COLOR,
    colorInfo: PRIMARY_BRAND_COLOR,
    colorBgLayout: LAYOUT_BG_COLOR,
    fontFamily: 'var(--font-dm-sans)',
  },
  components: {
    Button: {
      colorPrimary: PRIMARY_BRAND_COLOR,
      colorPrimaryActive: PRIMARY_ACTIVE_BRAND_COLOR,
      colorPrimaryHover: PRIMARY_ACTIVE_BRAND_COLOR,
      textHoverBg: TEXT_HOVER_BG_COLOR,
      colorLink: LINK_COLOR,
      colorLinkHover: PRIMARY_ACTIVE_BRAND_COLOR,
      colorLinkActive: PRIMARY_ACTIVE_BRAND_COLOR,
      colorPrimaryBorder: LINK_COLOR,
      colorText: LINK_COLOR,
      defaultColor: DEFAULT_BUTTON_TEXT_COLOR,
      defaultHoverBg: DEFAULT_BUTTON_HOVER,
      defaultBorderColor: DEFAULT_BUTTON_BORDER,

      borderRadiusSM: 8,
      borderRadius: 8,
      borderRadiusLG: 10,

      contentFontSizeSM: 12,

      paddingInline: 24,
      paddingBlock: 6,
      paddingInlineSM: 18,
      paddingBlockSM: 4,
      paddingInlineLG: 32,
      paddingBlockLG: 6,

      contentLineHeightSM: 1,

      controlHeight: 38,
      controlHeightSM: 28,
      controlHeightLG: 44,
    },
    Breadcrumb: {
      linkHoverColor: LINK_COLOR,
      lastItemColor: LAST_ITEM_COLOR,
      linkColor: DARK_TEXT_COLOR,
      colorPrimaryBorder: LINK_COLOR,
    },
    Dropdown: {
      controlItemBgHover: TEXT_HOVER_BG_COLOR,
    },
    Pagination: {
      colorPrimary: LINK_COLOR,
      colorPrimaryBorder: LINK_COLOR,
      colorPrimaryHover: PRIMARY_ACTIVE_BRAND_COLOR,
      colorBgTextHover: TEXT_HOVER_BG_COLOR,
      controlOutline: TEXT_HOVER_BG_COLOR,
    },
    Steps: {
      colorPrimary: LINK_COLOR,
      colorPrimaryBorder: LINK_COLOR,
    },
    Cascader: {
      colorPrimaryBorder: LINK_COLOR,
      colorPrimary: LINK_COLOR,
      colorHighlight: LINK_COLOR,
    },
    Checkbox: {
      colorPrimary: LINK_COLOR,
      colorPrimaryHover: LINK_COLOR,
    },
    DatePicker: {
      activeBorderColor: LINK_COLOR,
      colorPrimary: LINK_COLOR,
    },
    Form: {
      colorPrimary: LINK_COLOR,
      controlOutline: LINK_COLOR,
      colorBorder: TERTIARY_COLOR,
      controlOutlineWidth: 0,
    },
    Input: {
      activeBorderColor: LINK_COLOR,
      hoverBorderColor: LINK_COLOR,
      colorPrimaryHover: LINK_COLOR,
      colorPrimaryActive: TEXT_HOVER_BG_COLOR,
      colorPrimary: LINK_COLOR,
      controlHeight: 44,
    },
    InputNumber: {
      activeBorderColor: LINK_COLOR,
      handleHoverColor: LINK_COLOR,
      hoverBorderColor: LINK_COLOR,
      controlHeight: 44,
    },
    Mentions: {
      activeBorderColor: LINK_COLOR,
      hoverBorderColor: LINK_COLOR,
    },
    Radio: {
      colorPrimary: LINK_COLOR,
      buttonSolidCheckedActiveBg: RADIO_SELECTED_BG,
      buttonSolidCheckedBg: RADIO_SELECTED_BG,
      buttonSolidCheckedHoverBg: RADIO_SELECTED_BG,
      buttonSolidCheckedColor: PRIMARY_BRAND_COLOR,
      controlHeightLG: 40,
      fontSizeLG: 14,
      buttonPaddingInline: 30,
    },
    Select: {
      optionSelectedBg: TEXT_HOVER_BG_COLOR,
      optionSelectedColor: LINK_COLOR,
      colorPrimary: LINK_COLOR,
      colorPrimaryHover: LINK_COLOR,
      controlHeight: 44,
    },
    Switch: {
      colorPrimary: LINK_COLOR,
      colorPrimaryHover: PRIMARY_ACTIVE_BRAND_COLOR,
    },
    TreeSelect: {
      colorPrimaryHover: LINK_COLOR,
      colorPrimaryBorder: LINK_COLOR,
      colorPrimary: LINK_COLOR,
      nodeSelectedBg: TEXT_HOVER_BG_COLOR,
      controlItemBgHover: TEXT_HOVER_BG_COLOR,
      nodeHoverBg: TEXT_HOVER_BG_COLOR,
    },
    Slider: {
      handleColor: PRIMARY_BRAND_COLOR,
      trackBg: PRIMARY_BRAND_COLOR,
      trackHoverBg: PRIMARY_ACTIVE_BRAND_COLOR,
      handleActiveColor: PRIMARY_ACTIVE_BRAND_COLOR,
    },
    Upload: {
      colorPrimary: LINK_COLOR,
      colorPrimaryHover: LINK_COLOR,
    },
    Avatar: {
      colorTextPlaceholder: TEXT_HOVER_BG_COLOR,
      colorTextLightSolid: LINK_COLOR,
    },
    Badge: {
      colorError: LINK_COLOR,
    },
    Calendar: {
      itemActiveBg: TEXT_HOVER_BG_COLOR,
      colorPrimary: LINK_COLOR,
      controlItemBgHover: TEXT_HOVER_BG_COLOR,
      colorIconHover: TERTIARY_COLOR,
      controlItemBgActive: LINK_COLOR,
    },
    Segmented: {
      trackBg: TEXT_HOVER_BG_COLOR,
      itemSelectedBg: PRIMARY_BRAND_COLOR,
      itemSelectedColor: TEXT_PRIMARY_COLOR,
      colorText: LINK_COLOR,
    },
    Statistic: {
      colorText: LINK_COLOR,
      colorTextHeading: LINK_COLOR,
    },
    Table: {
      rowHoverBg: TEXT_HOVER_BG_COLOR,
      headerBg: TEXT_HOVER_BG_COLOR,
      colorLinkHover: LINK_COLOR,
      colorLinkActive: LINK_COLOR,
      colorLink: LINK_COLOR,
      colorPrimary: LINK_COLOR,
      rowSelectedHoverBg: TEXT_HOVER_BG_COLOR,
      controlItemBgHover: CONTROL_BG_COLOR,
      controlItemBgActive: TEXT_HOVER_BG_COLOR,
      rowSelectedBg: TEXT_HOVER_BG_COLOR,
      borderColor: TABLE_BORDER_COLOR,
      bodySortBg: TABLE_SORT_BG_COLOR,
      rowExpandedBg: LAYOUT_BG_COLOR,
    },
    Tabs: {
      inkBarColor: PRIMARY_BRAND_COLOR,
      itemActiveColor: LINK_COLOR,
      itemHoverColor: LINK_COLOR,
      itemSelectedColor: LINK_COLOR,
      colorBorder: LINK_COLOR,
      colorPrimaryBorder: LINK_COLOR,
    },
    Timeline: {
      colorPrimary: LINK_COLOR,
      colorSuccess: LINK_COLOR,
    },
    Tooltip: {
      colorBgSpotlight: TEXT_HOVER_BG_COLOR,
      colorTextLightSolid: DARK_TEXT_COLOR,
    },
    Tree: {
      directoryNodeSelectedBg: LINK_COLOR,
      colorPrimaryHover: PRIMARY_ACTIVE_BRAND_COLOR,
      nodeHoverBg: TEXT_HOVER_BG_COLOR,
      nodeSelectedBg: NODE_SELECT_BG,
      colorPrimaryBorder: WHITE_BG_COLOR,
      colorPrimary: LINK_COLOR,
    },
    Message: {
      colorInfo: LINK_COLOR,
    },

    Notification: {
      colorBgElevated: NOTIFICATION_BG_COLOR,
      colorIcon: WHITE_BG_COLOR,
      colorIconHover: WHITE_BG_COLOR,
      colorInfo: WHITE_BG_COLOR,
      colorSuccess: WHITE_BG_COLOR,
      colorText: WHITE_BG_COLOR,
      colorTextHeading: WHITE_BG_COLOR,
      width: 400,
      boxShadow: '2px 4px 4px 0px rgba(54, 54, 54, 0.25)',
    },
    Popover: {
      zIndexPopup: 999,
    },
    // Popconfirm: {
    //   colorWarning: WHITE_BG_COLOR,
    // },
    Progress: {
      defaultColor: LINK_COLOR,
    },
    Result: {
      colorSuccess: PRIMARY_ACTIVE_BRAND_COLOR,
    },
    Spin: {
      colorPrimary: LINK_COLOR,
    },
    Drawer: {
      colorBgMask: MASK_BACKGROUND,
      motionDurationMid: DRAWER_ANIMATION_DURATION,
      motionDurationSlow: DRAWER_ANIMATION_DURATION,
    },
    Modal: {
      colorBgMask: MASK_BACKGROUND,
    },
  },
};

export default theme;
