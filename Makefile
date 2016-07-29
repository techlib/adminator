.PHONY: dev build npm

# install required dependencies
npm:
	npm install
	cd adminator/static/js/ && npm install

# build app bundle and watch for changes with no optimizations or minification.
dev:
	./node_modules/webpack/bin/webpack.js --progress --colors --watch --config webpack/dev.js

# build production grade bundle
build:
	./node_modules/webpack/bin/webpack.js --progress --colors -p --config webpack/prod.js
