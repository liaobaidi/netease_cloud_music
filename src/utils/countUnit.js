export default (value) => {
  if (Math.floor(parseInt(value) / 100000000) > 0) {
    return Math.floor(parseInt(value) / 100000000) + ' 亿'
  } else if (Math.floor(parseInt(value) / 10000) > 0) {
    return Math.floor(parseInt(value) / 10000) + ' 万'
  } else {
    return value
  }
}