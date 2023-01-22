import FetchAPI from './servise_API';
import creatMarkup from './creat_markup';
import showgallery from './lightBox';

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
  console.log(fetchAPI.searchQuery);
  fetchAPI.resetPage();
  gallery.innerHTML = '';
  fetchAPI.fetchPictures().then(resp => {
    new Notify({
      status: 'success',
      title: 'Hooray!',
      text: `  We found ${resp.data.totalHits} images `,
      autoclose: true,
    });

    console.log(resp.data);

    fetchAPI.pictureArr = resp.data.hits;

    gallery.insertAdjacentHTML('beforeend', creatMarkup(fetchAPI.pictureArr));
    observer.observe(guard);
    showgallery();
  });
}
function loadMoreOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchAPI.updatePage();

      fetchAPI.fetchPictures().then(resp => {
        console.log(resp.data.hits.length);
        console.log(resp.data.totalHits);
        const maxAmountPages = Math.round(
          resp.data.totalHits / resp.data.hits.length
        );
        console.log(maxAmountPages);
        console.log(fetchAPI.page);

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
