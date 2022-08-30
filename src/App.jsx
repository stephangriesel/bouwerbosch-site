import { useState, useEffect, useRef } from 'react';

import './App.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import { Pagination } from "swiper";

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
  mainCollection {
    items {
      smallIntro
      headlineIntro
      paragraphIntro
    }
  }
  imageSliderCollection {
    items {
      slider {
        url
        description
      }
      slider2 {
        url
        description
      }
      slider3 {
        url
        description 
      }
      slider4 {
        url
        description
      }
      slider5 {
        url
        description
      }
      slider6 {
        url
        description
      }
      slider7 {
        url
        description
      }
    }
  }
}
`;

// Environment variables
const { VITE_REACT_APP_SPACE_ID, VITE_REACT_APP_CDA_TOKEN } = import.meta.env;

function App(eventType, handler) {

  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  })

  useEffect(() => {
    console.log("effect ran");
    function internalHandler(e) {
      return handlerRef.current(e);
    }

    document.addEventListener(eventType, internalHandler);

    return () => document.removeEventListener(eventType, internalHandler)
  }, [eventType])

  // define the initial state
  const [header, setHeader] = useState(null);
  console.log('check header state:', header);

  const [main, setMain] = useState(null);
  console.log('check main state:', main);

  const [image, setImage] = useState(null);
  console.log('check image state:', image);

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
          body: JSON.stringify({ query }),
        }
      )
      .then((response) => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }

        // rerender the entire component with new data
        setHeader(data.headerCollection.items[0]);
        setMain(data.mainCollection.items[0]);
        setImage(data.imageSliderCollection.items[0]);
      });
  }, []);

  // show a loading screen case the data hasn't arrived yet
  if (!header || !main || !image) {
    return '';
  }

  // image slider
  const slideBtns = document.querySelectorAll(['data-slidebtn']);
  const slideContainer = document.querySelectorAll(['data-slidecontainer']);
  const slides = [...document.querySelectorAll(['data-slide'])];
  let currentIndex = 0;

  // image slider functions
  function handleSlideBtnClick(e) {
    e.currentTarget.id === 'prev' ? currentIndex-- : currentIndex++;
    console.log('check clicks', currentIndex);
    console.log("check event", e);
  }

  // image slider event listeners
  slideBtns.forEach((btn) =>
    btn.addEventListener('click', handleSlideBtnClick)
  );

  return (
    <div className='App bg-bkg text-base text-white selection:bg-accent selection:text-bkg'>
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
              <img src={header.logo.url} alt='logo' />
            </div>
          </a>
        </nav>
        <header className='min-h-screen flex flex-col justify-evenly items-center relative'>
          <div className='absolute bg-gradient-to-b inset-0 bottom-3/4 from-accent to-transparent'></div>
          <div className='absolute bg-gradient-to-t inset-0 top=1/3 -bottom-32 from-bkg/80 to-transparent'></div>
          <img
            className='absolute h-full w-full object-cover object-center -z-5'
            src={header.hero.url}
            aria-hidden='true'
          />
          <h1 className='text-5xl text-center z-10 font-bold tracking-wide py-12 px-96 drop-shadow-text-sm lg:drop-shadow-text-lg'>
            {header.titleText}
          </h1>
          <a
            href={header.heroUrl}
            className='bg-accent text-bkg font-medium py-3 px-8 rounded-full border border-bkg focus:outline-none z-10 focus-visible:ring-4 ring-accent ring-offset-bkg ring-offset-2 hover:bg-accent/90 flex space-x-2 drop-shadow-text-lg hover:drop-shadow-none transition-shadow items-center'
          >
            <span className='uppercase tracking-wide'>{header.ctaText}</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='#000000'
              viewBox='0 0 256 256'
            >
              <rect width='256' height='256' fill='none'></rect>
              <line
                x1='32'
                y1='216'
                x2='208'
                y2='216'
                fill='none'
                stroke='#000000'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='24'
              ></line>
              <path
                d='M83.3,216A88,88,0,0,1,32,136V88H208v48a88,88,0,0,1-51.3,80'
                fill='none'
                stroke='#000000'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='24'
              ></path>
              <path
                d='M208,88h4a32,32,0,0,1,32,32v8a32,32,0,0,1-32,32h-7.4'
                fill='none'
                stroke='#000000'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='24'
              ></path>
              <line
                x1='80'
                y1='24'
                x2='80'
                y2='48'
                fill='none'
                stroke='#000000'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='24'
              ></line>
              <line
                x1='120'
                y1='24'
                x2='120'
                y2='48'
                fill='none'
                stroke='#000000'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='24'
              ></line>
              <line
                x1='160'
                y1='24'
                x2='160'
                y2='48'
                fill='none'
                stroke='#000000'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='24'
              ></line>
            </svg>{' '}
          </a>
        </header>
        <main className='relative mt-16 sm:mt-24 lg:mt-40 pb-16 -mb-16 grid gap-16 sm:gap-24 lg:gap-40 overflow-hidden'>
          <section
            aria-labelledby='headline'
            className='container grid gap-4 text-center max-w-prose'
          >
            <div>
              <small className='tracking-widest text-accent uppercase drop-shadow-text-sm'>
                {main.smallIntro}
              </small>
              <h2
                id='headline'
                className='text-3xl font-bold tracking-wide drop-shadow-md'
              >
                {main.headlineIntro}
              </h2>
            </div>
            <p className='text-muted drop-shadow-text-sm'>
              {main.paragraphIntro}
            </p>
          </section>
          <section
            aria-labelledby='slider'
            className='-mt-10 sm:-mt-20 lg:-mt-36 container xs:w-screen'
          >
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              // pagination={{
              //   clickable: true,
              // }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 50,
                },
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              <SwiperSlide><img src={image.slider.url} alt={image.slider.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider2.url} alt={image.slider2.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider3.url} alt={image.slider3.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider4.url} alt={image.slider4.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider5.url} alt={image.slider5.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider6.url} alt={image.slider6.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider7.url} alt={image.slider7.description} /></SwiperSlide>
            </Swiper>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
