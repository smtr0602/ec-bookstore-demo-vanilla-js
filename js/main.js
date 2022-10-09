let isSwiperInitialized = false;
let books = [];
let cartItems = [];

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

const manageCartContentWindow = (e) => {
  const cartContent = document.querySelector('.cart-content-wrap');

  // cart icon clicked
  if (e.target.classList.contains('cart') || e.target.closest('.cart')) {
    cartContent.classList.toggle('is-shown');

    // cart content clicked
  } else if (
    e.target.classList.contains('cart-content-wrap') ||
    e.target.closest('.cart-content-wrap') ||
    // delete btn is absolutely positioned so it fails `closest('.cart-content-wrap')` check
    e.target.classList.contains('cart-item-delete-btn')
  ) {
    return;
  } else {
    cartContent.classList.remove('is-shown');
  }
};

const updateCartContent = (id, action) => {
  // add
  if (action === 'add') {
    const book = books.find((book) => book._id === id);
    const duplicate = cartItems.find((item) => item.book._id === id);
    if (duplicate) {
      cartItems[cartItems.indexOf(duplicate)] = {
        book: duplicate.book,
        qty: duplicate.qty + 1,
      };
    } else {
      cartItems.push({ book, qty: 1 });
    }
    // for animation
    const cart = document.querySelector('.cart');
    cart.classList.add('is-adding');
    setTimeout(() => {
      cart.classList.remove('is-adding');
    }, 1000);
    return;
  }
  // remove
  cartItems = cartItems.filter((item) => item.book._id !== id);
};

const updateCartQty = () => {
  const qty = cartItems.reduce((acc, current) => acc + current.qty, 0);
  document.querySelector('.cart-qty').textContent = qty || '';
};

const updateTotalAmount = () => {
  const total = cartItems.reduce((acc, current) => {
    if (current.qty === 1) {
      return acc + current.book.price;
    }
    return acc + current.book.price * current.qty;
  }, 0);
  document.querySelector('.total-amount-value').textContent =
    total.toLocaleString();
};

const updateItemHtml = () => {
  let listHtml = '';
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (!cartItems.length) {
    listHtml = '<li class="cart-empty-msg">Shopping bag is empty.</li>';
    checkoutBtn.classList.add('is-disabled');
    document.querySelector('.cart-items').innerHTML = listHtml;

    return;
  }
  checkoutBtn.classList.remove('is-disabled');
  cartItems.forEach(({ book, qty }) => {
    listHtml += `
    <li data-id="${book._id}">
      <button class="cart-item-delete-btn">×</button>
      <img
        src="${book.coverImg}"
        alt="${book.nameJa}"
      />
      <div class="cart-item-info">
        <h4>${book.nameJa}</h4>
        <div class="cart-item-price-wrap">
          <span>¥${book.price}</span><span>qty:${qty}</span>
        </div>
      </div>
    </li>
    `;
  });
  document.querySelector('.cart-items').innerHTML = listHtml;
};

const init = async () => {
  updateItemHtml();

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
  books.push(...data);
  data.forEach((book) => {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML += `
    <div class="swiper-slide" data-id="${book._id}">
        <img
          src="${book.coverImg}"
          alt="${book.nameJa}"
        />
        <div class="book-info">
          <h2>${book.nameJa}</h2>
          <p class="book-description">${book.description}</p>
          <p class="book-price">price: ¥${book.price}</p>
          <button class="btn-primary add-cart-btn">Add to cart</button>
        </div>
    </div>
      `;
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-cart-btn')) {
      updateCartContent(e.target.closest('.swiper-slide').dataset.id, 'add');
    } else if (e.target.classList.contains('cart-item-delete-btn')) {
      updateCartContent(e.target.closest('li').dataset.id, 'remove');
    } else {
      return;
    }
    updateCartQty();
    updateTotalAmount();
    updateItemHtml();
  });

  // open & close cart
  document.body.addEventListener('click', (e) => {
    manageCartContentWindow(e);
  });
};

init();
