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
  bottomCollection {
    items {
      emailSignUpBackground {
        url
        description
      }
      smallIntro
      headlineIntro
      paragraphIntro
      buttonText
      buttonLabel
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

  const [bottom, setBottom] = useState(null);
  console.log('check bottom state:', bottom);

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
        setBottom(data.bottomCollection.items[0])
      });
  }, []);

  // show a loading screen case the data hasn't arrived yet
  if (!header || !main || !image || !bottom) {
    return '';
  }

  // remove/add attribute function
  const removeDisabledAttribute = (els) => els.forEach(el => el.removeAttribute('disabled'));
  const addDisabledAttribute = (els) => els.forEach(el => el.setAttribute('disabled', 'true'));

  // form handle
  const contactForm = document.querySelector('#contact-form');
  const contactBtn = document.querySelector('#contact-btn');
  const contactInput = document.querySelector('#email');

  // send to database
  function postEmailToDatabase(email){
    console.info(`Your email is ${email}`);
    return new Promise(resolve => setTimeout(resolve,2000));
  }

  const contactBtnOptions = {
    pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg> 
    `,
    success: `
    <span class="uppercase tracking-wide animate-pulse">
    Thank you!
    </span>
    `,
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    addDisabledAttribute([contactForm, contactBtn]);
    contactBtn.innerHTML = contactBtnOptions.pending;
    const userEmail = contactInput.value;
    await postEmailToDatabase(userEmail)
    contactInput.style.display = "none";
    contactBtn.innerHTML = contactBtnOptions.success;

  }

  function fadeUpObserverCallback(elsToWatch){
    elsToWatch.forEach((el) => {
      if(el.isIntersecting){
        el.target.classList.add('faded');
        fadeUpObserver.unobserve(el.target);
        el.target.addEventListener('transitionend', () => {
          el.target.classList.remove('fade-up', 'faded')
        },{once:true})
      }
      console.log('working');
    })
  }

  const fadeUpObserverOptions = {
    threshold:.3,
  }

  const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback,fadeUpObserverOptions);

  document.querySelectorAll('.fade-up').forEach((item) => {
    fadeUpObserver.observe(item);
  })

  return (
    <div className='App bg-bkg text-base text-white selection:bg-accent selection:text-bkg overflow-hidden'>
      <div className='h-screen pb-12 sm:pb-0 overflow-y-auto overflow-x-hidden relative scroll-smooth perspective' >
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
        <header className='min-h-screen flex flex-col justify-evenly items-center relative preserve-3d'>
          <div className='absolute bg-gradient-to-b inset-0 bottom-3/4 from-accent to-transparent'></div>
          <div className='absolute bg-gradient-to-t inset-0 top=1/3 -bottom-32 from-bkg/80 to-transparent distance-1'></div>
          <img
            className='absolute h-full w-full object-cover object-center -z-5 distance-1'
            src={header.hero.url}
            aria-hidden='true'
          />
          <h1 className='text-5xl text-center z-10 font-bold tracking-wide py-12 px-96 drop-shadow-text-sm lg:drop-shadow-text-lg distance-2'>
            {header.titleText}
          </h1>
          <a
            href={header.heroUrl}
            className='bg-accent text-bkg font-medium py-3 px-8 rounded-full border border-bkg focus:outline-none z-10 focus-visible:ring-4 ring-accent ring-offset-bkg ring-offset-2 hover:bg-accent/90 flex space-x-2 drop-shadow-text-lg hover:drop-shadow-none transition-shadow items-center distance-2'
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
        <main className='relative mt-16 pt-16 sm:mt-24 lg:mt-40 pb-16'>
          <section
            aria-labelledby='headline'
            className='container grid gap-4 text-center max-w-prose fade-up'
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
            className='mt-10 sm:mt-20 lg:mt-32 container xs:w-screen fade-up pt-24'
          >
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
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
          <section aria-labelledby='map' className='container flex flex-wrap md:space-x-16 space-y-12 md:space-y-0 justify-between items-center fade-up pt-16 pb-24'>
            <img src={bottom.emailSignUpBackground.url} alt={bottom.emailSignUpBackground.description} width="400" className="grow md:flex-1" loading="lazy" />
            <div className='grid gap-4 text-center md:text-left grow md:flex-1'>
              <div className='relative'>
                <div className="hidden md:block absolute w-8 bg-accent/10 -left-4 h-full"></div>
                <small className='tracking-widest text-accent uppercase'>
                  {bottom.smallIntro}
                </small>
                <h2
                  id='map'
                  className='text-3xl font-bold tracking-wide drop-shadow-md'
                >
                  {bottom.headlineIntro}
                </h2>
              </div>
              <p className='text-muted max-w-2xl'>
                {bottom.paragraphIntro}
              </p>
            </div>
          </section>
          <section aria-labelledby='cta' className='container grid gap-4 text-center max-w-prose fade-up pt-24'>
            <div>
              <small className='tracking-widest text-accent uppercase'>
                {bottom.smallIntro}
              </small>
              <h2
                id='cta'
                className='text-3xl font-bold tracking-wide drop-shadow-md'
              >
                {bottom.headlineIntro}
              </h2>
            </div>
            <p className='text-muted max-w-2xl mx-auto'>
              {bottom.paragraphIntro}
            </p>
            <form id="contact-form" className='border-4 border-accent rounded-full p-1 flex items-center justify-between max-w-md mx-auto'>
              <input type="email" id="email" required placeholder='Email Address' className='p-2 mx-4 bg-transparent w-full text-sm flex-1 border-b-2 border-transparent rounded-none caret-accent placeholder:text-white focus:placeholder:text-muted focus:outline-none focus:border-accent' />
              <label className='sr-only' htmlFor="email">{bottom.buttonLabel}</label>
              <button
                className='bg-accent text-bkg font-medium text-sm py-3 px-4 sm:px-8 rounded-full border border-bkg focus:outline-none z-10 focus-visible:ring-4 ring-accent ring-offset-bkg ring-offset-2 hover:bg-accent/90 flex space-x-2 items-center shrink-0' id='contact-btn' onClick={handleFormSubmit}
              >
                <span className='uppercase tracking-wide'>{bottom.buttonText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fills="#000000" className='pointer-events-none' viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
              </button>
            </form>
          </section>
        </main>
        <footer className="border-t border-accent mt-16 sm:mt-24 lg:mt-40 py-6 sm:py-8 md:py-12 fade-up">
          <div className="container flex flex-wrap md:justify-between items-center md:items-start gap-12">
            <div className="grid gap-2 grow justify-items-center md:justify-items-start basis-full md:basis-1/4">
              <svg aria-hidden="true" role="img" className="w-32 sm:w-48 lg:w-56" width="280" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
              <p className="text-muted text-sm text-center md:text-left">We curate unique experiences for the adventurous traveler.</p>
            </div>
            <nav aria-label="Secondary navigation" className="text-sm flex flex-col items-center sm:items-start sm:flex-row text-center sm:text-left gap-6 justify-between md:justify-around grow basis-full md:basis-1/2 mt-2 fade-up">
              <div className="grid gap-3">
                <p className="font-bold underline decoration-accent decoration-4 underline-offset-2 tracking-wide px-2">About</p>
                <ul aria-label="About Traverse">
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      News
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid gap-3">
                <p className="font-bold underline decoration-accent decoration-4 underline-offset-2 tracking-wide px-2">Locations</p>
                <ul aria-label="Traverse Locations">
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Africa
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Asia
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Australia
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Europe
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      North America
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      South America
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid gap-3">
                <p className="font-bold underline decoration-accent decoration-4 underline-offset-2 tracking-wide px-2">Contact Us</p>
                <ul aria-label="Contact Traverse">
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Email
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

