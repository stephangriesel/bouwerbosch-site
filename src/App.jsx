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
      titleText
      titleDescription
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
          className='grid place-items-center absolute w-full top-0 z-50'
          aria-label='Primary Navigation'
        >
          <a
            href='/'
            aria-label='Go Home'
            className='p-1 m-4 focus:outline-none focus-visible:ring-4 ring-accent rounded-full transition-shadow'
          >
            <svg
              version='1.0'
              xmlns='http://www.w3.org/2000/svg'
              width='363.000000pt'
              height='270.000000pt'
              viewBox='0 0 363.000000 270.000000'
              preserveAspectRatio='xMidYMid meet'
              class='w-32 sm:w-48 lg:w-56'
            >
              <g
                transform='translate(0.000000,270.000000) scale(0.100000,-0.100000)'
                fill='#000000'
                stroke='none'
              >
                <path d='M650 2000 l0 -280 75 0 75 0 0 280 0 280 -75 0 -75 0 0 -280z' />
                <path
                  d='M1940 2001 l0 -281 80 0 80 0 0 206 0 206 263 -4 c245 -4 266 -5 322
-27 126 -49 235 -208 235 -343 l0 -38 80 0 80 0 0 33 c0 50 -36 184 -67 247
-32 67 -139 175 -209 212 -102 55 -140 60 -516 65 l-348 6 0 -282z'
                />
                <path
                  d='M1110 1455 c0 -36 -2 -65 -4 -65 -2 0 -16 6 -30 14 -32 16 -69 10
-92 -15 -20 -22 -30 -109 -20 -164 13 -67 72 -96 124 -59 20 14 22 14 22 0 0
-9 5 -16 10 -16 6 0 10 68 10 185 0 117 -4 185 -10 185 -6 0 -10 -28 -10 -65z
m-18 -82 c14 -13 18 -31 18 -88 0 -84 -13 -108 -59 -108 -39 0 -50 10 -62 59
-24 107 41 194 103 137z'
                />
                <path
                  d='M280 1325 l0 -175 85 0 c69 0 85 3 85 15 0 12 -14 15 -70 15 l-70 0
0 160 c0 136 -2 160 -15 160 -13 0 -15 -26 -15 -175z'
                />
                <path
                  d='M1210 1485 c0 -8 7 -15 15 -15 8 0 15 7 15 15 0 8 -7 15 -15 15 -8 0
-15 -7 -15 -15z'
                />
                <path
                  d='M1900 1325 c0 -149 2 -175 15 -175 12 0 15 15 15 75 l0 75 54 0 c69
0 83 6 101 41 19 36 19 72 0 109 -21 41 -43 50 -119 50 l-66 0 0 -175z m150
130 c27 -25 27 -88 0 -115 -15 -15 -33 -20 -70 -20 l-50 0 0 81 0 82 50 -5
c28 -3 59 -13 70 -23z'
                />
                <path
                  d='M543 1405 c-17 -7 -34 -23 -38 -35 -11 -34 4 -38 27 -7 13 18 29 27
47 27 36 0 51 -17 51 -57 0 -32 -1 -33 -42 -33 -47 -1 -68 -12 -87 -48 -35
-66 45 -133 105 -87 25 19 34 19 34 0 0 -8 5 -15 10 -15 6 0 10 43 10 109 0
89 -3 112 -17 129 -24 27 -61 34 -100 17z m85 -167 c-2 -36 -8 -45 -32 -57
-39 -18 -76 -2 -76 35 0 41 27 64 72 64 l39 0 -3 -42z'
                />
                <path
                  d='M810 1412 c-8 -2 -23 -11 -32 -20 -16 -14 -18 -13 -18 1 0 10 -7 17
-15 17 -13 0 -15 -21 -15 -130 0 -109 2 -130 15 -130 12 0 15 18 15 98 0 85 3
101 20 120 26 27 66 29 80 3 5 -11 10 -65 10 -120 0 -83 3 -101 15 -101 12 0
15 17 14 93 0 111 -14 158 -49 167 -14 4 -32 5 -40 2z'
                />
                <path
                  d='M1384 1409 c-12 -4 -25 -12 -29 -18 -9 -16 -25 -13 -25 4 0 8 -4 15
-10 15 -6 0 -10 -50 -10 -130 0 -109 2 -130 15 -130 12 0 15 18 15 100 0 87 3
103 20 120 22 22 46 25 70 10 11 -7 16 -35 18 -120 2 -60 8 -110 13 -110 11 0
12 220 1 237 -12 19 -55 31 -78 22z'
                />
                <path
                  d='M1594 1410 c-39 -15 -54 -49 -54 -123 0 -71 17 -120 45 -131 28 -10
60 -7 83 10 21 14 22 14 22 -11 0 -62 -41 -93 -95 -71 -43 18 -57 3 -16 -19
43 -22 78 -19 106 10 24 24 25 28 25 180 0 97 -4 155 -10 155 -5 0 -10 -7 -10
-17 0 -14 -2 -15 -17 -1 -25 22 -54 28 -79 18z m76 -40 c18 -18 20 -31 18 -92
-3 -63 -6 -73 -29 -90 -56 -42 -108 23 -95 120 10 77 61 107 106 62z'
                />
                <path
                  d='M2213 1412 c-22 -3 -63 -45 -63 -63 0 -5 7 -9 15 -9 8 0 15 7 15 15
0 18 31 35 64 35 28 0 46 -25 46 -64 0 -24 -3 -26 -44 -26 -61 0 -96 -29 -96
-79 0 -45 24 -71 66 -71 16 0 40 7 52 16 20 14 22 14 22 0 0 -9 6 -16 13 -16
19 0 10 219 -10 241 -16 19 -46 26 -80 21z m77 -166 c0 -25 -7 -40 -26 -55
-32 -25 -51 -26 -76 -4 -41 37 -5 93 62 93 39 0 40 -1 40 -34z'
                />
                <path
                  d='M2434 1410 c-39 -15 -54 -49 -54 -123 0 -71 17 -120 45 -131 28 -10
60 -7 83 10 21 14 22 14 22 -11 0 -62 -43 -95 -92 -70 -20 9 -35 12 -41 6 -12
-12 43 -41 78 -41 14 0 37 11 50 25 24 24 25 28 25 180 0 97 -4 155 -10 155
-5 0 -10 -7 -10 -17 0 -14 -2 -15 -17 -1 -25 22 -54 28 -79 18z m76 -40 c16
-16 20 -33 20 -87 0 -38 -4 -73 -8 -79 -15 -23 -50 -34 -76 -24 -47 17 -60
147 -19 192 21 24 58 23 83 -2z'
                />
                <path
                  d='M2683 1412 c-74 -11 -97 -200 -30 -247 40 -28 127 -14 127 21 0 13
-4 13 -30 -1 -54 -28 -110 6 -110 67 l0 28 75 0 75 0 0 39 c0 65 -44 103 -107
93z m54 -30 c15 -10 35 -61 27 -73 -3 -5 -32 -9 -66 -9 l-60 0 6 33 c9 48 56
73 93 49z'
                />
                <path
                  d='M1210 1280 c0 -109 2 -130 15 -130 13 0 15 21 15 130 0 109 -2 130
-15 130 -13 0 -15 -21 -15 -130z'
                />
                <path
                  d='M650 570 l0 -280 485 0 485 0 0 75 0 75 -410 0 -410 0 0 205 0 205
-75 0 -75 0 0 -280z'
                />
                <path d='M1940 570 l0 -280 80 0 80 0 0 280 0 280 -80 0 -80 0 0 -280z' />
              </g>
            </svg>
          </a>
        </nav>
        <header className='min-h-screen flex flex-col justify-evenly items-center relative'>
          <img src='' alt='' />
          <h1></h1>
          <a href=''></a>
        </header>
      </div>
    </div>
  );
}

export default App;

// set up contentful
// create query for header, content, footer
