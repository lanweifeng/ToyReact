#toyReact

#   day1
* 安装环境
    * webpack 打包工具
    * webpack-cli webpack命令行工具
    * babel-loader babel加载器
    * @babel/core 转译器
    * @babel/preset-env 转译器设置
    * @babel/plugin-transform-react-jsx jsx转译
    
* 思路
    * 通过webpack打包后的代码发现jsx转换方式
    * 实现jsx转换方式
    * 逻辑分层， 实现组件化
    
* 步骤
    * 观察@babel/plugin-transform-react-jsx将jsx转换成了什么
    * 观察html节点无属性、有属性、无子节点、有子节点分别被如何转换
    * 将jsx转换后的实DOM挂载到body观察是否正确
    
    * 实现自定义组件（React组件，以大写字母开头）
    * 将html节点改成React节点，观察@babel/plugin-transform-react-jsx的转换
    * jsx转换直接传入了自定义类（对象）的名称（类比html，都是传名称），所以自定义类肯定要有统一的接口实现，
    要继承一个基类，这个基类需要实现一些方法（setAttribute, appendChild）
    * 当传入的是对象的时候，注意document.creatElement()这个函数的参数只能是string
    * 所以当传入的是对象的时候， 需要把这个对象new出来，并且实现render方法
    * 我们需要把节点属性放到节点，需要用到setAttribute这个api,所以在自定义类中就需要实现这个方法
    * 我们无法改变原生节点appendChild这个API，当appendChild的参数为自定义参数时，会出问题（给所有的原始的DOM加wrap，就解决这个问题）
    * 通过分析得出需要实现两个wrapper,1-ElementWrapper, 2-TextWrapper
    * 需要实现两个方法setAttribute, appendChild
    * 还需要实现一个render,作为总入口。这个比较简单，因为传入了挂载的原生节点，直接appendChild就行
    * 在Wrapper里面，用私有变量保存好构造器里面创建的原生节点，以便在setAttribute中使用
    * 设置好root的getter，在appendChild的时候直接appendChild(children.root)，形成递归
    * 注意自定义组件的children需要展开,children里面还有children，需要递归
    * 总的来说就是要包装下原生节点的生成方式，用一个Wrapper保存，这个Wrapper和自定义基类有着一样的接口、一样的展示方式、一样的属性。
    然后自定义组件要实现原生组件的setAttribute, appendChild两个API，以及获取root节点的方法

#   day2
*   目标
    * 节点可更新
    * 自定义组件有生命周期
    
*   思路
    * 改造渲染方式，使用一个渲染函数来更新root保存的DOM
    
*   步骤
    * 实现一个私有函数renderToDOM来代替root的赋值
    * 保证wrapper和自定义组件都有renderToDOM，以便形成递归，最终递归到原生组件的renderToDOM，
    原生组件的renderToDOM就是把root的值放到range（range.insertNode）,注意先清空原range的内容
    * **(重要)改造wrapper的appendChild，之前是直接this.root.appendChild(component.root)形成递归，现在
    需要使用range,先创建一个起点为该节点末尾的range,把这个range往下传（component），由子节点的renderToDOM
    来负责把自己挂在父节点上。**
    * 实现setState需要深拷贝新旧状态，拷贝完成后需要再次render
    * 注意在reRender时候，不能先删除原来的Range内容，需要在原来的Range前面insert新内容，再删除，避免出现Null节点导致Range宽度不对
