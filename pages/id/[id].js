// List overview
// https://cdn.contentful.com/spaces/mivicpf5zews/environments/master/entries?content_type=newsArticle&locale=en&select=sys.id,fields.entryTitle,fields.publicationDate&order=-fields.publicationDate&limit=10&skip=0&access_token=102b6ce0b5beb8e64d0139b604153c92f7476229ee4d2ed5fa3608f2b72640e4

// Details page
// https://cdn.contentful.com/spaces/mivicpf5zews/environments/master/entries/6IMNKTmUUkPRq7SphXcY0U?access_token=102b6ce0b5beb8e64d0139b604153c92f7476229ee4d2ed5fa3608f2b72640e4

import dynamic from 'next/dynamic';
//import Link from 'next/link';
import { useRouter } from 'next/router';
import NextHead from 'next/head';
//import cx from "clsx";
//import { useStore } from 'laco-react';
//import debounce from "lodash.debounce";
import Router from 'next/router';

//import store from '~/store.js';
import getArticle from '~/api-layer/getArticle';
import getNewsList from '~/api-layer/getNewsList';
//import getQueryParams from '~/utils/getQueryParams';
import { filterItemsByCriteria } from '~/utils/filter';

import Header from '~/components/header/Header';
import Overview from '~/components/overview/Overview';
import BackgroundImage from '~/components/website-background-image/BackgroundImage';

const Details = dynamic(() => import('~/components/details/Details'), {
  ssr: true,
});
const DetailsForwardedRef = React.forwardRef((props, ref) => (
  <Details {...props} forwardedRef={ref} />
));

const Footer = dynamic(() => import('~/components/footer/Footer'), {
  ssr: false,
});
const Filter = dynamic(() => import('~/components/filter/Filter'), {
  ssr: false,
});

const defaultDocTitle = 'DFDS NEWS';

let pageMode = '';

const Index = ({
  items: itemsProp = [],
  article = null,
  id,
  detailsSSR,
  overviewSSR,
}) => {
  let cache = React.useRef({}).current;

  if (overviewSSR) pageMode = 'overview';
  if (detailsSSR) pageMode = 'details';

  if (id && article) {
    cache[id] = article;
  }

  //let { windowHeight, windowWidth } = useStore(store);

  const router = useRouter();

  const detailsRef = React.createRef();
  let [items, setItems] = React.useState(itemsProp);
  let [renderedItems, setRenderedItems] = React.useState(itemsProp);
  let [isDetailsExpanded, setIsDetailsExpanded] = React.useState(true);
  let [selectedArticle, setSelectedArticle] = React.useState(article);
  let [isDetailsOpen, setIsDetailsOpen] = React.useState(!!article);
  let [isBackgroundImageEnabled, setIsBackgroundImageEnabled] = React.useState(
    false
  );
  let [isFilterOpen, setIsFilterOpen] = React.useState(false);

  let [isFilter1Active, setIsFilter1Active] = React.useState(false);
  let [isFilter2Active, setIsFilter2Active] = React.useState(false);
  let [isFilter3Active, setIsFilter3Active] = React.useState(false);

  let onFilterClick1 = () => {
    setIsFilter1Active(s => !s);
  };
  let onFilterClick2 = () => {
    setIsFilter2Active(s => !s);
  };
  let onFilterClick3 = () => {
    setIsFilter3Active(s => !s);
  };
  let onBackgroundImageToggle = () => {
    setIsBackgroundImageEnabled(s => !s);
  };

  let onDetailsClose = event => {
    event?.preventDefault && event.preventDefault();

    // Quick coding: the state should be updated by url changes. Here I do both.
    // I could use router-change-events.js to update the global state.
    setIsDetailsOpen(false); // Update State
    const href = `/`;
    const as = `/`;
    Router.push(href, as, { shallow: true }); // Update url
    pageMode = 'overview';
  };

  React.useEffect(() => {
    if (selectedArticle && isDetailsOpen && detailsRef && detailsRef.current) {
      detailsRef.current.scrollTop = 0;
    }
  }, [isDetailsOpen, detailsRef, selectedArticle]);

  let getAllNews = async () => {
    let news = await getNewsList(200);
    setItems((news && news.items) || []);
  };

  React.useEffect(() => {
    if (overviewSSR) {
      document.title = defaultDocTitle;
      getAllNews();
    }
  }, []);

  // Updatey by query strings
  React.useEffect(() => {
    let query = router.query;

    if (query.filter) setIsFilterOpen(true);

    if (query.roboto) setIsFilter3Active(true);

    if (query.background) setIsBackgroundImageEnabled(true);

    if (+query.item) {
      let index = +query.item;
      index && selectArticleById(items[index - 1].sys.id);
    }
  }, []);

  React.useEffect(() => {
    if (isFilter3Active) {
      document.body.style.fontFamily = 'Roboto, sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }
  }, [isFilter3Active]);

  // Rendered items
  React.useEffect(() => {
    let result = filterItemsByCriteria({
      items,
      isDfds: isFilter1Active,
      is2019: isFilter2Active,
    });
    setRenderedItems(result);
  }, [items, isFilter1Active, isFilter2Active]);

  React.useEffect(() => {
    if (isDetailsOpen) {
      //document.body.style.overflow = 'hidden';
    } else {
      //document.body.style.overflow = '';
    }
  }, [isDetailsOpen]);

  React.useEffect(() => {
    if (isDetailsOpen) {
      if (selectedArticle?.fields?.title) {
        document.title = selectedArticle.fields.title;
      }
    } else {
      document.title = defaultDocTitle;
    }
  }, [isDetailsOpen, selectedArticle]);

  if (!items) return <div className="news">Failed loading data, sorry.</div>;

  let selectArticleById = async ({ event, id }) => {
    event && event.preventDefault && event.preventDefault();

    // Quick coding: the state should be updated by url changes. Here I do both.
    // I could use router-change-events.js to update the global state.
    const href = `/?id=${id}`;
    const as = `/id/${id}`;
    Router.push(href, as, { shallow: true }); // Update Url
    pageMode = 'details';

    // Update State
    if (cache[id]) {
      setSelectedArticle(cache[id]);
    } else {
      let result = await getArticle(id);
      cache[id] = result;
      setSelectedArticle(result);
    }

    setIsDetailsOpen(true);
  };

  return (
    <>
      <NextHead>
        <title>{defaultDocTitle}</title>
      </NextHead>
      <BackgroundImage isEnabled={isBackgroundImageEnabled} />
      <Overview
        {...{
          items: renderedItems,
          selectArticleById,
          isDetailsOpen,
        }}
      >
        {renderedItems.length === 0 && (
          <button className="btn-get-all-news" onClick={getAllNews}>
            Load news
          </button>
        )}
      </Overview>
      <Header
        {...{
          count: renderedItems.length,
          setIsFilterOpen,
        }}
      />

      <DetailsForwardedRef
        {...{
          forwardedRef: detailsRef,
          ref: detailsRef,
          isDetailsOpen,
          onDetailsClose,
          selectedArticle,
          isDetailsExpanded,
          toggleExpanded: () => setIsDetailsExpanded(s => !s),
        }}
      />

      <Filter
        {...{
          isFilterOpen,
          isFilter1Active,
          isFilter2Active,
          isFilter3Active,
          onFilterClick1,
          onFilterClick2,
          onFilterClick3,
          isBackgroundImageEnabled,
          onBackgroundImageToggle,
          onClose: () => setIsFilterOpen(false),
        }}
      />

      <Footer {...{}} />
      <style jsx>{`
        .btn-get-all-news {
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </>
  );
};

Index.getInitialProps = async ({ req, query }) => {
  if (query.id) {
    let article = await getArticle(query.id);
    return { id: query.id, article, detailsSSR: true };
  }

  let { items } = await getNewsList();
  return { items, overviewSSR: true };
};

export default Index;