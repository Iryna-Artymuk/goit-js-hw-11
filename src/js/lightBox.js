export default function showgallery() {
  const gallery = document.querySelector('.gallery');
  gallery.addEventListener('click', startGalleryOnClick);

  function startGalleryOnClick(event) {
    event.preventDefault();

    const modalBox = new SimpleLightbox('.gallery a', {
      overlayOpacity: 0.8,
      captionType: 'att',
      captionsData: 'alt',
    });
  }
}
