const fs = require('fs')
const Archiver = require('archiver')

module.exports = class Util {
	static setDroppable(selector, method) {
		var dropArea = $(selector)
		dropArea.on('dragover dragenter', (e) => {
			if (e.preventDefault) { e.preventDefault(); }
			return false
		})

		dropArea.on('drop', (e) => {
			e.preventDefault()
			var file = e.originalEvent.dataTransfer.files[0]
			method(file)
		})
	}

	static basedir(p) {
		return __dirname + '/../..'
	}

	static showMessage(text, style, isFade = true) {
		$('#wait .message').text(text)
		$('#wait').removeClass().addClass(style)
		$('#wait').show()
		if (isFade) {
			$('#wait').stop().fadeOut(2000)
		}
	}
}
