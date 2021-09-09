const testData = {
  uid: '',
  baseUrl: `https://${process.env.SITE_URL}`,
  filmPage:  `${process.env.SITE_URL}/media_items/`,
  tvPage:  `https://${process.env.SITE_URL}/tv`,
  jointViewing: `https://${process.env.SITE_URL}/joint_viewing/`,
  searchUrl: `https://${process.env.SITE_URL}/search?query=`,
  servicePage: `https://${process.env.SITE_URL}/services`,
  myPaymentsLink: '',
  promoCodeUrl: '',
  myCollectionLink: '',
  settingsUrl: '',
  messagesUrl: '',
  myUrl: '',
  pollsPage: '',
  devicesUrl: '',
  profileChannelsSettingsUrl: '',
  smsCodeLastSend: Date.now(),
  pinCodeForCollection: '0000',
  pinCodeForSettings: '0000',
}

export default testData;
