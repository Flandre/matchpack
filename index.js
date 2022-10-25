const fs = require('fs-extra')
const path = require('path-extra')
const process = require('process')
const onezip = require('onezip')
const archiver = require('archiver')
const glob = require("glob")

const extractZip = (zipFilePath, dist) => new Promise((resolve, reject) => {
	fs.ensureDirSync(dist)
	const extract = onezip.extract(zipFilePath, dist)
	let progress = 0, file = ''
	extract.on('file', (name) => {
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		file = name
		process.stdout.write(`[${progress}%]extracting ${file}`)
	})
	extract.on('start', (percent) => {
		console.log(`extracting ${zipFilePath} started`);
	})
	extract.on('progress', (percent) => {
		process.stdout.clearLine()
		process.stdout.cursorTo(0)
		progress = percent
		process.stdout.write(`[${percent}%]extracting ${file}`)
	})
	extract.on('error', (error) => {
		reject(error)
	})
	extract.on('end', () => {
		console.log('\ndone')
		resolve('done')
	})
})

const packZip = (zipFileDir, outputDir, filename) => new Promise((resolve, reject) => {
	fs.ensureDirSync(outputDir)


})

const matchFile = match => new Promise((resolve, reject) => {
	glob(match, {}, function (err, files) {
		if(err) {
			reject(err)
			return
		}
		resolve(files)
	})
})

const init = async () => {
	let assets = fs.readdirSync('./out/assets/')
	let mods = fs.readdirSync('./out/mods')
	let count = 0
	for(let i = 0; i < assets.length; i ++) {
		for(let j = 0; j < mods.length; j ++) {
			if(mods[j].toLowerCase().startsWith(assets[i])) {
				if(/^[-_][\d|mc|for|lib]/i.test(mods[j].substring(assets[i].length))) {
					let modPackName = mods[j]
					// 预先拆包
					await extractZip(`out/mods/${modPackName}`, './temp/')
					// 查找lang文件
					let langs = await matchFile(`./temp/**/*.lang`)
					console.log(langs)
					// 处理完毕后删除
					await fs.emptyDirSync('./temp/')
					count ++
				} else {
					// 未完全匹配成功的包
					console.log('\x1B[31m%s\x1B[0m', `NOT MATCH: ${assets[i]} ==== ${mods[j]}`)
				}
			}
		}
	}
	console.log(count)




	//
	// await extractZip('out/mods/AdPother-1.12.2-1.2.22.0-build.0624.jar', './temp/')
	// console.log('extract done')
	// await read('./temp')
	// glob("./output/**/*.lang", {}, function (er, files) {
	// 	// files is an array of filenames.
	// 	// If the `nonull` option is set, and nothing
	// 	// was found, then files is ["**/*.js"]
	// 	// er is an error object or null.
	// 	console.log(files)
	// })
	// // await packZip('./output/', './pack/', 'test.jar')
}

init()