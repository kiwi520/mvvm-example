function EventEmitter() {
    //存储事件
    this.subs = {}
    /**
     * 注册事件
     * @param EventType 事件名称
     * @param args  具体事件方法
     * @returns {*}
     */
    this.$on = function (EventType, handler) {
        if (!this.subs[EventType]) {
            this.subs[EventType] = []
        }
        this.subs[EventType].push(handler)
    }

    /**
     * 触发事件
     * @param EventType 事件名称
     * @param args  具体事件需要的参数
     * @returns {*}
     */
    this.$emit = function (EventType, ...args) {
        if (this.subs[EventType]) {
            this.subs[EventType].forEach(handler => {
                handler.call(this,...args)
            })
        }
    }
}

const ev = new EventEmitter()
