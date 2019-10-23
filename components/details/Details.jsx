import React from 'react';
import showdown from 'showdown';
import Collapse from '@kunukn/react-collapse';

import { formatShortDate, formatLongDate } from '~/utils/date';
import CloseIcon from '~/public/static/icons/Close.svg';
import NextIcon from '~/public/static/icons/Next.svg';
import PreviousIcon from '~/public/static/icons/Previous.svg';
import UpIcon from '~/public/static/icons/Up.svg';

let converter = new showdown.Converter();

const Details = ({
  isDetailsOpen,
  setIsDetailsOpen,
  selectedArticle,
  isDetailsExpanded,
  toggleExpanded,
  forwardedRef,
}) => {
  let fields = selectedArticle && selectedArticle.fields;

  return (
    <>
      <div
        className="detail"
        ref={forwardedRef}
        style={{ display: isDetailsOpen ? '' : 'none' }}
      >
        <div className="detail__content">
          {fields && (
            <>
              <time>
                {fields.location}, {formatLongDate(fields.publicationDate)}
              </time>
              <h2 className="detail__title">{fields.title}</h2>

              <h3 className="detail__teaser">{fields.subtitle}</h3>
              <button className="toggle" onClick={toggleExpanded}>
                {isDetailsExpanded ? 'Read less' : 'Read more'}
              </button>
              <Collapse isOpen={isDetailsExpanded}>
                <div
                  className="detail__content"
                  dangerouslySetInnerHTML={{
                    __html: converter.makeHtml(fields.content),
                  }}
                ></div>
              </Collapse>
              <button
                aria-label="close"
                className="detail__button-close-top"
                onClick={() => setIsDetailsOpen(false)}
              >
                <CloseIcon />
              </button>

              <div className="detail__button-close-bottom-wrapper">
                <button
                  aria-label="close"
                  className="detail__button-close-bottom"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .detail {
          position: fixed;
          top: 5px;
          right: 5px;
          overflow-y: auto;
          max-height: calc(100% - 50px);
          @include elevation-3;
          pointer-events: all;
          padding-bottom: 20px;
          background: rgba(255, 255, 255, 1);
          padding: 10px;
          width: 700px;
          max-width: 80vw;
          @media (min-width: 700px) {
            max-width: 85vw;
          }
          @media (min-width: 1500px) {
            width: 800px;
          }
          @media (min-width: 2100px) {
            right: 5%;
          }
        }
        .detail__content {
        }
        .detail__title {
          padding-right: 10px;
        }
        .detail__button-close-top {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 100%;
          padding: 10px;
          box-shadow: none;
          background: none;
          color: gray;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .detail__button-close-bottom-wrapper {
          position: relative;
          text-align: right;
        }
        .detail__button-close-bottom {
          font-size: 100%;
          padding: 10px;
          margin: -10px;
          box-shadow: none;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: auto;
          color: gray;
          background: none;
        }
        .toggle {
          font-size: 100%;
          padding: 10px 0;
          background: none;
          border: none;
          min-width: 6em;
          text-decoration: underline;
          color: gray;
          text-align: left;
        }
      `}</style>
    </>
  );
};

export default React.forwardRef(Details);
