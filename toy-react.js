
const RENDER_TO_DOM = Symbol("render ro dom");

/**
 * 包裹原生非text节点，用root保存节点，保持和自定义组件一致
 */
class ElementWrapper {
    constructor(nativeType){
        this.root = document.createElement(nativeType);
    }
    setAttribute(name, value){
        if(name.match(/^on([\s\S]+)$/)){
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
        }else {
            if(name === 'className'){
                this.root.setAttribute('class', value);
            }
            this.root.setAttribute(name, value)
        }
    }
    appendChild(component){
        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
    }
    [RENDER_TO_DOM](range){
        range.deleteContents();
        range.insertNode(this.root);
    }
}

/**
 * 包裹原生text节点，用root保存节点，保持和自定义组件一致
 */
class TextWrapper {
    constructor(content){
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM](range){
        range.deleteContents();
        range.insertNode(this.root);
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
        this._range = null;
    }
    setAttribute(name, value){
        this.props[name] = value
    }
    appendChild(component){
        this.children.push(component)
    }
    [RENDER_TO_DOM](range){
        this._range = range;
        this.render()[RENDER_TO_DOM](range)
    }

    reRender(){
        const oldRange = this._range;

        let range = document.createRange();
        range.setStart(oldRange.startContainer, oldRange.startOffset);
        range.setEnd(oldRange.startContainer, oldRange.startOffset);
        this[RENDER_TO_DOM](range);

        oldRange.setStart(range.endContainer, range.endOffset)
        oldRange.deleteContents();
    }

    setState(newState){
        if(this.state === null || typeof this.state !== 'object'){
            this.state = _newState;
            this.reRender();
            return;
        }
        const merge = (oldState, _newState) => {
            for(let i in _newState){
                if(typeof oldState[i] !== 'object' || oldState[i] === null){
                    oldState[i] = _newState[i]
                }else {
                    merge(oldState[i], _newState[i])
                }
            }
        }
        merge(this.state, newState);
        this.reRender();
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
            if(child === null){
                continue;
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
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range)
}
