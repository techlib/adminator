var webpack = require('webpack')

module.exports = {
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
	   new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	   }),
       new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ]
};
