'use strict'

class Nicorepo {
  setCheckbox(name, value, id) {
    const tmp = document.createElement('input')
    tmp.setAttribute('type', 'checkbox')
    tmp.setAttribute('value', value)
    tmp.setAttribute('name', name)
    tmp.setAttribute('id', id)

    const label = document.createElement('label')
    label.setAttribute('for', id)
    label.innerText = name
    
    this.settingContainer[0].appendChild(tmp)
    this.settingContainer[0].appendChild(label)
  }

  static BASE_URL() {
    return 'https://www.nicovideo.jp/api/nicorepo/timeline/my/all?'
  }
  
  constructor() {
    
    this.nicorepoArray = []
    this.gotData = []
    this.upload = []
    this.xhr = new XMLHttpRequest()
    this.cursor = ''

    this.settingContainer = document.getElementsByClassName('setting-container')

    this.setCheckbox('Latest', '1', 'latestCheckBox')
    this.setCheckbox('Uploaded', '2', 'uploadedCheckBox')

    this.target = document.getElementsByClassName('MypageNicorepoContainer')
    this.target[0].innerHTML = ''

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState === 4 && this.xhr.status === 200) {
        const tmp = JSON.parse(this.xhr.responseText)

        if (0 < tmp.data.length) {
          this.nicorepoArray.push(tmp)
          this.cursor =  'cursor=' + tmp.meta.minId + '&'
          this.target = document.getElementsByClassName('MypageNicorepoContainer')
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

            const element = document.createElement('div')
            element.innerText = j.video.title
            this.target[0].appendChild(element)
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
