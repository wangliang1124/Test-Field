var htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack=require('webpack');

module.exports = {
	entry:{
		main:__dirname+'/src/js/main.js'
	},
	output:{
		path:__dirname+'/dist',
		filename:'js/bundle.js'
	},
	resolve:{
		alias:{
			'jquery':path.resolve(__dirname,'src/js/lib/jquery-1.12.4.js')
		}
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				use:[
					'style-loader',
					'css-loader',
					{
						loader:'postcss-loader',
						options:{
								plugins:loader=>[
								require('autoprefixer')()
							]
						}
					}
				]	
			},
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:{
					loader:'babel-loader',
					options:{
						presets:['env']
					}
				}
			}
		]
	},
	plugins:[
		new htmlWebpackPlugin({
			filename:'index.html',
			template:__dirname+'/src/index.html',
			inject:'body',
			title:'this tittle is from htmlWebpackPlugin'
		}),
		new webpack.ProvidePlugin({
		  $: 'jquery',
		  jQuery: 'jquery'
		})
	],
	devServer:{
		contentBase:'./',
		inline:true
	}
}