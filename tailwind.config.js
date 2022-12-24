// const colorized = require('./tailwind.color.config')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xxs: '300px',
      xs: '359px',
      sm: '576px',
      md: '768px',
      lg: '1200px',
      xl: '1440px',
      xxl: '1920px',
    },
    extend: {

      rotate: {
        '20': '20deg',
      },
      spacing: {
        '4%': '4%',
        '6%': '6%',
        '8%': '8%',
        '10%': '10%',
      },
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
        't-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        't-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        't-xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        't-2xl': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        't-3xl': '0 -35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    }
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {


      // Width
      const widths = Array.from(Array(3001).keys())
      const objWidth = widths.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.w-${key}-px`]: {
              width: `${key}px`
            }
          }),
        {}
      )

      // Max Width
      const maxWidths = Array.from(Array(3001).keys())
      const objMaxWidth = maxWidths.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.max-w-${key}-px`]: {
              'max-width': `${key}px`
            }
          }),
        {}
      )

      // Min Width
      const minWidths = Array.from(Array(3001).keys())
      const objMinWidth = minWidths.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.min-w-${key}-px`]: {
              'min-width': `${key}px`
            }
          }),
        {}
      )

      // Height
      const heights = Array.from(Array(3001).keys())
      const objHeight = heights.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.h-${key}-px`]: {
              height: `${key}px`
            }
          }),
        {}
      )

      // Min Height
      const minHeight = Array.from(Array(3001).keys())
      const objMinHeight = minHeight.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.min-h-${key}-px`]: {
              'min-height': `${key}px`
            }
          }),
        {}
      )

      // Max Height
      const maxHeight = Array.from(Array(3001).keys())
      const objMaxHeight = maxHeight.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.max-h-${key}-px`]: {
              'max-height': `${key}px`
            }
          }),
        {}
      )

      // Top
      const top = Array.from(Array(3001).keys())
      const objTop = top.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.t-${key}-px`]: {
              'top': `${key}px`
            }
          }),
        {}
      )

      // Left
      const left = Array.from(Array(3001).keys())
      const objLeft = left.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.l-${key}-px`]: {
              'left': `${key}px`
            }
          }),
        {}
      )

      // Bottom
      const bottom = Array.from(Array(3001).keys())
      const objBottom = bottom.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.b-${key}-px`]: {
              'bottom': `${key}px`
            }
          }),
        {}
      )

      // Right
      const right = Array.from(Array(3001).keys())
      const objRight = right.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.r-${key}-px`]: {
              'right': `${key}px`
            }
          }),
        {}
      )

      // Top -
      const topMinus = Array.from(Array(3001).keys())
      const objTopMinus = topMinus.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.-t-${key}-px`]: {
              'top': `-${key}px`
            }
          }),
        {}
      )

      // Bottom -
      const bottomMinus = Array.from(Array(3001).keys())
      const objBottomMinus = bottomMinus.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.-b-${key}-px`]: {
              'bottom': `-${key}px`
            }
          }),
        {}
      )

      // Right -
      const rightMinus = Array.from(Array(3001).keys())
      const objRightMinus = rightMinus.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.-r-${key}-px`]: {
              'right': `-${key}px`
            }
          }),
        {}
      )

      // Left -
      const leftMinus = Array.from(Array(3001).keys())
      const objLeftMinus = leftMinus.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.-l-${key}-px`]: {
              'left': `-${key}px`
            }
          }),
        {}
      )

      // Font Sizes
      const fontSizes = Array.from(Array(100).keys())
      const objFontSizes = fontSizes.reduce(
        (o, key) =>
          Object.assign(o, {
            [`.f-${key}-px`]: {
              fontSize: `${key}px`
            }
          }),
        {}
      )

      addUtilities({
        ...objWidth,
        ...objMaxWidth,
        ...objMinWidth,
        ...objHeight,
        ...objMaxHeight,
        ...objMinHeight,
        ...objTop,
        ...objLeft,
        ...objBottom,
        ...objRight,
        ...objBottomMinus,
        ...objTopMinus,
        ...objRightMinus,
        ...objLeftMinus,
        ...objFontSizes,
      })
    }),
    require('@tailwindcss/forms')
  ]
}
