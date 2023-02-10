export default (...refs) => {
  return node => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      } else {
        ref.current = node
      }
    }
  }
}
