import FetchAPI from './servise_API';
import creatMarkup from './creat_markup';

import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const fetchAPI = new FetchAPI();
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.guard');
form.addEventListener('submit', getPictureOnSubmit);
const pixabay_URL = 'https://pixabay.com/api/';
const KEY = '32771968-7fd567c901afb84ab6320145c';
const pixabay_options = {
  params: {
    key: KEY,
    q: fetchAPI.searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: fetchAPI.page,
  },
};

fetchAPI.BASE_URL = pixabay_URL;

fetchAPI.options = pixabay_options;
const observer_options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(loadMoreOnScroll, observer_options);
function getPictureOnSubmit(event) {
  event.preventDefault();

  fetchAPI.searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  fetchAPI.resetPage();
  gallery.innerHTML = '';
  fetchAPI
    .fetchPictures()
    .then(resp => {
      if (resp.data.hits.length === 0) {
        new Notify({
          status: 'warning',
          title: 'Sorry',
          text: ` There are no images matching your search query. Please try again..`,
          autoclose: true,
        });
        return;
      }

      fetchAPI.pictureArr = resp.data.hits;
      let sliderGallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      gallery.insertAdjacentHTML('beforeend', creatMarkup(fetchAPI.pictureArr));
      sliderGallery.refresh();
      observer.observe(guard);
    })
    .catch(err => {
      console.log(err);
      new Notify({
        status: 'warning',
        title: '  Ops! ',
        text: ' Somthing went wrong try again ',
        autoclose: true,
      });
    });
}
function loadMoreOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchAPI.updatePage();

      fetchAPI
        .fetchPictures()
        .then(resp => {
          const maxAmountPages = Math.round(
            resp.data.totalHits / resp.data.hits.length
          );

          fetchAPI.pictureArr = resp.data.hits;
          if (fetchAPI.page === maxAmountPages) {
            new Notify({
              status: 'warning',
              title: "We're sorry ",
              text: '  You have reached the end of search results.',
              autoclose: true,
            });
            return;
          }

          gallery.insertAdjacentHTML(
            'beforeend',
            creatMarkup(fetchAPI.pictureArr)
          );
        })
        .catch(err => {
          console.log(err);
          new Notify({
            status: 'warning',
            title: '  Ops! ',
            text: ' Somthing went wrong can not load more pictures, try again ',
          });
        });
    }
  });
}
