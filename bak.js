'use strict'

class Nicorepo {

  changeDivButton(button, name, specific) {
    button.innerText = name
    button.setAttribute('id', specific)

    if(specific === 'uploaded') {
      button.addEventListener('click', () => {
        this.mainTab[0].style.display = 'none'
        this.uploadedTab.style.display = ''
      })
    } else if(specific === 'latest') {
      button.addEventListener('click', () => {
        this.mainTab[0].style.display = ''
        this.uploadedTab.style.display = 'none'
      })
    }

    this.settingContainer[0].appendChild(button)
  }

  addData(data) {

    console.log(data)

    const thumbnailUrl = data.video.thumbnailUrl.normal
    const title = data.video.title
    const videoWactchPageId = data.video.videoWatchPageId
    const createdAt = data.createdAt
    const name = data.senderNiconicoUser.nickname
    const icon = data.senderNiconicoUser.icons.tags.defaultValue.urls.s50x50

    const iconLink = document.createElement('img')
    iconLink.setAttribute('src', icon)

    const actStr = name + 'さんが動画を投稿しました。'
    const act = document.createElement('span')
    act.innerText = actStr


    const thumbnail = document.createElement('img')
    thumbnail.setAttribute('src', thumbnailUrl)

    const videoLink = document.createElement('a')
    videoLink.setAttribute('href', '/watch/' + videoWactchPageId + '?_topic=nicovideo_user_video_upload&ref=zeromypage_nicorepo')
    videoLink.innerText = title

    const createTime = document.createElement('span')
    createTime.innerText = createdAt

    const timelineItemLog = document.createElement('div')
    timelineItemLog.setAttribute('class', 'NicorepoTimelineItem log')

    const newLine = document.createElement('br')

    // 1
    const userIcon = document.createElement('div')
    userIcon.setAttribute('class', 'LazyLoad is-visible log-author')
    userIcon.appendChild(iconLink)

    const logBody = document.createElement('div')
    logBody.setAttribute('class', 'log-body')
    logBody.appendChild(act)

    const logDetailsThumb = document.createElement('div')
    logDetailsThumb.setAttribute('class', 'LazyLoad is-visible log-target-thumbnail')
    logDetailsThumb.appendChild(thumbnail)

    // to logDetailsBody
    const videoDesign = document.createElement('span')
    videoDesign.setAttribute('class', 'log-target-type-video')
    videoDesign.innerText = '動画'

    // contain videoDesign and videoLink
    const logDetailsBody = document.createElement('div')
    logDetailsBody.setAttribute('class', 'log-target-info')
    logDetailsBody.appendChild(videoDesign)
    logDetailsBody.appendChild(videoLink)

    const logDetails = document.createElement('div')
    logDetails.setAttribute('class', 'log-details log-target log-target-video')
    logDetails.appendChild(logDetailsThumb)
    logDetails.appendChild(logDetailsBody)

    const logFooterDate = document.createElement('div')
    logFooterDate.setAttribute('class', 'log-footer-date')
    logFooterDate.innerText = createdAt

    const logFooterInner = document.createElement('div')
    logFooterInner.setAttribute('class', 'log-footer-inner')
    logFooterInner.appendChild(logFooterDate)

    const logFooter = document.createElement('div')
    logFooter.setAttribute('class', 'log-footer')
    logFooter.appendChild(logFooterInner)

    const logContent = document.createElement('div')
    logContent.setAttribute('class', 'log-content')
    logContent.appendChild(logBody)
    logContent.appendChild(logDetails)
    logContent.appendChild(logFooter)

    const deleteForm = document.createElement('div')
    deleteForm.setAttribute('class', 'log-deteform loading completed')

    timelineItemLog.appendChild(userIcon)
    timelineItemLog.appendChild(deleteForm)
    timelineItemLog.appendChild(logContent)

    this.uploadedTab.appendChild(timelineItemLog)
  }

  static BASE_URL() {
    return 'https://www.nicovideo.jp/api/nicorepo/timeline/my/all?'
  }

  constructor() {

    this.clickCount = 0

    this.nicorepoArray = []
    this.gotData = []
    this.upload = []
    this.xhr = new XMLHttpRequest()
    this.cursor = ''

    this.settingContainer = document.getElementsByClassName('setting-container')

    this.uploadedButton = document.createElement('div')
    this.changeDivButton(this.uploadedButton, '動画投稿のみ', 'uploaded')

    this.latestButton = document.createElement('div')
    this.changeDivButton(this.latestButton, '最新ニコレポ', 'latest')

    this.container = document.getElementsByClassName('nicorepo-page')
    this.mainTab = document.getElementsByClassName('NicorepoTimeline timeline')
    this.mainTab[0].style.display = ''

    this.uploadedTab = document.createElement('div')
    this.uploadedTab.setAttribute('class', 'NicorepoTimeline timeline')
    this.uploadedTab.style.display = 'none'

    this.container[0].appendChild(this.uploadedTab)

    console.log('nyan')
    console.log('bow')
    /*
    this.mainTab = this.container[0].getElementsByClassName('NicorepoTimeline timeline')[1]
    this.mainTab[0].style.display = ''
    */

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState === 4 && this.xhr.status === 200) {
        const tmp = JSON.parse(this.xhr.responseText)

        if (0 < tmp.data.length) {
          this.nicorepoArray.push(tmp)
          this.cursor =  'cursor=' + tmp.meta.minId + '&'
          // this.target = document.getElementsByClassName('NicorepoTimeline timeline')
        }

        this.show()
        this.loader()
      }
    }

  }

  loader() {
    const url = Nicorepo.BASE_URL() + this.cursor + 'client_app=pc_myrepo&_=' + Date.now()

    try {
      this.xhr.open('GET', url)
      this.xhr.send()
    } catch(e) {
      console.log('Request Error: %O', e)
    }

  }

  show() {
    for (let i of this.nicorepoArray) {
      for(let j of i.data) {
        if(j.topic === 'nicovideo.user.video.upload') {
          if(this.gotData.find(e => e.video.title === j.video.title)){
          } else {
            this.gotData.push(j)

            /*
            const element = document.createElement('div')
            element.innerText = j.video.title
            */
            // this.target[0].appendChild(addData(j))

            // console.log(j)
            this.addData(j)
          }

        }
      }
    }
  }

  run() {
    this.loader()
  }
}

const ext = new Nicorepo()
ext.run()
