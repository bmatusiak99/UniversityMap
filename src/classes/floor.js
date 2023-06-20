import Room from "./room";

export default class Floor{
    constructor(props){
        var temp=[];
        props.rooms.forEach(room=>{
            temp.push(new Room(room));
        });
        this.state={
            id:props.id,
            name:props.name,
            x:props.x,
            y:props.y,
            sizex:props.sizex,
            sizey:props.sizey,
            rooms:temp
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
    GetRooms(){
        return this.state.rooms;
    }
    GetRoom(i){
        return this.state.rooms[i];
    }
    GetID(){
        return this.state.id;
    }
    GetName(){
        return this.state.name;
    }
}