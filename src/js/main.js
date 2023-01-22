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

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(loadMoreOnScroll, options);
function getPictureOnSubmit(event) {
  event.preventDefault();

  fetchAPI.searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  fetchAPI.resetPage();
  gallery.innerHTML = '';
  fetchAPI.fetchPictures().then(resp => {
    if (resp.data.hits.length === 0) {
      new Notify({
        status: 'warning',
        title: 'Sorry',
        text: ` There are no images matching your search query. Please try again..`,
        autoclose: true,
      });
      return;
    }
    new Notify({
      status: 'success',
      title: 'Hooray!',
      text: ` Hooray! We found ${resp.data.totalHits} images.`,
      autoclose: true,
    });
    fetchAPI.pictureArr = resp.data.hits;
    let sliderGallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    gallery.insertAdjacentHTML('beforeend', creatMarkup(fetchAPI.pictureArr));
    sliderGallery.refresh();
    observer.observe(guard);
  });
}
function loadMoreOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchAPI.updatePage();

      fetchAPI.fetchPictures().then(resp => {
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
      });
    }
  });
}
