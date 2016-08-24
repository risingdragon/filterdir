const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

module.exports = class Filter {
	static save(root, filterDir, savefile, renderer, callback) {
		Filter.find(root, filterDir, (err, files) => {
			let zip = new archiver('zip', {})
			let out = fs.createWriteStream(savefile)
			zip.pipe(out)
			out.on('close', () => {
				callback()
			})

			for (let dir of files) {
				renderer.send(
					'show-message',
					'圧縮中... ' + dir,
					'alert-warning',
					false
				)
				zip.directory(dir, dir.substr(root.length + 1))
			}

			zip.finalize()
		})
	}

	static find(parent, filterDir, callback) {
		let directories = []

		fs.readdir(parent, (err, files) => {
			if (err) {
				console.log(err)
			}

			let counter = files.length
			if (counter == 0) {
				return callback(null, directories)
			}

			for (let file of files) {
				let fullpath = path.join(parent, file)
				fs.stat(fullpath, (err, stats) => {
					if (err) {
						console.log(err)
					}

					if (stats.isDirectory()) {
						if (file == filterDir) {
							directories.push(fullpath)
						}
						Filter.find(fullpath, filterDir, (err, children) => {
							if (err) {
								console.log(err)
								return callback(err)
							}

							directories = directories.concat(children)
							counter--
							if (counter == 0) {
								return callback(null, directories)
							}
						})
					} else {
						counter--
						if (counter == 0) {
							return callback(null, directories)
						}
					}
				})
			}
		})

	}

}
