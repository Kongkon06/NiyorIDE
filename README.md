# Niyor IDE

Niyor IDE is an Eclipse Theia extension for the scripting language [Tupal](https://github.com/Kongkon06/Tupal) that provides Assamese word suggestions and localized typing assistance within the development environment.

The Assamese suggestion engine used in this project is inspired by the work done in LuitPad by Kishori M. Konwar. Parts of the implementation were adapted and rewritten in TypeScript to integrate with the Eclipse Theia ecosystem and support the Tupal programming workflow.

This project acknowledges and respects the original work released under the MIT License.

Inspired by:
- LuitPad — https://github.com/kishori82/LuitPad

License reference:
- Original work Copyright (c) 2020 Kishori M. Konwar
- Licensed under the MIT License


## Getting started

Installing the repo

```
git clone https://github.com/Kongkon06/NiyorIDE.git
cd NiyorIDE
npm install

``` 

### It is recommended to use yarn

```
git clone https://github.com/Kongkon06/NiyorIDE.git
cd NiyorIDE
yarn install

```


## Running the Electron example

Before preparing the app, the extension is needed to be prepare

```
cd niyor
yarn install
yarn prepare
cd  ..

```

After preparing the extension the application can be build. The following commands will build and start the application.

```
yarn build:electron
yarn start:electron

```

