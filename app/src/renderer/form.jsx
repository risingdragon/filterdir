const React = require('react');
const electron = require('electron');
const fs = require('fs')
const Util = require('../lib/util');

module.exports = class Form extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			topdir: '',
			filter: '.git'
		}
	}

	handleClick(e) {
		e.preventDefault()
		let topdir = $('input[name=topdir]').val().trim()
		let filter = $('input[name=filter]').val().trim()

		if (topdir.length == 0) {
			Util.showMessage('ディレクトリを指定してください', 'alert-danger')
			return
		}

		if (filter.length == 0) {
			Util.showMessage('フィルターを指定してください', 'alert-danger')
			return
		}

		try {
			let stat = fs.lstatSync(topdir)
			if (stat.isDirectory() == false) {
				Util.showMessage('ディレクトリではありません', 'alert-danger')
				return
			}
		} catch (err) {
			Util.showMessage('ディレクトリが見つかりません', 'alert-danger')
			return
		}

		Util.showMessage('圧縮しています', 'alert-warning', false)

		this.state.topdir = topdir
		this.state.filter = filter
		this.setState(this.state)

		electron.ipcRenderer.send('save', this.state.topdir, this.state.filter)
	}

	render() {
		return (
			<form>
				<div className="form-group">
					<label>Top directory</label>
					<input type="text" className="form-control" name="topdir" defaultValue={this.state.topdir} />
				</div>
				<div className="form-group">
					<label>Filter</label>
					<input type="text" className="form-control" name="filter" defaultValue={this.state.filter} />
				</div>
				<button className="btn btn-sm btn-primary" onClick={this.handleClick.bind(this)}>
				Save
				</button>
			</form>
        )
    }
}
