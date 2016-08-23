(() => {
	const electron = require('electron');
	const React = require('react')
	const ReactDOM = require('react-dom')
	const Form = require('./dist/renderer/form')
	const Util = require('./dist/lib/util')

	Util.setDroppable('body', (file) => {
		$('input[name=topdir]').val(file.path)
	})

	ReactDOM.render(
		React.createElement(Form, null),
		document.getElementById('root')
	)

	$('#wait button.close').on('click', () => {
		$('#wait').hide()
	})

	electron.ipcRenderer.on('show-message', (e, message, style, isFade = true) => {
		Util.showMessage(message, style, isFade)
	})
})()
