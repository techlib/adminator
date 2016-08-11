.PHONY: dev build npm default lint

default: npm build

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

# check for js errors
lint:
	./node_modules/eslint/bin/eslint.js --ext .js,.jsx adminator/static/js/src/ -c .eslintrc.json

clean:
	rm -rf node_modules
	rm -rf adminator/static/js/node_modules
	rm adminator/static/dist/app.bundle.js
