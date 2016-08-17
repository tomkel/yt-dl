import getYouTubeID from 'get-youtube-id'
import 'normalize.css'
import './index.css'

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
  const downloadAnchor = document.getElementById('download')
  downloadAnchor.style.display = 'none'
}

function toggleSpinner() {
  const spinner = document.getElementById('spinner')
  if (spinner.style.display === 'block') {
    spinner.style.display = 'none'
  } else {
    spinner.style.display = 'block'
  }
}

function triggerPopAnimation(elem) {
  elem.classList.remove('hvr-pop-activate')
  // trigger a reflow
  void elem.offsetWidth
  elem.classList.add('hvr-pop-activate')
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

function selectFormat() {
  const url = document.getElementById('formatsParent').elements.format.value
  const download = document.getElementById('download')
  download.href = url
  download.download = 'filename'
  displayDownloadButton()
  triggerPopAnimation(download)
}

function cleanCodec(codec) {
  let result = codec.trim()
  const dotIndex = result.indexOf('.')
  if (dotIndex !== -1) {
    result = result.substring(0, dotIndex)
  }
  return result
}

function buildAbbr(ext, acodec, vcodec) {
  let title
  if (vcodec) {
    title = `${cleanCodec(vcodec)}/${cleanCodec(acodec)}`
  } else {
    title = `${cleanCodec(acodec)}`
  }

  return `<abbr title="${title}">${ext}</abbr>`
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function buildLabel(format) {
  if (format.vcodec !== 'none') {
    return `${capitalizeFirstLetter(format.format_note)} ` +
      `${buildAbbr(format.ext, format.acodec, format.vcodec)} ${format.resolution}`
  }

  return `Audio only ${buildAbbr(format.ext, format.acodec)} ${format.abr}kb/s`
}

function genFormat(format) {
  const container = document.createElement('div')

  const input = document.createElement('input')
  input.type = 'radio'
  input.name = 'format'
  input.value = format.url
  input.addEventListener('change', selectFormat)

  const label = document.createElement('label')
  label.innerHTML = buildLabel(format)

  container.appendChild(input)
  container.appendChild(label)
  setTimeout(() => container.classList.add('show'), 10)
  return container
}

function removeFormats() {
  const container = document.getElementById('formats')
  if (!container) return
  while (container.lastChild) {
    container.removeChild(container.lastChild)
  }
  document.getElementById('formatsParent').style.visibility = ''
}

function displayFormats(formats) {
  console.log(formats)
  let container = document.getElementById('formats')
  if (!container) {
    container = document.createElement('div')
    container.classList.add('slide-fade')
  }

  for (const format of formats) {
    container.appendChild(genFormat(format))
  }
  container.id = 'formats'

  const formatsParent = document.getElementById('formatsParent')
  formatsParent.style.visibility = 'visible'
  formatsParent.appendChild(container)
}

function removeTitle() {
  const title = document.getElementById('title')
  if (!title) return
  title.parentNode.removeChild(title)
}

function displayTitle(metadata) {
  toggleSpinner()

  const title = document.createElement('h3')
  title.id = 'title'
  title.className = 'title'
  title.innerText = metadata.title
  document.getElementById('formatsParent').appendChild(title)

  return metadata.formats
}

function urlHandler() {
  const url = document.getElementById('url').value
  const id = getYouTubeID(url)
  console.log(id)
  if (id) {
    hideDownloadButton()
    removeTitle()
    removeFormats()
    toggleSpinner()

    getMetadata(id)
      .then(displayTitle)
      .then(displayFormats)
    .catch(e => {
      toggleSpinner()
      // flash error message
      console.log(e)
      const flash = document.getElementById('flash')
      flash.innerText = String(e)
      flash.classList.toggle('flash-visible')

      setTimeout(() =>
        flash.classList.toggle('flash-visible')
      , 2000)
    })
  }
}

function initEvents() {
  document.getElementById('url').addEventListener('input', urlHandler)
}
initEvents()
