import axios from 'axios';

export default class FetchAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pictureArr = [];
    this.URL = 'https://pixabay.com/api/';
  }

  async fetchPictures() {
    const options = {
      params: {
        key: '32771968-7fd567c901afb84ab6320145c',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'safesearch',
        page: this.page,
        per_page: 40,
      },
    };
    return await axios.get(this.URL, options);
  }

  updatePage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
