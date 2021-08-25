window.addEventListener('load', () => {

  /*
  *** Intro
  */

  // get DOM elements short helper
  const get_el = (sel, one = true) => sel ? one ? document.querySelector(sel) : document.querySelectorAll(sel) : null;


  // computed mobile screen detect
  Object.defineProperty(window, 'isMobile', {
    get: () => window.innerWidth <= 768 ? true : false
  })


  /*
  *** Global variables
  */
  const getCoords = elem => elem.getBoundingClientRect().top + pageYOffset;
  const getCoordsY = elem => elem.getBoundingClientRect().bottom + pageYOffset;
  const drop_btn = get_el('.dropdown__btn', 0);
  const drop_picker = get_el('.dropdown .picker', 0);
  const scroll_top = get_el('.scrolltop');
  const nav_links = get_el('.menu a', 0);
  const sections = get_el('.section', 0);
  const calculator = get_el('.calculator');
  const calc_anchor = get_el('.to_calc', 0);
  const modals = get_el('.modal', 0);
  const open_order = get_el('.open_order', 0);
  const close_modal = get_el('.close_modal', 0);
  const burger_btn = get_el('.burger');
  const mobile_menu = get_el('.mobileMenu');
  const accept_order = get_el('#accept_order');
  const brands_list = get_el('.brand', 0);  
  const brands_hover_status = true;
  const throttle_delay = 50;

  let throttle_call = 1; 
  let slider_params = {
    observer: true,
    observeParents: true,
    spaceBetween: 48,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
      renderBullet: function (index, className) {
        return `<div class="${className} bullet"></div>`;
      },
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      500: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 3
      }
    }
  }
  let slider_params_column = {
    slidesPerColumn: 2,
    slidesPerColumnFill: 'row'
  }


  /* dropdowns */
  drop_btn.forEach(el => {
    el.addEventListener('click', e => el.closest('.dropdown').classList.toggle('dropdown--opened'));
  });

  drop_picker.forEach(btn => {
    btn.addEventListener('click', function() {
      let root = this.closest('.dropdown');
      let pickers = root.querySelectorAll('.picker');
      let opener = root.querySelector('.dropdown__btn');
      let input = root.querySelector('input[type=hidden]');

      input ? input.value = this.innerText : null;
      
      pickers.forEach(el => el.classList.remove('active'));
      root.classList.remove('dropdown--opened');
      this.classList.add('active');
      opener.innerText = this.innerText;
    });
  });


  /* range slider */
  const ranges = get_el('.custom_range', 0);

  ranges.forEach(el => {
    let root = el.closest('.range_field');
    let {max, min, step, start} = el.dataset;

    noUiSlider.create(el, {
      start: +start,
      behaviour: 'tap',
      connect: [false, true],
      range: {
          'min': +min,
          'max': +max
      },
      step: +step,
      format: {
        to: function (value) {
          return parseInt(value)
        },
        from: function (value) {
          return parseInt(value)
        }
      }
    });

    if (root) {
      let target = root.querySelector('.input');

      el.noUiSlider.on('update', values => target.value = values);

      target.addEventListener('change', function () {
        el.noUiSlider.setHandle(0, this.value);
      });
    }

    
  });


  /* accept calculate */
  const accept_calc = get_el('#lightbox_accept');
  const calc_fields = get_el('#calc .calc_field', 0);

  accept_calc.addEventListener('click', e => {
    let data = {};

    calc_fields.forEach((field, i) => {
      let val = field.value;

      if (!isNaN(val)) {
        val = +val;
      }

      field.name ? data[field.name] = val : data[`unnamed_field${i}`] = val;

    });

    // data is result
    console.log(data);
  });


  /* sliders */
  const s_views = {
    elem: get_el('.views .swiper-container'),
    controls: {
      prevEl: get_el('.views .swiper-prev'),
      nextEl: get_el('.views .swiper-next')
    }
  };
  const s_portfolio = {
    elem: get_el('.portfolio .swiper-container'),
    controls: {
      prevEl: get_el('.portfolio .swiper-prev'),
      nextEl: get_el('.portfolio .swiper-next')
    }
  };
  const s_reviews = {
    elem: get_el('.reviews .swiper-container'),
    controls: {
      prevEl: get_el('.reviews .swiper-prev'),
      nextEl: get_el('.reviews .swiper-next')
    }
  };

  let s_views_params = {
    ...slider_params, 
    navigation: {...s_views.controls}
  };

  let s_reviews_params = {
    ...slider_params, 
    slidesPerView: 2, 
    navigation: {...s_reviews.controls}, 
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      992: {
        slidesPerView: 2
      }
    }
  };
  let s_portfolio_params = {
    ...slider_params, 
    ...slider_params_column,
    slidesPerView: 2,
    navigation: {...s_portfolio.controls},
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerColumn: 1,
      },
      500: {
        slidesPerView: 2,
        slidesPerColumn: 2,
        spaceBetween: 24
      },
      768: {
        slidesPerView: 3,
        slidesPerColumn: 2
      }
    }
  };    

  const s_views_slider = new Swiper(s_views.elem, s_views_params);
  const s_portfolio_slider = new Swiper(s_portfolio.elem, s_portfolio_params);
  const s_reviews_slider = new Swiper(s_reviews.elem, s_reviews_params);


  /* 
    randow hover for brands
    - brands_hover_status -- is a bool config constant, it was init from top area
  */
  if (brands_hover_status) {
    setInterval(() => {
      let r = Math.round(0 - 0.5 + Math.random() * ((brands_list.length - 1) - 0 + 1));
  
      brands_list.forEach(el => el.classList.remove('active'));
      brands_list[r].classList.add('active');
    }, 1000);
  }  


  /* global scroll fn */
  document.addEventListener('scroll', e => {
    const throtte_current = Date.now();    
    
    // throttle scroll
    if (throtte_current > throttle_call + throttle_delay) {

      try {

        /* update header */
        let scrolled_offset = window.isMobile ? 30 : 400;

        if (window.pageYOffset > scrolled_offset) {
          document.body.classList.add('scrolled');
          scroll_top.classList.add('active');
        } else {
          document.body.classList.remove('scrolled');
          scroll_top.classList.remove('active');
        }

        /* update links */
        updateNav();

      }
      catch(e){
        console.warn(e);
      }


      /* update throttle */
      throttle_call = throtte_current;
    }
  });

  
  /* scroll top button */
  scroll_top.addEventListener('click', e => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* navigation */
  nav_links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      if (link.closest(`.${mobile_menu.classList[0]}`)) {
        mobile_menu.classList.add('loading');
        setTimeout(() => {
          burger_btn.classList.remove('active');
          mobile_menu.classList.remove('active', 'loading');
          document.documentElement.classList.remove('blocked');
        }, 600);
      }

      if (!link.classList.contains('active')) {
        sections.forEach(section => {
          if (section.dataset.section == link.dataset.target) {

            if (link.dataset.target == 'intro') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: (getCoords(section) - 100), behavior: 'smooth' });
            }            

            disableLinks();
            link.classList.add('active');
          }
        });        
      }      
    });
  });


  /* calc anchor */
  calc_anchor.forEach(btn => {
    btn.addEventListener('click', e => window.scrollTo({ top: getCoords(calculator), behavior: 'smooth' }));
  });


  /* open order modal */
  open_order.forEach(btn => {
    btn.addEventListener('click', e => {
      openModal('#modalOrder');
    });
  });


  /* close modal */
  close_modal.forEach(btn => btn.addEventListener('click', closeModals));


  /* burger menu */
  burger_btn.addEventListener('click', function() {
    if (this.classList.contains('active')) {
      this.classList.remove('active');
      mobile_menu.classList.remove('active');
      document.documentElement.classList.remove('blocked');
    } else {
      this.classList.add('active');
      mobile_menu.classList.add('active');
      document.documentElement.classList.add('blocked');
    }
  });


  /* validate order form */
  accept_order.addEventListener('click', function(e) {
    e.preventDefault();
    let root = this.closest('.modal');
    let form = this.closest('.form');
    let fields = form.querySelectorAll('.required');
    let result = null;

    fields.forEach(field => {
      if (field.value == '') {
        field.classList.remove('input--ok', 'input--err');
        setTimeout(() => {
          field.classList.add('input--err');
        }, 0);
        result = false;
      } else {
        field.classList.remove('input--err');
        field.classList.add('input--ok');
        result != false ? result = true : null;
      }
    });

    if (result) {
      form.remove();
      root.querySelector('.modal__sub').remove();
      root.querySelector('.subtitle').innerText = 'Спасибо за заявку!';
      setTimeout(closeModals, 2000);
    }
  });


  try {
    (() => get_el('input[name=phone]', 0).forEach(el => IMask(el, {mask: '+{38}(000)000-00-00'})))();
  }
  catch(e){};

  
  /* *** AOS - animation on scroll *** */ 
  /*
    * enabled on a desktop only
    * if mobile - don't init
    * if error script - remove style from DOM & throw error to try_fn wrapper
    * styles don't working in screens less than 768px    
  */
  try {
    // throw ('111');
    !window.isMobile ? AOS.init() : null;
  }
  catch(e) {
    get_el('link', 0).forEach(link => {
      if (link.dataset.style == 'aos') {
        link.remove();
        console.log('aos style link has been removed');
      }
    });
    throw new Error('aos is not defined...');
  }

  /* *** end *** */


  /* functions */
  function disableLinks() {
    nav_links.forEach(link => link.classList.remove('active'));
  } 

  function updateNav() {
    const scroll_top = window.pageYOffset;

    sections.forEach(section => {
      const section_offset_top = getCoords(section) - 200;
      const section_offset_bottom = getCoordsY(section) - 200;
      const section_data = section.dataset.section;      

      if (scroll_top > section_offset_top && scroll_top < section_offset_bottom) {
        disableLinks();
        nav_links.forEach(link => {
          if (link.dataset.target == section_data) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function openModal(modal) {
    if (modal) {
      let target = get_el(modal);
      let modals = get_el('.modal', 0);

      modals.forEach(modal => modal.classList.remove('active'));
      target.classList.add('active');
      document.documentElement.classList.add('blocked');
    }    
  }

  function closeModals() {
    modals.forEach(modal => modal.classList.remove('active'));
    setTimeout(() => document.documentElement.classList.remove('blocked'), 400);
  }  
  
});