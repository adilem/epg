// npx epg-grabber --config=sites/directv.com/directv.com.config.js --channels=sites/directv.com/directv.com_us.channels.xml --days=1 --output=.gh-pages/guides/us/directv.com.epg.xml

const { parser, url, logo } = require('./directv.com.config.js')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
dayjs.extend(utc)

const date = dayjs.utc('2021-10-24', 'YYYY-MM-DD').startOf('d')
const channel = {
  site_id: '15',
  xmltv_id: 'WTAP.us',
  logo: 'https://www.directv.com/images/logos/channels/dark/large/875.png'
}
const content = `{"schedule":[{"secLiveStreaming":"N","chNum":15,"authCode":"NA","chRec":true,"chCall":"WTAP","chId":2073,"secondaryChannelId":0,"chHd":true,"secondary":false,"blackOut":false,"chAdult":false,"chCat":["HDTV Channels","Local Channels"],"chLogoId":875,"detailsLinkUrl":"/Channels/Parkersburg-WV-WTAP-NBC-15-A3-HD-15","schedules":[{"primaryImageUrl":"/db_photos/default/TV/tv.jpg","restartAllowed":false,"subcategoryList":["Series","Reality"],"gridViewPrimaryImageUrl":"/db_photos/default/TV/tv_p.jpg","rating":"TVPG","description":null,"title":"Home Sweet Home","episodeNumber":3,"duration":60,"price":0,"repeat":false,"lookBack":false,"tvAdvisory":["L"],"dimension":"2D","ltd":"","programID":"EP039886740003","blackoutCode":"NA","airTime":"2021-10-30T00:00:00.000+0000","secLiveStreaming":"N","prOrd":0,"episodeTitle":"Art Is My God","authCode":"NA","format":"HD","seasonNumber":1,"listViewPrimaryImageUrl":"/db_photos/default/TV/tv_l.jpg","eventCode":"","mainCategory":"TV","hd":1,"liveStreaming":"N"}],"chKey":"2073_1476352800000","chName":"Parkersburg, WV WTAP NBC 15 A3 HD","chDesc":"NBC television services from WTAPDT-TV, 15, Parkersburg, WV.","liveStreaming":"N","digitalAdInsertableLive":false}],"reporting":{"channelschedules":{"success":false,"reportingData":"reporting for app/json/channelschedules/channelschedules not implemented yet"}},"messagekeys":null,"contingencies":[]}`

it('can generate valid url', () => {
  const result = url({ date, channel })
  expect(result).toBe(
    'https://www.directv.com/json/channelschedule?channels=15&startTime=2021-10-24T00:00:00Z&hours=24'
  )
})

it('can get logo url', () => {
  const result = logo({ channel })
  expect(result).toBe('https://www.directv.com/images/logos/channels/dark/large/875.png')
})

it('can parse response', () => {
  const result = parser({ date, channel, content })
  expect(result).toMatchObject([
    {
      start: dayjs.utc('Sat, 30 Oct 2021 00:00:00 GMT'),
      stop: dayjs.utc('Sat, 30 Oct 2021 01:00:00 GMT'),
      title: 'Home Sweet Home',
      category: ['Series', 'Reality'],
      description: null
    }
  ])
})

it('can handle empty guide', () => {
  const result = parser({
    date,
    channel,
    content: `{"errors":[{"text":"Service failure: see errors or BulkOperationErrors for details","field":"","reason":"INTERNAL_SERVER_ERROR"}],"statusCode":500,"apiResponse":{"messages":"NOTE: see res.contingencies for size-filtered message values"},"reporting":{"channelschedules":{"success":false,"reportingData":"reporting for app/json/channelschedules/channelschedules not implemented yet"}},"messagekeys":null,"contingencies":[{"key":"ent_ep_guide_backend_unavailable_error_message","value":"<!-- message: key=ent_ep_guide_backend_unavailable_error_message, deviceType=web -->Due to technical issues the guide is currently unavailable, please check back to soon.","level":"ERROR"}]}`
  })
  expect(result).toMatchObject([])
})
