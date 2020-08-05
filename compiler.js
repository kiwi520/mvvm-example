//3 编译模板: 处理视图中的DOM
// 3.1 如el中的子节点的{{}}
// 3.2 如el中的子节点的指令属性
// 3.3 处理data数据
function Compiler(vm) {
    this.$vm = vm
    this.compiler(this.$vm.$el)
}

// 核心函数
Compiler.prototype.compiler = function (el) {
    //遍历节点
    //console.log(el.childNodes)
    Array.from(el.childNodes).forEach(node => {
        //判断类型
        if (this.isTextNode(node)) {
            this.compilerTextNode(node)
        }
        if (this.isElementNode(node)) {
            this.compilerElementNode(node) //处理当前元素节点
            this.compiler(node) //如何有字节点就继续判断执行
        }
    })


}
//编译文本节点
//<p>{{msg}}</p> => <p>bac</p>
//步骤1 获取文本节点内容  node.textContent {{msg}}
//步骤2 判断文本节点内容是否有{{}}
//步骤3 有{{}}的话获取其中包裹的值 msg
//步骤4 进行赋值
Compiler.prototype.compilerTextNode = function (node) {
    //去掉{{ msg  }} 无用空格
    const textLeft = node.textContent.replace(/\{{\s+/g,'{{')
    const text = textLeft.replace(/\s+}}/g,'}}')

    //正则匹配文本中的{{msg}}
    const reg = /{{\w+}}/g;
    const keyList = node.textContent.replace(/\ +/g,"").match(reg);

    if (keyList instanceof Array ) {
        let keys = Array.from(new Set([...keyList]))
        console.log(keys)
        let tmpText = text
        keys.forEach(key=>{
            //去掉{{}}
            let tmpKey =key.slice(2, key.length-2)
            //替换对应变量
            let reg = new RegExp(key,"g")
            tmpText=tmpText.replace(reg,this.$vm.$data[tmpKey])

            //<p>{{msg}}</p> => <p>bac</p>
            //注册事件（监听data里数值变化来更新视图数据）
            ev.$on(tmpKey,()=>{
                let tmpTexts = text
                keys.forEach(key=>{
                    let tmKey =key.slice(2, key.length-2)
                    //替换对应变量
                    let re = new RegExp(key,"g")
                    tmpTexts=tmpTexts.replace(re,this.$vm.$data[tmKey])
                })
                //重新赋值给文本节点
                node.textContent=tmpTexts
            })
        })
        //重新赋值给文本节点
        node.textContent =tmpText
    }
}

//编译元素节点
//<p class="main" v-text="msg"></p>  =>  <p class="main" >abc</p>
//<input type="text" v-model="msg">  =>  <input type="text" value="abc">
//1. 获取所以属性 attributes
//2. 判断是否有指令属性
//3. 如果有指令属性就处理指令属性
Compiler.prototype.compilerElementNode = function (node) {
    // console.log('编译元素节点')
    Array.from(node.attributes).forEach(attr=>{
        // console.log(attr.nodeName)
        let attrName=attr.nodeName
        let attrValue=attr.value
        if(this.isDirective(attrName)){

            //<p class="main" v-text="msg"></p>  =>  <p class="main" >abc</p>
            if(attrName==='v-text'){
                node.textContent=this.$vm.$data[attrValue]
                //注册事件
                ev.$on(attrValue,()=>{
                    node.textContent=this.$vm.$data[attrValue]
                })
            }

            //v-model => :value='' @input="func"
            if(attrName==='v-model'){
                node.value=this.$vm.$data[attrValue]
                //注册事件
                ev.$on(attrValue,()=>{
                    node.value=this.$vm.$data[attrValue]
                })
                // node->inputDOM ->绑定事件  视图影响数据
                node.oninput= ()=>{
                    this.$vm.$data[attrValue]=node.value
                }
            }
        }
    })

}
//辅助函数
//判断不同类型的节点
//文本节点
Compiler.prototype.isTextNode = function (node) {
    return node.nodeType ===3
}

//元素节点
Compiler.prototype.isElementNode = function (node) {
    return node.nodeType ===1
}

//判断属性名字是否是指令
Compiler.prototype.isDirective = function (attar) {
        return attar.startsWith('v-')
}
