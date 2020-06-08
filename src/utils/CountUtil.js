export default {
  countShow (count) {
    if (count >= 1000) {
      return Math.floor((count / 1000) * 10) / 10 + 'K'
    }
    return count
  }
}
