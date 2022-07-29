import {useState, useEffect} from "react";

import './App.css';

// Query
const query = `
{
  headerCollection {
    items {
      logo {
        url
      }
      hero {
        url
      }
      heroTitle
      heroDescription
      heroUrl
      titleText
      titleDescription
      ctaText
    }
  }
}
`

// Environment variables
const {VITE_REACT_APP_SPACE_ID, VITE_REACT_APP_CDA_TOKEN} = import.meta.env;

function App() {
  // define the initial state
  const [header, setHeader] = useState(null);
  console.log('check header state:', header);

  useEffect(() => {
    window
      // Change to template string & use template literals to define environment variable
      .fetch(
        `https://graphql.contentful.com/content/v1/spaces/${VITE_REACT_APP_SPACE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authenticate the request
            Authorization: `Bearer ${VITE_REACT_APP_CDA_TOKEN}`,
          },
          // send the GraphQL query
          body: JSON.stringify({query}),
        }
      )
      .then((response) => response.json())
      .then(({data, errors}) => {
        if (errors) {
          console.error(errors);
        }

        // rerender the entire component with new data
        setHeader(data.headerCollection.items[0]);
      });
  }, []);

  // show a loading screen case the data hasn't arrived yet
  if (!header) {
    return '';
  }
  return (
    <div className='App bg-bkg text-white selection:bg-accent selection:text-bkg overflow-hidden'>
      <div id='parallax'>
        <nav
          className='grid place-items-center absolute w-full top-0 z-50 drop-shadow-text-sm'
          aria-label='Primary Navigation'
        >
          <a
            href='/'
            aria-label='Go Home'
            className='p-1 m-4 focus:outline-none focus-visible:ring-4 ring-accent rounded-full transition-shadow'
          >
            <div>
              <img src={header.logo.url} alt="logo" />
            </div>
          </a>
        </nav>
        <header className='min-h-screen flex flex-col justify-evenly items-center relative'>
          <img className="absolute h-full w-full object-cover object-center -z-5" src={header.hero.url} aria-hidden="true" />
          <h1 className="text-5xl text-center z-10 font-bold tracking-wide py-12 px-20">{header.titleText}</h1>
          <a href={header.heroUrl} className="bg-accent text-bkg font-medium py-3 px-8 rounded-full border border-bkg focus:outline-none z-10 focus-visible:ring-4 ring-accent ring-offset-bkg ring-offset-2 hover:bg-accent/90">
            <span className="uppercase tracking-wide">{header.ctaText}</span>
          </a>
        </header>
      </div>
    </div>
  );
}

export default App;

// set up contentful
// create query for header, content, footer
