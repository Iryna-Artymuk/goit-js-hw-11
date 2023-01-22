export default function creatMarkup(pictures) {
  return pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <a href=" ${largeImageURL}" class="photo-link">

      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo"  > </div>
  <div class="info" >
    <p class="info-item">
      <span>Likes </span>  <span>${likes} </span>
    </p>
    <p class="info-item">
    <span>Views</span>  <span>${views} </span>
     
    </p>
    <p class="info-item">

     <span>Comments</span>  <span>${comments} </span>
      
    </p>
    <p class="info-item">

      <span>Downloads</span>  <span> ${downloads} </span>
      
    </p>
  </div>
</div>
      </a> `
    )
    .join('');
}
