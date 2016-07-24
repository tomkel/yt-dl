const getYouTubeID = require('get-youtube-id')

/*
 * private -> ERROR: 3hXcOKV_Z3I: YouTube said: Please sign in to view this video.
 * live stream -> m3u8 files
 * scheduled or past live strema -> ERROR: This video is unavailable.
 * invalid id -> ERROR: PLMC9KNkInc: YouTube said: This video does not exist.
 */

function displayDownloadButton() {
  const downloadAnchor = document.getElementById('download')
  if (window.getComputedStyle(downloadAnchor).getPropertyValue('display') === 'none') {
    downloadAnchor.style.display = 'block'
  }
}

function hideDownloadButton() {

}

function getMetadata(id) {
  return fetch(`http://localhost:5000/metadata/${id}`)
  .then(res => {
    if (!res.ok) {
      return res.text().then(text => Promise.reject(text))
    }

    return res.json()
  })
}

function genFormat(format) {

}

function displayFormats(formats) {
  const container = document.createElement('div')
  for (const format of formats) {
    genFormat(format)
  }

  document.getElementById('main').appendChild(container)
}

function displayDownloadButton(format) {
  displayDownloadButton()
  const downloadAnchor = document.getElementById('download')
  downloadAnchor.href = format.url
  downloadAnchor.setAttribute('download', 'blah')
}


function initEvents() {
  document.getElementById('url').addEventListener('change', ev => {
    const id = getYouTubeID('http://www.youtube.com/watch?v=9bZkp7q19f0')
    if (id) getMetadata(id).then(displayFormats) 
  })
}
