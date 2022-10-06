let isSwiperInitialized = false;

const sendHttpRequest = async (method, body = null, header = null) => {
  const url = '';
  const options = {
    method,
  };
  if (body) options.body = body;
  if (header) options.header = header;
  const res = await fetch(url, options);

  return res.json();
};

const init = async () => {
  // listen for slides being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        if (!isSwiperInitialized) initSwiper();
        isSwiperInitialized = true;
      }
    });
  });
  const swiper = document.querySelector('.swiper-wrapper');
  observer.observe(swiper, {
    childList: true,
  });

  const data = await sendHttpRequest('get');
  data.forEach((book) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML += `
        <img
          src="${book.coverImg}"
          alt="${book.nameJa}"
        />
        <div class="book-info">
          <h2>${book.nameJa}</h2>
          <p class="book-description">${book.description}</p>
          <p class="book-price">price: ¥${book.price}</p>
          <button id="add-cart-btn">Add to cart</button>
        </div>
      `;
    document.querySelector('.swiper-wrapper').append(slide);
  });
};

init();
