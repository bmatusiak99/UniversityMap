import Beacon from "./beacon";
import Link from "./link";
import Sensor from "./sensor";

export default class Room{
    constructor(props){
        
        var temp1=[];
        var temp2=[];
        var temp3=[];
        props.links.forEach(link=>{
            temp1.push(new Link(link));
        });
        props.beacons.forEach(beacon=>{
            temp2.push(new Beacon(beacon));
        });
        props.sensors.forEach(sensor=>{
            temp3.push(new Sensor(sensor));
        });
        this.state={
            id:props.id,
            name:props.name,
            x:props.x,
            y:props.y,
            sizex:props.sizex,
            sizey:props.sizey,
            name:props.name,
            links:temp1,
            beacons:temp2,
            sensors:temp3
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
    GetID(){
        return this.state.id;
    }
    GetName(){
        return this.state.name;
    }
    GetLinks(){
        return this.state.links;
    }
    GetLink(i){
        return this.state.links[i];
    }
    GetBeacons(){
        return this.state.beacons;
    }
    GetBeacon(i){
        return this.state.beacons[i];
    }
    GetSensors(){
        return this.state.sensors;
    }
    GetSensor(i){
        return this.state.sensors[i];
    }
}