export default (...refs) => (node) => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(node);
    } else {
      ref.current = node; // eslint-disable-line no-param-reassign
    }
  });
};
