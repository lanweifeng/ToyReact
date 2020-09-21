import {createMyReact, render, MyBaseComponent} from "./toy-react";

class MyComponent extends MyBaseComponent{
    render(){
        return <div>
                <h1>My Component </h1>
                {this.children}
            </div>
    }
}




render(<MyComponent id='test'><div>abc</div><div></div></MyComponent>, document.body)
