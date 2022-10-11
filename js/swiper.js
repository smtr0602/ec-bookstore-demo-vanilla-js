const checkMobile = () => {
  return window.innerWidth < 768;
};

let isMobile = checkMobile();
const initSwiper = () => {
  const swiper = new Swiper('.swiper', {
    effect: 'coverflow',
    centeredSlides: true,
    loop: true,
    loopAdditionalSlides: 10,
    slidesPerView: 1.6,
    mousewheel: true,
    spaceBetween: isMobile ? 20 : 100,
    dir: 'rtl',
    coverflowEffect: {
      depth: isMobile ? 0 : 180,
      modifier: 1,
      rotate: isMobile ? 50 : 20,
      slideShadows: false,
      stretch: 20,
    },
  });
  document.querySelector('.swiper-slide-active')?.classList.add('is-zoomed');

  swiper.on('slideChange', () => {
    document.querySelectorAll('.is-zoomed').forEach((slide) => {
      slide.classList.remove('is-zoomed');
    });
    setTimeout(() => {
      document.querySelector('.swiper-slide-active').classList.add('is-zoomed');
    }, 300);
  });
};

// check mobile & desktop
window.addEventListener('resize', () => {
  if (checkMobile() && !isMobile) {
    isMobile = true;
  } else if (!checkMobile() && isMobile) {
    isMobile = false;
  }
});
