import { useStore } from 'laco-react'

import store from '~/store.js'
import DFDSLogo from '~/public/icons/DFDSLogo.svg'
import CloseIcon from '~/public/icons/Close.svg'
import NextIcon from '~/public/icons/Next.svg'
import PreviousIcon from '~/public/icons/Previous.svg'

const Footer = ({ isFirstDetailSSR }) => {
  let { footerFocusEvent } = useStore(store)

  React.useEffect(() => {
    if (footerFocusEvent) {
      if (ref?.current) {
        let element = ref.current.querySelector('a')
        element && element.focus()
      }
    }
  }, [footerFocusEvent])

  let ref = React.useRef()

  if (isFirstDetailSSR) return null

  return (
    <>
      <div className='footer' ref={ref}>
        <div className='footer__content'>
          {!isFirstDetailSSR && (
            <div className='year-group'>
              <a href='#first-news-item'>First</a>
              <a href='#2019'>’19</a>
              <a href='#2018'>’18</a>
              <a href='#2017'>’17</a>
              <a href='#2016'>’16</a>
              <a href='#2015'>’15</a>
              <a href='#2014'>’14</a>
              <a href='#2013'>’13</a>
              <a href='#2012'>’12</a>
              <a href='#2011'>’11</a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .footer {
          z-index: 2;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40px;
          pointer-events: none;
        }

        .footer__content {
          height: inherit;
          @include device-width;
          background: rgba($color-background, 0.95);
          @supports (backdrop-filter: blur(10px)) {
            background: rgba($color-background, 0.9);
            backdrop-filter: saturate(180%) blur(6px);
          }
          box-shadow: 0 0 10px darkgray;
          @include elevation-1;
          pointer-events: all;
          font-size: 16px;
          display: flex;
          align-items: center;
          pointer-events: none;
          padding: 0;
        }
        .year-group {
          display: flex;
          align-items: center;
          pointer-events: all;
          overflow-x: auto;
          overscroll-behavior: contain;
          height: inherit;
          padding: 5px 10px;

          a {
            min-width: 42px;
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            color: $color-groupBlue;
            padding: 0px 10px;
            background: white;
            align-self: stretch;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            &::after {
              display: none;
              content: '';
              position: absolute;
              top: -4px;
              left: -4px;
              width: calc(100% + 8px);
              height: calc(100% + 8px);
              border: 2px solid $color-actionBlue;
              border-radius: 3px;
            }
            &:focus {
              outline: none;
              &::after {
                display: block;
              }
            }
          }
        }
      `}</style>
    </>
  )
}

export default Footer
