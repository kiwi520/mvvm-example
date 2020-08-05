//2 数据劫持: 为data的属性提供get/set方法，同时更新DOM元素
// { msg: "abc", age: 100 }

function Observer(data) {
    this.$data = data
    //处理data
    Object.keys(this.$data).forEach((key) => {
        this.defineReactive(this.$data, key, this.$data[key])
    })
}

Observer.prototype.defineReactive = function (data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get() {
            return value
        },
        set(val) {
            if (val != value) {
                value = val
                ev.$emit(key)
            }
        }
    })
}
