//模拟vuejs
//初始化工作
//1 代理数据：把data的数据挂载到vm上，同时设置getter/setter
//2 数据劫持: 为data的属性提供get/set方法，同时更新DOM元素
//3 编译模板: 处理视图中的DOM
// 3.1 如el中的子节点的{{}}
// 3.2 如el中的子节点的指令属性


function Mvvm(options) {
    // console.log(options)
    // console.log(options.data)
    this.$options = options
    this.$data = options.data || {}
    const el = options.el
    this.$el = typeof el === 'string' ? document.querySelector(el) : el

    //1 代理数据：把data的数据挂载到vm上，同时设置getter/setter
    this.proxyData()
    //2 数据劫持: 为data的属性提供get/set方法，同时更新DOM元素

    //三种写法  1、直接在这写 2、原型方法（同proxyData） 3、利用构造函数单独处理data
    // this.Observer = new Observer(this.$data)
    new Observer(this.$data)

    //编译模版
    new Compiler(this)

}

Mvvm.prototype.proxyData = function () {
    // console.log(this.$data)
    Object.keys(this.$data).forEach((key) => {
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: false,
            get() {
                return this.$data[key]
            },
            set(v) {
                if (this.$data[key] != v) {
                    this.$data[key] = v
                }
            }
        })
    })
}
