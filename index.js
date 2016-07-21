const getYouTubeID = require('get-youtube-id')

/*
 * private -> ERROR: 3hXcOKV_Z3I: YouTube said: Please sign in to view this video.
 * live stream -> m3u8 files
 * scheduled or past live strema -> ERROR: This video is unavailable.
 * invalid id -> ERROR: PLMC9KNkInc: YouTube said: This video does not exist.
 */

const id = getYouTubeID('http://www.youtube.com/watch?v=9bZkp7q19f0')
console.log(id)

const downloadAnchor = document.getElementById('download')
downloadAnchor.href = id
downloadAnchor.setAttribute('download', 'blah')
