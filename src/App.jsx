import { useState, useEffect, useRef } from 'react';

import './App.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

// import required modules
import { Pagination } from "swiper";
import { Navigation } from "swiper";

import ReactMarkdown from 'react-markdown';

import { Fade } from "react-awesome-reveal";

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
      headerTitle
      headerText
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
  footerCollection {
    items {
      footerSmallImage {
         url
      }
      textBelowSmallImage
      columnOneTitle
      columnOneLineOne
      columnOneLineTwo
      columnOneLineThree
      columnTwoTitle
      columnTwoLineOne
      columnTwoLineTwo
      columnTwoLineThree
      columnThreeTitle
      columnThreeLineOne
      columnThreeLineTwo
      columnThreeLineThree
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
  
  const [footer, setFooter] = useState(null);
  console.log('check footer state:', footer);

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
        setBottom(data.bottomCollection.items[0]);
        setFooter(data.footerCollection.items[0]);
      });
  }, []);

  // show a loading screen case the data hasn't arrived yet
  if (!header || !main || !image || !bottom || !footer){
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
  function postEmailToDatabase(email) {
    console.info(`Your email is ${email}`);
    return new Promise(resolve => setTimeout(resolve, 2000));
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

  function fadeUpObserverCallback(elsToWatch) {
    elsToWatch.forEach((el) => {
      if (el.isIntersecting) {
        el.target.classList.add('faded');
        fadeUpObserver.unobserve(el.target);
        el.target.addEventListener('transitionend', () => {
          el.target.classList.remove('fade-up', 'faded')
        }, { once: true })
      }
      console.log('working');
    })
  }

  const fadeUpObserverOptions = {
    threshold: .3,
  }

  const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback, fadeUpObserverOptions);

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
              {/* Header Text */}
              <h1 className='text-5xl pt-10 md:pb-10 sm:pb-5 drop-shadow-md text-center z-10 font-bold tracking-wide lg:drop-shadow-text-lg md:distance-2'>
                {header.headerTitle}
              </h1>
              <h2
                id='headline'
                className='md:text-2xl text-center font-bold tracking-wide'
              >
                {header.headerText}
              </h2>
              {/* Header Logo */}
              {/* <img src={header.logo.url} alt='logo' /> */}
            </div>
          </a>
        </nav>
        <header className='min-h-screen flex flex-col justify-evenly items-center relative preserve-3d'>
          <div className='absolute bg-gradient-to-b inset-0 bottom-3/4 from-accent to-transparent'></div>
          <div className='absolute bg-gradient-to-t inset-0 top-1/3 -bottom-32 from-bkg/80 to-transparent distance-1'></div>
          <img
            className='absolute h-full w-full object-cover object-top -z-5 distance-1'
            src={header.hero.url}
            aria-hidden='true'
          />
          {/* <h1 className='text-5xl text-center z-10 font-bold tracking-wide py-12 px-96 drop-shadow-text-sm lg:drop-shadow-text-lg distance-2'>
            {header.titleText}
          </h1> */}
          {/* <a
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
          </a> */}
        </header>
        <main className='relative mt-16 pt-16 sm:mt-24 lg:mt-40 pb-16'>
          {/* <section
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
          </section> */}
          <Fade
            delay={500}
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
              modules={[Pagination, Navigation]}
              navigation={true}
              className="mySwiper"
            >
              <SwiperSlide><img src={image.slider.url} alt={image.slider.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider2.url} alt={image.slider2.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider3.url} alt={image.slider3.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider4.url} alt={image.slider4.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider5.url} alt={image.slider5.description} /></SwiperSlide>
              {/* <SwiperSlide><img src={image.slider6.url} alt={image.slider6.description} /></SwiperSlide>
              <SwiperSlide><img src={image.slider7.url} alt={image.slider7.description} /></SwiperSlide> */}
            </Swiper>
          </Fade>
          <Fade delay={500}>
          <section aria-labelledby='map' className='container flex flex-wrap md:space-x-16 space-y-12 md:space-y-0 justify-between items-center fade-up pt-16 pb-5'>
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
              <div className='text-muted max-w-2xl'>
                <ReactMarkdown>{bottom.paragraphIntro}</ReactMarkdown>
              </div>
            </div>
          </section>
          </Fade>
          {/* <section aria-labelledby='cta' className='container grid gap-4 text-center max-w-prose fade-up pt-24'>
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
          </section> */}
        </main>
        <Fade delay={500}>
        <footer className="border-t border-accent mt-16 sm:mt-10 lg:mt-10 py-6 sm:py-8 md:py-12 fade-up">
          <div className="container flex flex-wrap md:justify-between items-center md:items-start gap-12">
            <div className="grid gap-2 grow justify-items-center md:justify-items-start basis-full md:basis-1/4">
              <img src={footer.footerSmallImage.url} className="w-32 sm:w-48 lg:w-56" />
              <p className="text-muted text-sm text-center md:text-left">{footer.textBelowSmallImage}</p>
            </div>
            <nav aria-label="Secondary navigation" className="text-sm flex flex-col items-center sm:items-start sm:flex-row text-center sm:text-left gap-6 justify-between md:justify-around grow basis-full md:basis-1/2 mt-2 fade-up">
              <div className="grid gap-3">
                <p className="font-bold underline decoration-accent decoration-4 underline-offset-2 tracking-wide px-2">{footer.columnOneTitle}</p>
                <ul aria-label="About Traverse">
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                      {footer.columnOneLineOne}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnOneLineTwo}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnOneLineThree}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid gap-3">
                <p className="font-bold underline decoration-accent decoration-4 underline-offset-2 tracking-wide px-2">{footer.columnTwoTitle}</p>
                <ul aria-label="Traverse Locations">
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnTwoLineOne}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnTwoLineTwo}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnTwoLineThree}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="grid gap-3">
                <p className="font-bold underline decoration-accent decoration-4 underline-offset-2 tracking-wide px-2">{footer.columnThreeTitle}</p>
                <ul aria-label="Contact Traverse">
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnThreeLineOne}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnThreeLineTwo}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-4 ring-offset-2 ring-offset-bkg px-2 ring-accent rounded-full">
                    {footer.columnThreeLineThree}
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </footer>
        </Fade>
      </div>
    </div>
  );
}

export default App;

