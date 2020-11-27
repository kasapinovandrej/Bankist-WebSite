'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
//moje varijable
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('section');
const navBtns = document.querySelectorAll('.nav__link');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainter = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
//modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//scroll na dugme
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});
//Event Delegation
//1.add event listener to common parent elemnt
//2.Determine what element  originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})
//Tabbed component
tabsContainter.addEventListener('click', function (e) {
  //e.preventDefault();
  //const clicked = e.target.classList.contains('operations__tab')
  const clicked = e.target.closest('.operations__tab')
  //guard clause
  if (!clicked) return;
  //active tab
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //active content area
  tabsContent.forEach((element) => element.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
//Menu fade animation
const handleHower = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//bind je zato sto event ocekuje funkciju. Bind pravi KOPIJU funkcije i setuje 'this' na bilo koju vrednost koja se unese kao parametar
nav.addEventListener('mouseover', handleHower.bind(0.5));
nav.addEventListener('mouseout', handleHower.bind(1));



//Sticky navigation sa IntersectionObserver-om - 192. lekcija 
const callBack = function (entries) {
  entries.forEach(en => {
    if (en.isIntersecting === true) {
      nav.classList.remove('sticky');
    } else {
      nav.classList.add('sticky');
    };
  });
};
const navHeight = nav.getBoundingClientRect().height;
const options = {
  root: null,
  thrashold: 0,
  rootMargin: `-${navHeight}px`
};
const observer = new IntersectionObserver(callBack, options);
observer.observe(header);

//reveal sections
const revCB = function (entries) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden');
  revObs.unobserve(entry.target);
}
const revObs = new IntersectionObserver(revCB, { root: null, threshold: .15, rootMargin: `0px` });

sections.forEach(function (section) {
  revObs.observe(section);
  //section.classList.add('section--hidden');
})

//Lasy loading imgs
const imgTargets = document.querySelectorAll('img[data-src]')

const loadImg = function (entries) {
  const [entry] = entries
  if (!entry.isIntersecting) return;
  //replace the src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  })
};

const imgObs = new IntersectionObserver(loadImg, { root: null, thrashold: 0, rootMargin: `200px` })
imgTargets.forEach(function (img) {
  imgObs.observe(img)
})

//Slider
const slider = function () {
  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRignt = document.querySelector('.slider__btn--right')
  const slides = document.querySelectorAll('.slide');
  const slid = document.querySelector('.slider');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length;

  //Functions
  //creating the dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide= "${i}"></button>`)
    });
  }
  //active dot
  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  //go tu slide
  const goToSlide = function (slide) {
    slides.forEach((s, i) =>
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    )
  };
  //sledeci
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };
  //prethodni
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide)
    activeDot(currentSlide)
  }
  const init = function () {
    createDots();
    goToSlide(0);
    activeDot(0);
  }
  init();

  //Event hand
  btnRignt.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide(currentSlide);
      activeDot(currentSlide)
    } else if (e.key === 'ArrowLeft') {
      prevSlide(currentSlide);
      activeDot(currentSlide)
    }
  })

  //Dots 
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide)
      activeDot(slide)
    }
  });
};
slider();

//page navigation
// navBtns.forEach((mov, i) => {
//   mov.addEventListener('click', function (e) {
//     e.preventDefault();
//     //jonasov nacin
//     const id = this.getAttribute('href');
//     console.log(id)
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     //moj nacin
//     // let section = document.querySelector(`#section--${i + 1}`)
//     // console.log(section)
//     // section.scrollIntoView({ behavior: 'smooth' });
//   });
// });

//Sticky navigation -los nacin
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords)
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky')
//   }
// }
// );