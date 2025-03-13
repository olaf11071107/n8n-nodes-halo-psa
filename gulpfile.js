const { src, dest } = require('gulp');
const jsonModify = require('gulp-json-modify');

// Copy and rename the icon file
function buildIcons() {
	return src('./nodes/**/*.svg')
		.pipe(dest('./dist/nodes/'));
}

exports['build:icons'] = buildIcons;
