const fs = require('fs')
const path = require('path-extra')
const compressing = require('compressing');
const archiver = require('archiver');
const extract = require('extract-zip')

const init = async () => {
	compressing.zip.uncompress('out/mods/AdPother-1.12.2-1.2.22.0-build.0624.jar', './output/')
}

const handleError = (e) => {
	console.log(e)
}
init()