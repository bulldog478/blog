#Webpack & Angular:Part1
##Getting Started
现在有许多模块加载器譬如：Require.js、System.js等。

最终我认为Webpack是最好的一个。

Webpack为模块加载提供乐一个优雅的多特性方案。它可以实现一切只要你想得到。

下面我们以一个包括ES6和Sass的Anuglar工程来说说Webpack的使用。

![webpackAngular](http://7xslhu.com2.z0.glb.clouddn.com/webpackAngular.png)

[源码下载地址](https://github.com/ShMcK/WebpackAngularDemos/tree/master/Part1)

###源文件配置
目录结构：
```
root
 ├───── app
 │       ├─── core
 │       │     ├──── bootstrap.js
 │       │     └──── vendor.js
 │       │
 │       ├─── index.html
 │       └─── index.scss
 ├────── .jshintrc
 ├────── node_modules
 └────── package.json
```

/app/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Webpack & Angular</title>
</head>
<body>
    <p>Angular is working:L {{1 + 1 === 2}}</p>
    <script src="bundle.js"></script>
</body>
</html>
```

/app/index.js
```js
alert('loaded!');
```

##Webpack配置
首先创建一个`package.json`文件
```
npm init
```
一路回车即可。

现在我们为webpack添加一些`dev-dependecies`。
```
npm install -D webpack    （注意这里一定是大写D才能加入到package.json中）
```

下面我们来写Webpack的配置文件`webpack.config.js`。
/webpack.config.js

```js
'use strict';

var webpack = require('webpack'),
    path = require('path');

var APP = __dirname + '/app'; //APP为app工程绝对路径

module.exports = {
    //配置从这里开始
};
```

Webpack配置起来也比较容易，你只需要提供一个入口`entry`和一个出口`output`。
注意`bundle.js`是我们在index.htmlz中唯一需要加载脚本，所有的脚本会打包到bundle.js中。

后面你还会看到大量关于`懒加载`以及`代码分割`实例例子。
我们继续完善`web.config.js`。

/webpack.config.js
```js
module.exports = {
    context:APP,
    entry: {
        app: './index.js'
    },
    output:{
        path: APP,
        filename: 'bundle.js'
    }
};
```

现在我们可以执行模块加载器了。
```
webpack
```
在控制台你会看到以下信息：
![](http://7xslhu.com2.z0.glb.clouddn.com/webpack.png)

###Webpack-Dev-Server
[Webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)是一个基于Node/Express/Socket.io实现的一个轻型服务器。

下面安装webpack-dev-server作为dev-dependency
```
npm install -D webpack-dev-server
```

###Hot 模式
Hot模式 = live-reload模式，也就是你不需要因为修改了代码而重新加载整个工程，仅仅加载修改的部分，这对于调试非常便利。

继续修改webpack.config.js
```js
module.exports = {
    context:APP,
    entry: {
        app: ['webpack/hot/dev-server','./index.js']
    },
    output:{
        path: APP,
        filename: 'bundle.js'
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
};
```
这里推荐`全局安装`wepback-dev-server,那么你只需要执行
```
webpack-dev-server --content-base ./app --hot
```
你会在控制台看到以下内容
![](http://7xslhu.com2.z0.glb.clouddn.com/webpack-dev-server.png)
在浏览器中打开[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)
![](http://7xslhu.com2.z0.glb.clouddn.com/webpack-dev-server-browser.png)

如果你用过`gulp server`,`grunt server`这种短些来启动应用，那么webpack-dev-server可以。在`package.json`中加入
```
"start": "node node_modules/.bin/webpack-dev-server --content-base app --hot",
"start-win": "node_modules\\.bin\\webpack-dev-server.cmd -—content-base app --hot"
```
然后执行
```
npm start
```
你会得到一样的效果。

###快速入门
####启动Angular
也许你不想在html中直接写上`ng-app="app"`，那么可以换一种方法。

/app/core/bootstrap.js （请注意这不是bootstrap~）
```js
/*jshint browser:true */
'use strict';

require('angular');
// load the main app file
var appModule = require('../index');
// replaces ng-app="appName"
angular.element(document).ready(function () {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});
```

也许你已经注意到了`require('angular')`,以后我们就不需要直接写明`<script src="bower_components/angular/angular.min.js">`,现在这是一个模块化的系统。

同样你也注意到了appModule.name，appModule来自于`index.js`,因此你需要在index.js写上：
/app/index.js
```js
module.exports = angular.module('app',[]);
```

现在`bootstrap.js`成为了Webpack新入口。
/webpack.config.js
```js
    entry: {
        app: ['webpack/hot/dev-server','./core/bootstrap.js']
    }
```

####添加依赖
安装angular
```
npm install angular --save
```
将所有增加依赖的工作都放到Bootstrap中显然不太合理，现在我们增加一个`vendor.js`来承担这部分工作。
/app/core/bootstrap.js
```js
require('./vendor')();
```
/app/core/vendor.js
```js
module.exports = function(){
    /*js*/
    require('angular'); 
}
```
现在vendor.js看起来很短，以后肯定不会。

####样式
Webpack不仅能够加载JS，它几乎可以加载所有包括：样式、图片、字体等等。

它可以通过使用[loaders](http://webpack.github.io/docs/using-loaders.html),这里有[可用loader列表](http://webpack.github.io/docs/list-of-loaders.html)

现在我们添加一些dev-dependencies包括Style，CSS和Sass loaders。
```
npm install -D style-loader css-loader sass-loader
```

Webpack通过Regex test来匹配需要loader的资源，我们可以这样做：

/webpack.config.js
```js
module:{
        loaders:[
            {
                test:/\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    }
```

加载器从右到左依次处理加载的.scss文件，以sass loader => css loader => style loader执行。

下面测试一个样式表
/app/index.scss
```css
body{
    background-color:red;
}
```

加载样式文件
```js
module.
exports = function(){
    /* style */
    require('../index.scss');
    /*js*/
    require('angular'); 
}
```
执行`webpack-dev-server --content-base ./app --hot`。

> *请注意*

：看到下面的评论如果你是windows系统执行会报错，原因说是在linux上没问题。
我平时也只用less，报错那我就全改为less吧，也很简单。
但是还是报错：
![](http://7xslhu.com2.z0.glb.clouddn.com/css-loade-error.png),
让我百思不得其解，看了有的人说直接升到node 4.x，后来还是在stackoverflow上找到了[答案](http://stackoverflow.com/questions/30269276/webpack-css-loader-cannot-find-index-js-style-loader-cannot-find-addstyles-js)。
```js
module.exports = {
  context: path.join(__dirname, 'app'), 
}
```
这样改一下就行了。
![](http://7xslhu.com2.z0.glb.clouddn.com/less-loader-red.png)

###ES6 loader
Webpack很容易将`ES6`、`TS`、`coffeeScript`编译成`ES5/ES3`。

首先我们需要安装一些dev-dependencies:
```
npm install -D jshint-loader babel-loader ng-annotate-loader babel-preset-es2015
```

现在我们增加一些loader进去：
/webpack.config.js
```js
module:{
    loaders:[
    {
        test:/\.js$'/,
        loader:'ng-annotate!babel?presets[]=es2015!jshint',
        exclude:/node_modules|bower_components/
    }]
}
```
同样Webpack在context下匹配.js文件并以jshint=>babel=>ng-annotate处理。

Babel非常强大可以用来将ES6/ES7编译到ES5/ES3，所以这里你需要指明预编译ES版本，在本例中我们预编译ES6，即es2015。现在我们用es6重写`index.js`。

```js
module.exports = angular.module('app',[]);
function printMessage(status = 'working'){
    let message = 'ES6';
    console.log(`${message} is ${status}`);
}

printMessage();
```

添加/.jshintrc
```
{
  "esnext": true,
  "node": true,
  "globals": {
    "angular": true,
    "console": true
  }
}
```

执行`webpack-dev-server --content-base ./app --hot`。

由于加入了jshint，那么代码如果少加分号也会给出警告：
![](http://7xslhu.com2.z0.glb.clouddn.com/webpack-jshint.png)
执行结果：
![](http://7xslhu.com2.z0.glb.clouddn.com/webpack-es6.png)

###总结
当我第一次使用webpack构建app时，我会有以下疑惑：
> 构建阶段发生了什么？
> grunt/glup可以用到哪些场景下呢？

没有多少行的webpack.config.js，使得我们仅仅通过一个wepack命令就能进行构建，通过webpack-dev-server我们就可以方便的预览我们的app。

加入你觉得这个例子太简单了，那么我们将在[下一节]()构建一个基于LumX的工程，它是一个很流行的基于Angular的拟物设计的CSS框架。


