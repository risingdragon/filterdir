const electron = require('electron')
const fs = require('fs')
const Util = require('../lib/util');

let win = null
let winSize = null
let settingFile = electron.app.getAppPath() + '/settings.json'

electron.app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		electron.app.quit()
	}
})

electron.app.on('ready', () => {
	let size = null
	try {
		let settings = JSON.parse(fs.readFileSync(settingFile, { encoding: 'utf8' }))
		size = settings.size
	} catch (err) {
		size = {
			width: 400,
			height: 400
		}
	}

	win = new electron.BrowserWindow({
		width: size.width,
		height: size.height
	})

	win.loadURL(`file://${electron.app.getAppPath()}/index.html`)

	win.on('resize', () => {
		winSize = win.getSize()
	})

	win.on('closed', () => {
		win = null
		if (winSize != null) {
			let settings = null
			try {
				settings = JSON.parse(fs.readFileSync(settingFile, { encoding: 'utf8' }))
			} catch (err) {
				settings = {}
			}
			settings['size'] = {
				width: winSize[0],
				height: winSize[1]
			}
			fs.writeFile(settingFile, JSON.stringify(settings))
		}
	})
})

electron.ipcMain.on('save', (e, path, filter) => {
	electron.dialog.showSaveDialog(
		win,
		{
			title: 'select directory',
			properties: ['openFile', 'createDirectory'],
			filters: [
				{ name: 'Zip', extensions: ['zip'] }
			]
		},
		(file) => {
			if (!file) {
				e.sender.send('show-message', '中断しました', 'alert-danger')
				return
			}
			let dirs = Util.findDir(path, filter)
			Util.saveTree(dirs, path, file, () => {
				e.sender.send('show-message', '圧縮が完了しました', 'alert-success')
			})
		}
	)

})
