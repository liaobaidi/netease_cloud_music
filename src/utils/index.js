import cities from './data/cities.js'
import dayjs from 'dayjs'

export const getCity = (cityId, province) => {
  let result = ''
  let citiesArr = cities.split(';')
  citiesArr.forEach((item, index) => {
    citiesArr[index] = item.split(',')
  })
  citiesArr.forEach((item) => {
    if (+item[0] === province) {
      result += item[1] + ' '
    }
    if (cityId === +item[0]) {
      result += item[1]
    }
  })
  return result
}

export const getBirth = (timeStr) => {
  let year = dayjs(timeStr).format('YY')
  let month = dayjs(timeStr).format('MM')
  let day = dayjs(timeStr).format('D')
  let birth = Math.floor(year / 10) + '0'
  let xingzuo = ''
  switch (month) {
    case '01':
      if (day > 19) {
        xingzuo = '水瓶座'
      } else {
        xingzuo = '摩羯座'
      }
      break
    case '02':
      if (day > 18) {
        xingzuo = '双鱼座'
      } else {
        xingzuo = '水瓶座'
      }
      break
    case '03':
      if (day > 20) {
        xingzuo = '白羊座'
      } else {
        xingzuo = '双鱼座'
      }
      break
    case '04':
      if (day > 19) {
        xingzuo = '金牛座'
      } else {
        xingzuo = '白羊座'
      }
      break
    case '05':
      if (day > 20) {
        xingzuo = '双子座'
      } else {
        xingzuo = '金牛座'
      }
      break
    case '06':
      if (day > 21) {
        xingzuo = '巨蟹座'
      } else {
        xingzuo = '双子座'
      }
      break
    case '07':
      if (day > 22) {
        xingzuo = '狮子座'
      } else {
        xingzuo = '巨蟹座'
      }
      break
    case '08':
      if (day > 22) {
        xingzuo = '处女座'
      } else {
        xingzuo = '狮子座'
      }
      break
    case '09':
      if (day > 22) {
        xingzuo = '天秤座'
      } else {
        xingzuo = '处女座'
      }
      break
    case '10':
      if (day > 23) {
        xingzuo = '天蝎座'
      } else {
        xingzuo = '天秤座'
      }
      break
    case '11':
      if (day > 20) {
        xingzuo = '射手座'
      } else {
        xingzuo = '天蝎座'
      }
      break
    case '12':
      if (day > 21) {
        xingzuo = '摩羯座'
      } else {
        xingzuo = '射手座'
      }
      break
  }
  return birth + '后 ' + xingzuo
}

export const getAuthors = (authorList) => {
  if (authorList.length === 1) {
    return authorList[0].name
  }
  let result = ''
  for (let i = 0; i < authorList.length; i++) {
    result += authorList[i].name
    if (i !== authorList.length - 1) {
      result += '/'
    }
  }
  return result
}
