const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
var customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(utc)
dayjs.extend(customParseFormat)

module.exports = {
  lang: 'cs',
  site: 'm.tv.sms.cz',
  channels: 'm.tv.sms.cz.channels.xml',
  output: '.gh-pages/guides/m.tv.sms.cz.guide.xml',
  url: function ({ date, channel }) {
    return `https://m.tv.sms.cz/index.php?stanice=${channel.site_id}&cas=0&den=${date.format(
      'YYYY-MM-DD'
    )}`
  },
  logo: function ({ content }) {
    const dom = new JSDOM(content)
    const img = dom.window.document.querySelector('.logo_out > img')

    return img ? img.src : null
  },
  parser: function ({ content, date }) {
    const programs = []
    const dom = new JSDOM(content)
    const items = dom.window.document.querySelectorAll('#obsah > div > div.porady > div.porad')
    items.forEach(item => {
      const time = (item.querySelector('div > span') || { textContent: '' }).textContent
        .toString()
        .trim()
      const title = (item.querySelector('a > div') || { textContent: '' }).textContent
        .toString()
        .trim()
      const description = (item.querySelector('a > div.detail') || { textContent: '' }).textContent
        .toString()
        .trim()

      if (time && title) {
        const start = dayjs
          .utc(time, 'HH.mm')
          .set('D', date.get('D'))
          .set('M', date.get('M'))
          .set('y', date.get('y'))
          .toString()

        if (programs.length && !programs[programs.length - 1].stop) {
          programs[programs.length - 1].stop = start
        }

        programs.push({
          title,
          description,
          start
        })
      }
    })

    return programs
  }
}