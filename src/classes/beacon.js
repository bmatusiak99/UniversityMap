
export default class Beacon{
    constructor(props){
        this.state={
            x:props.x,
            y:props.y,
            sizex:props.sizex,
            sizey:props.sizey
        }
    }
    GetX(){
        return this.state.x;
    }
    GetY(){
        return this.state.y;
    }
    GetSizeX(){
        return this.state.sizex;
    }
    GetSizeY(){
        return this.state.sizey;
    }
}