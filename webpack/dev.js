var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'eval',
	entry: './adminator/static/js/src/components/Router.jsx',
	output: {
		path: 'adminator/static/dist',
		filename: 'app.bundle.js',
	},
	module: {
		loaders: [
			{
	  			test: /\.jsx?$/,
	  			loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    cacheDirectory: true,
                    plugins: ['transform-react-inline-elements']
                },
                exclude: /(node_modules|bower_components)/,
			}
		]},
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
     new CopyWebpackPlugin([
        {
            from: { glob: './node_modules/patternfly/dist/img/*.*'},
            to: '../img',
            ignore: ['brand*', 'RH*', 'apple-touch*', 'favicon',
                     'OpenShift*', 'kubernetes*', 'logo*'],
            flatten: true
        },
        {
            from: { glob: './node_modules/patternfly/dist/fonts/*.*'},
            to: '../fonts',
            flatten: true
        },
        {
            from: { glob: './node_modules/patternfly/dist/css/*.*'},
            to: '../css',
            flatten: true
        },
        {
            from: { glob: './node_modules/patternfly/dist/js/*.*'},
            to: '../js',
            flatten: true
        }
      ]),
    ]
};
