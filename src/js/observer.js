export default function setObserver() {
  const options = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(loadMoreOnScroll, options);

  return observer;
}
