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

	static findDir(dir, filter, list = []) {
		let files = fs.readdirSync(dir)
		for (let file of files) {
			let path = dir + '/' + file

			let stat = fs.lstatSync(path)
			if (stat.isDirectory() == false) {
				continue
			}

			if (file == filter) {
				list.push(path)
				continue
			}

			list.concat(Util.findDir(path, filter, list))
		}

		return list
	}

	static saveTree(dirs, topdir, savefile, callback) {
		let zip = new Archiver('zip', {})
		let out = fs.createWriteStream(savefile)
		zip.pipe(out)
		out.on('close', () => {
			callback()
		})

		for (let dir of dirs) {
			zip.directory(dir, dir.substr(topdir.length + 1))
		}

		zip.finalize()
	}
}
