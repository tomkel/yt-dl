import getYouTubeID from 'get-youtube-id'
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
  if (spinner.style.display) {
    spinner.style.display = 'none'
  } else {
    spinner.style.display = 'block'
  }
}

function getMetadata(id) {
  return fetch(`http://localhost:5000/metadata/${id}`)
  .then(res => {
    if (!res.ok) {
      return res.text().then(text => Promise.reject(text))
    }

    return res.json()
  })
  .catch(e => {
    // flash error message
  })
}

function selectFormat() {
  const url = document.getElementById('formatsParent').elements.format.value
  const download = document.getElementById('download')
  download.href = url
  download.download = 'filename'
  displayDownloadButton()
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

  document.getElementById('formatsParent').appendChild(container)
}

function displayTitle(metadata) {
  toggleSpinner()

  return metadata.formats
}

function urlHandler() {
  const url = document.getElementById('url').value
  const id = getYouTubeID(url)
  console.log(id)
  if (id) {
    hideDownloadButton()
    removeFormats()
    toggleSpinner()

    getMetadata(id)
      .then(displayTitle)
      .then(displayFormats)
  }
}

function initEvents() {
  document.getElementById('url').addEventListener('input', urlHandler)
}
initEvents()
