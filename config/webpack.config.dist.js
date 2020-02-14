'use strict';

const webpack = require('webpack');
const path = require('path');
const basePath = path.join(__dirname, '../');
const config = require('../package.json');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pathsToClean = ['dist'];
const cleanOptions = { root: path.join(__dirname, '../builds'), verbose: true, dry: false, exclude: [],};
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');

module.exports = { 

    entry: {main :[path.join(basePath, 'ts/app.ts'),
        path.join(basePath, 'sass/main.scss')] },
    devtool: 'inline-source-map',
    module: {
        rules: [
            // Setting the rules for specific modules
            {    
                test: /\.tsx?$/,
                use: 'happypack/loader?id=ts',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { 
                            loader: 'css-loader',
                            options: {
                                url: false,
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {test: /\.png$/, loaders: [
                'file-loader?name=i/[hash].[ext]'
            ]}
    ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            assets: path.join('assets/')
        }
    },
    output: {
        filename: 'app.js',
        path: path.join(basePath, 'builds/dist/'),
        publicPath: "../assets/"
    },
    watch: true,

    plugins: [
        new webpack.DefinePlugin({
            'GAME_WIDTH': 720,
            'GAME_HEIGHT': 1280,
            'DEBUG': true,
            'version': JSON.stringify('dist'),
            'libs': JSON.stringify([
                'node_modules/@orange-games/phaser-spine/build/phaser-spine.js'
            ])
        }),
        new ExtractTextPlugin({
            filename: 'assets/style.css'
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            files: [
                './template/*.html',
                './ts/*.ts',
                './sass/*.scss',
                './ts/*.js',
                './assets/**/*.png',
                './atlas_assets/**/*.png'
            ],
            server: {
                baseDir: ['./builds/dist']
            }
        }, {
            reload: true
        }),
        new HappyPack({
            id: 'ts',
            verbose: false,
            threads: 2,
            loaders: [
                {
                    path: 'ts-loader',
                    query: {happyPackMode: true},
                },
            ],
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new CopyWebpackPlugin([
            {
                from: path.join(basePath, 'assets'),
                to: path.join(basePath, 'builds/dist/assets')
            },
            {
                from: path.join(basePath, 'template/index.html'),
                to: path.join(basePath, 'builds/dist/index.html')
            }
        ]),
        new ForkTsCheckerNotifierWebpackPlugin({alwaysNotify: true}),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: path.join(__dirname, '../tslint.json'),
            tsconfig: path.join(__dirname, '../tsconfig.json'),
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, '../atlas_assets'),
                glob: '**/*.png'
            },
            target: {
                image: path.resolve(__dirname, '../builds/dist/assets/atlases/sprite.png'),
                css: [
                    //optional if we want a css file referencing the atlas
                    //path.resolve(__dirname, '../builds/dist/assets/atlases/sprite.css'),
                    [path.resolve(__dirname, '../builds/dist/assets/atlases/sprite.json'), {
                        format: 'json_texture'
                    }]
                ]
            },
            apiOptions: {
                cssImageRef: "~sprite.png"
            },
            spritesmithOptions: {
                padding: 5
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: true,
            },
            mangle: true,
        }),
  ]

};