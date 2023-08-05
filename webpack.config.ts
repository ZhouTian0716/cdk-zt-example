"use strict"
import { resolve } from "path"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import { Configuration, DefinePlugin } from "webpack"

const isDevelopment = process.env.NODE_ENV !== "production"

// always build lambda code so we get type checking in 'npm run watch' and can 'cdk deploy' at any time
const entry: { [key: string]: string } = {
  // "lambdas/sample/test": resolve(__dirname, "./src/lambdas/sample/test.ts"),
  // "lambdas/test/main_test": resolve(__dirname, "./src/test/test_file/mockProperty.ts"),
  "lambdas/index": resolve(__dirname, "./src/lambdas/index.ts"), // this is the entry point for all lambdas
  // "lambdas/db": resolve(__dirname, "./src/lambdas/db/db.ts"),
  // "lambdas/entity": resolve(__dirname, "./src/lambdas/entity/property.ts"),
  // "lambdas/common": resolve(__dirname, "./src/lambdas/common/common.ts"),
}

if (isDevelopment) {
  entry["lambdas/test"] = resolve(__dirname, "./src/test/test_file/mockProperty.ts")
  entry["servers/webhook"] = resolve(__dirname, "./src/servers/webhook.ts")
}

const config: Configuration = {
  context: __dirname,
  devtool: isDevelopment ? "inline-source-map" : undefined,
  entry,
  externals: {
    "aws-sdk": "commonjs2 aws-sdk",
  },
  mode: isDevelopment ? "development" : "production",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          experimentalWatchApi: true,
          transpileOnly: true,
        },
        test: /\.ts$/,
      },
      {
        loader: "toml-loader",
        test: /\.toml$/,
      },
    ],
  },
  name: "CRM",
  node: {
    __dirname: false,
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name]/index.js",
    libraryTarget: "umd",
    path: resolve(__dirname, "./build"),
  },
  plugins: [
    new DefinePlugin({
      //"process.env.ENV": JSON.stringify(process.env.ENV ? process.env.ENV : "sandbox"),
      //"process.env.PROJECT_ID": JSON.stringify(process.env.PROJECT_ID ? process.env.PROJECT_ID : "000000"),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".ts"],
  },
  target: "node",
}

export default config
