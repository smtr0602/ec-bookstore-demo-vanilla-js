const initSwiper = () => {
  const swiper = new Swiper('.swiper', {
    effect: 'coverflow',
    centeredSlides: true,
    loop: true,
    loopAdditionalSlides: 10,
    slidesPerView: 1.6,
    mousewheel: true,
    spaceBetween: 6,
    dir: 'rtl',
    coverflowEffect: {
      depth: 0,
      modifier: 1,
      rotate: 50,
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
