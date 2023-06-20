import Wing from "./wing";

export default class Building{
    constructor(props){
        var temp=[];
        props.wings.forEach(wing=>{
            temp.push(new Wing(wing));
        });
        this.state={
            id:props.id,
            name:props.name,
            x:props.x,
            y:props.y,
            sizex:props.sizex,
            sizey:props.sizey,
            wings:temp
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
    GetWings(){
        return this.state.wings;
    }
    GetWing(i){
        return this.state.wings[i];
    }
    GetID(){
        return this.state.id;
    }
    GetName(){
        return this.state.name;
    }
}