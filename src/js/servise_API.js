import axios from 'axios';

export default class FetchAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pictureArr = [];
  }

  async fetchPictures() {
    const KEY = '32771968-7fd567c901afb84ab6320145c';
    const URL = 'https://pixabay.com/api/';
    return await axios.get(
      `https://pixabay.com/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
  }

  updatePage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
