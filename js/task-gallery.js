import galleryItems from './app.js';

const refs = {
  galleryList: document.querySelector('.gallery'),
  lightbox: document.querySelector('.lightbox'),
  lightboxImage: document.querySelector('.lightbox__image'),
  closeLightboxButton: document.querySelector('[data-action="close-lightbox"]'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
};

const createGalleryItemMarkup = arrItems => {
  return arrItems
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
    loading = 'lazy'
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`;
    })
    .join('');
};
const galleryItemsMarkup = createGalleryItemMarkup(galleryItems);

refs.galleryList.innerHTML = galleryItemsMarkup;

const galleryLinksRef = document.querySelectorAll('.gallery__link');
galleryLinksRef.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
  });
});

refs.galleryList.addEventListener('click', onGalleryItemClick);

function onGalleryItemClick(event) {
  if (!event.target.classList.contains('gallery__image')) return;
  refs.lightbox.classList.add('is-open');
  refs.lightboxImage.src = event.target.dataset.source;
  refs.lightboxImage.alt = event.target.alt;
  document.addEventListener('keydown', onEscClick);
}
function onEscClick(event) {
  if (event.code === 'Escape') onCloseLightboxButtonClick();
}

refs.closeLightboxButton.addEventListener('click', onCloseLightboxButtonClick);
refs.lightboxOverlay.addEventListener('click', onCloseLightboxButtonClick);

let counter = 0;
let indexCurrentItem = 0;

function onCloseLightboxButtonClick() {
  refs.lightbox.classList.remove('is-open');
  document.removeEventListener('keydown', onEscClick);
  refs.lightboxImage.src = '';
  refs.lightboxImage.alt = '';
  counter = 0;
  indexCurrentItem = 0;
}

document.addEventListener('keydown', onArrowClick);

function onArrowClick(event) {
  if (!refs.lightbox.classList.contains('is-open')) return;
  let indexStartItem = galleryItems.indexOf(
    galleryItems.find(item => item.original === event.target.href),
  );

  if (event.code === 'ArrowRight') {
    counter += 1;
    indexCurrentItem = indexStartItem + counter;
    if (indexCurrentItem > galleryItems.length - 1) {
      counter = 0;
      indexCurrentItem = 0;
    }
    refs.lightboxImage.src = galleryItems[indexCurrentItem].original;
    refs.lightboxImage.alt = galleryItems[indexCurrentItem].description;
  }
  if (event.code === 'ArrowLeft') {
    counter -= 1;
    indexCurrentItem = indexStartItem + counter;
    if (indexCurrentItem < 0) {
      counter = galleryItems.length - 1;
      indexCurrentItem = galleryItems.length - 1;
    }
    refs.lightboxImage.src = galleryItems[indexCurrentItem].original;
    refs.lightboxImage.alt = galleryItems[indexCurrentItem].description;
  }
}
