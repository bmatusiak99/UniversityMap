import Floor from "./floor";

export default class Wing{
    constructor(props){
        var temp=[];
        props.floors.forEach(floor=>{
            temp.push(new Floor(floor));
        });
        this.state={
            id:props.id,
            name:props.name,
            x:props.x,
            y:props.y,
            sizex:props.sizex,
            sizey:props.sizey,
            floors:temp
        };
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
    GetFloors(){
        return this.state.floors;
    }
    GetFloor(i){
        return this.state.floors[i];
    }
    GetID(){
        return this.state.id;
    }
    GetName(){
        return this.state.name;
    }
}