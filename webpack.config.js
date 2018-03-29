var webpack = require('webpack'),
	path = require('path'),
	autoprefixer = require('autoprefixer'),
	precss = require('precss'),
	node_modules_dir = path.join(__dirname, 'node_modules');

var isProduction = process.env.NODE_ENV == 'production';
console.log(isProduction)

var entry = isProduction ? [path.resolve(__dirname, './src/main.js')] : [
	   'webpack/hot/only-dev-server',    './src/main.js'
];
//'webpack-dev-server/client?http://0.0.0.0:3000', 

var output = isProduction ? {
	path: path.resolve(__dirname, './build'),
	filename: 'bundle.js'
} : {
	//publicPath: "http://127.0.0.1:3000/build/",
	path: path.resolve(__dirname, './build'),
	filename: 'bundle.js'
};


var deps = {
	'font-awesome': 'font-awesome/css/font-awesome.min.css',
	'jquery': 'jquery/dist/jquery.min.js'
};

var config = {
	entry: entry,
	output: output,
	module: {
		noParse: [],
		loaders: [{
			test: /\.vue$/,
			loader: 'vue'
		}, {
			test: /\.js$/,
			// excluding some local linked packages.
			// for normal use cases only node_modules is needed.
			exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
			loader: 'babel-loader'
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader!postcss-loader'
		}, {
			test: /\.scss$/,
			loader: 'style-loader!css-loader!sass-loader'
		}, {
			test: /\.less$/,
			loader: 'style-loader!css-loader!less-loader'
		}, {
			test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
			loader: 'url-loader?limit=10000&name=./images/[name].[ext]'
		}]
	},
	resolve: {
		root: [process.cwd() + '/src'],
		alias: {
			'Decorators': 'utils/common-decorators.js',
			'Sunset': 'utils/sunset.js',
			'Base': 'common/base.js',
			'sunset-ui': path.join(__dirname, './src/sunset-ui/index.js')//,
			//'sunset-crud': path.join(__dirname, './src/sunset-crud')
		},
		extensions: ['', '.js', '.vue', '.coffee', '.html', '.css', '.scss']
	},
	devServer: {
		contentBase: 'src/www',
		devtool: 'eval',
		hot: true,
		inline: true,
		host: '0.0.0.0',
		port: 3000,
		proxy: {
			'/service/*': {
				target: 'http://127.0.0.1:20002/',
				secure: false
			},
			'/upload/*': {
				target: 'http://127.0.0.1:20002/',
				secure: false
			},
			'/business-service/*': {
				target: 'http://127.0.0.1:20002/',
				secure: false
			},
			'/manage-service/*': {
				target: 'http://127.0.0.1:20002/',
				secure: false
			}
		},
		// Required for webpack-dev-server.
		outputPath: path.resolve(__dirname, './build'),
	},
	postcss: function() {
		return [autoprefixer, precss];
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			'$': "jquery"//,
			//jQuery: "jquery",
			//"window.jQuery": "jquery"
		})
		//使用丑化js插件
		// new webpack.optimize.UglifyJsPlugin({
		//     compress: {
		//         warnings: false
		//     },
		//     mangle: {
		//         except: ['$scope', '$']
		//     }
		// })
	]
}


if (isProduction) {
	config.devtool = 'source-map'
	config.plugins = (config.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}), new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}), new webpack.optimize.OccurenceOrderPlugin()
	])
}

for (var k in deps) {
	if (deps.hasOwnProperty(k)) {
		var depPath = path.resolve(node_modules_dir, deps[k]);
		config.resolve.alias[k] = depPath;
		config.module.noParse.push(depPath);
	}
}

module.exports = config;