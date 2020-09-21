/**
 * 包裹原生非text节点，用root保存节点，保持和自定义组件一致
 */
class ElementWrapper {
    constructor(nativeType){
        this.root = document.createElement(nativeType);
    }
    setAttribute(name, value){
        this.root.setAttribute(name, value)
    }
    appendChild(component){
        this.root.appendChild(component.root);
    }
}

/**
 * 包裹原生text节点，用root保存节点，保持和自定义组件一致
 */
class TextWrapper {
    constructor(content){
        this.root = document.createTextNode(content)
    }
}

/**
 * 自定义组件基类，用root保存节点，保持和原生Wrapper一致
 */
export class MyBaseComponent {
    constructor(){
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }
    setAttribute(name, value){
        this.props[name] = value
    }
    appendChild(component){
        this.children.push(component)
    }

    get root(){
        if(!this._root){
            this._root = this.render().root;
        }
        return this._root;
    }
}

export const createMyReact = (nodeName, nodeAttrbutes, ...nodeChildren) => {
    let e;
    if(typeof nodeName === 'string'){
        e = new ElementWrapper(nodeName);
    }else{
        e = new nodeName;
    }
    for(let attrName in nodeAttrbutes){
        e.setAttribute(attrName, nodeAttrbutes[attrName])
    }
    let insertChildren = (children) => {
        for(let child of children){
            if(typeof child === 'string'){
                child = new TextWrapper(child);
            }
            if((typeof child === 'object') && (child instanceof Array)){
                insertChildren(child)
            }else {
                e.appendChild(child)
            }
        }
    }
    insertChildren(nodeChildren);

    return e;
}

export function render(component, parentElement) {
    parentElement.appendChild(component.root);
}
