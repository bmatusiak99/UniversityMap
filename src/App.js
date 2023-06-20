import React from 'react';
import './App.css';
import Building from './classes/building';
import SideNav, { Toggle, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      building: null,
      selectedFile: null,
      string: "",
      activefloor: 0,
      activewing: 0,
      wingId: 0,
      floorId: 0,
      scale: 20,
      margin: 10
    }
    this.setSelectedFile = this.setSelectedFile.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  // Logika inputów
  setSelectedFile = event => {
    this.setState({ selectedFile: event.target.files[0] });
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = function () {
      var node = document.getElementById('textinput');
      var text = reader.result;
      node.value = text;
      this.setState({ string: text });
    }.bind(this);
  }
  onButtonClick = async event => {
    var json = null;
    var string = this.state.string;
    if (string.length !== 0) {
      json = JSON.parse(string);
    } else {
      var node = document.getElementById('textinput').value;
      if (node.length !== 0) {
        json = JSON.parse(node)
      }
    }
    
    var building = null;
    var wings = [];
    var floors = [];
    var rooms = [];

    json.forEach(element => {
      //console.log(element);
      var temp;
      switch (element.roomType) {
        case "BUILDING":
          building = {
            x: element.box.location.localX,
            y: element.box.location.localY,
            sizex: element.box.sizeX,
            sizey: element.box.sizeY,
            name: element.name,
            id: element.roomId,
            wings: []
          }
          break;
        case "WING":
          temp = {
            x: element.box.location.localX,
            y: element.box.location.localY,
            sizex: element.box.sizeX,
            sizey: element.box.sizeY,
            name: element.name,
            id: element.roomId,
            parentId: element.parentId,
            floors: []
          }
          wings.push(temp);
          break;
        case "FLOOR":
          temp = {
            x: element.box.location.localX,
            y: element.box.location.localY,
            sizex: element.box.sizeX,
            sizey: element.box.sizeY,
            name: element.name,
            id: element.roomId,
            parentId: element.parentId,
            rooms: []
          }
          floors.push(temp);
          break;
        case "ROOM":
          temp = {
            x: element.box.location.localX,
            y: element.box.location.localY,
            sizex: element.box.sizeX,
            sizey: element.box.sizeY,
            name: element.name,
            id: element.roomId,
            parentId: element.parentId,
            links: [],
            beacons: [],
            sensors: []
          }
          if(element.links!= null){
            element.links.forEach(link=>{
              if(temp.id==link.parentId){
                temp.links.push({
                  x:link.box.location.localX,
                  y:link.box.location.localY,
                  sizex:link.box.sizeX,
                  sizey:link.box.sizeY,
                })
              }
              
            })
          }
          if (element.sensors != null) {
            element.sensors.forEach(sensor => {
              temp.sensors.push({
                x: sensor.box.location.localX,
                y: sensor.box.location.localY,
                sizex: sensor.box.sizeX,
                sizey: sensor.box.sizeY,
                parentId: sensor.parentId
              })
            })
          }
          if (element.beacons != null) {
            element.beacons.forEach(beacon => {
              temp.beacons.push({
                x: beacon.box.location.localX,
                y: beacon.box.location.localY,
                sizex: beacon.box.sizeX,
                sizey: beacon.box.sizeY,
                parentId: beacon.parentId
              })
            })
          }
          rooms.push(temp);
          break;
        default:
          break;
      }
    });
    rooms.forEach(room => {
      floors.forEach(floor => {
        if (floor.id === room.parentId) {
          floor.rooms.push(room);
        }
      })
    })
    floors.forEach(floor => {
      wings.forEach(wing => {
        if (floor.parentId === wing.id) {
          wing.floors.push(floor);
        }
      })
    })
    wings.forEach(wing => {
      building.wings.push(wing);
    })

    var b = new Building(building)
    setTimeout(() => { this.setState({ building: b }) }, 0);
    setTimeout(() => { this.generate(); }, 10);
    // ^^^ Obejście na błąd sprawiający, że mapa nie renderowała się za pierwszym wciśnięciem
  }
  inputChange = e => {
    this.setState({ string: e.target.value });
  }

  // Metody gotowe do użycia w kodzie i w inputach
  clearCanvas = () => {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  }
  setFloorId = e => {
    var renderError = document.getElementById('render_error');
    var building = this.state.building;
    if (building === null) {
      renderError.innerText = "Couldn't retrieve data for building.";
      return;
    }

    var wings = building.state.wings;
    if (wings === null) {
      renderError.innerText = "Couldn't retrieve data for wings.";
      return;
    }
    var wingId = this.state.wingId;
    if (wingId < 0 || wingId >= wings.length) {
      renderError.innerText = "Wing ID is out of range.";
      return;
    }

    var floors = wings[wingId].state.floors;
    if (floors === null) {
      renderError.innerText = "Couldn't retrieve data for floors.";
      return;
    }
    var floorId = e.target.value;
    if (floorId < 0 || floorId >= floors.length) {
      renderError.innerText = "Floor ID is out of range.";
      return;
    }

    this.setState({ floorId: parseInt(e.target.value) });
    renderError.innerText = "";
  }
  setWingId = e => {
    var renderError = document.getElementById('render_error');
    var building = this.state.building;
    if (building === null) {
      renderError.innerText = "Couldn't retrieve data for building.";
      return;
    }

    var wings = building.state.wings;
    if (wings === null) {
      renderError.innerText = "Couldn't retrieve data for wings.";
      return;
    }
    var wingId = parseInt(e.target.value);
    if (wingId < 0 || wingId >= wings.length) {
      renderError.innerText = "Wing ID is out of range.";
      return;
    }

    var floors = wings[wingId].state.floors;
    if (floors === null) {
      renderError.innerText = "Couldn't retrieve data for floors.";
      return;
    }
    var floorId = this.state.floorId;
    if (floorId < 0 || floorId >= floors.length) {
      renderError.innerText = "Floor ID is out of range.";
      return;
    }

    this.setState({ wingId: parseInt(e.target.value) });
    renderError.innerText = "";
  }
  setMargin = e => {
    this.setState({ margin: parseInt(e.target.value) });
  }
  setScale = e => {
    this.setState({ scale: parseInt(e.target.value) });
  }
  getRoomAmount = () => {
    var building = this.state.building;
    if (building === null)
      return 0;

    var wings = building.state.wings;
    if (wings === building.state.wings)
      return 0;
    var wingId = this.state.wingId;
    if (wingId < 0 || wingId >= wings.length)
      return 0;

    var floors = wings[wingId].state.floors;
    if (floors === wings[wingId].state.floors)
      return 0;
    var floorId = this.state.floorId;
    if (floorId < 0 || floorId >= floors.length)
      return 0;

    var rooms = floors[floorId].state.rooms;
    if (rooms === floors[floorId].state.rooms)
      return 0;

    return rooms.length;
  }
  getFloorAmount = () => {
    var building = this.state.building;
    if (building === null)
      return 0;

    var wings = building.state.wings;
    if (wings === null)
      return 0;
    var wingId = this.state.wingId;
    if (wingId < 0 || wingId >= wings.length)
      return 0;

    var floors = wings[wingId].state.floors;
    if (floors === null)
      return 0;

    return floors.length;
  }
  getWingAmount = () => {
    var building = this.state.building;
    if (building === null)
      return 0;

    var wings = building.state.wings;
    if (wings === null)
      return 0;

    return wings.length;
  }

  // Generowanie mapy
  generate = () => {
    console.log(this.state);
    var renderError = document.getElementById('render_error');
    var ctx = document.getElementById('canvas').getContext('2d');
    this.clearCanvas();

    var margin = this.state.margin;
    var scale = this.state.scale;

    var building = this.state.building;
    if (building === null) {
      renderError.innerText = "Couldn't retrieve data for building.";
      return;
    }

    var wings = building.state.wings;
    if (wings === null) {
      renderError.innerText = "Couldn't retrieve data for wings.";
      return;
    }
    var wingId = this.state.wingId;
    if (wingId < 0 || wingId >= wings.length) {
      renderError.innerText = "Wing ID is out of range.";
      return;
    }
    var wing = building.state.wings[wingId];

    var floors = wing.state.floors;
    if (floors === null) {
      renderError.innerText = "Couldn't retrieve data for floors.";
      return;
    }
    var floorId = this.state.floorId;
    if (floorId < 0 || floorId >= floors.length) {
      renderError.innerText = "Floor ID is out of range.";
      return;
    }
    var floor = wing.state.floors[floorId];

    var rooms = floor.state.rooms;
    if (rooms === null) {
      renderError.innerText = "Couldn't retrieve data for rooms.";
      return;
    }
    var rooms = floor.state.rooms;

    var x = floor.state.x;
    var y = floor.state.y;
    var sizeX = floor.state.sizex;
    var sizeY = floor.state.sizey;

    // dane piętra
    console.log("Nazwa pokoju: " + floor.state.name + ", x: " + x + ", y: " + y + ", sizeX: " + sizeX + ", sizeY: " + sizeY);

    ctx.moveTo(margin + x * scale, margin + y * scale);
    ctx.lineTo(margin + sizeX * scale, margin + y * scale);
    ctx.lineTo(margin + sizeX * scale, margin + sizeY * scale);
    ctx.lineTo(margin + x * scale, margin + sizeY * scale);
    ctx.lineTo(margin + x * scale, margin + y * scale);
    ctx.stroke();

    // rysowanie pokojów
    var roomId = 0;

    // dodać by pokazywało wszystkie pokoje
    while (rooms[roomId]) {
      let rsizeX = rooms[roomId].state.sizex;
      let rsizeY = rooms[roomId].state.sizey;
      let rx = rooms[roomId].state.x;
      let ryReal = rooms[roomId].state.y;
      let ry = sizeY - (rooms[roomId].state.y + rsizeY);

      // dane pokojów
      console.log("Nazwa pokoju: " + rooms[roomId].state.name + ", rx: " + rx + ", ry: " + ry + ", rsizeX: " + rsizeX + ", rsizeY: " + rsizeY);

      // nazwa pokoju
      ctx.font = scale * 0.4 + "px Arial"
      ctx.fillText(rooms[roomId].state.name, margin + scale * 0.2 + rx * scale, margin + scale * 0.6 + ry * scale)
      //punkt (7,6)
      ctx.moveTo(margin + rx * scale, margin + ry * scale);
      // (7,6) - (14,6)
      ctx.lineTo(margin + rsizeX * scale + rx * scale, margin + ry * scale);
      // (14,6) - (14,12)
      ctx.lineTo(margin + rsizeX * scale + rx * scale, margin + rsizeY * scale + ry * scale);
      // (14,12) - (7,12)
      ctx.lineTo(margin + rx * scale, margin + rsizeY * scale + ry * scale);
      // (7,12) - (7,6)
      ctx.lineTo(margin + rx * scale, margin + ry * scale);
      ctx.stroke();

      //rysowanie dzwi
      //dane dzwi
      var links = rooms[roomId].state.links;
      var doorId = 0;

      while (links[doorId]) {
        let dsizeX = links[doorId].state.sizex;
        let dsizeY = links[doorId].state.sizey;
        let dx = links[doorId].state.x + rx;
        //let dy = ry
        //let dx = links[doorId].state.x;
        let dy = sizeY - (links[doorId].state.y + dsizeY + ryReal);

        // dane drzwi
        console.log("Drzwi nr: " + doorId + ", dx: " + dx + ", dy: " + dy + ", dsizeX: " + dsizeX + ", dsizeY: " + dsizeY);

        //punkt (7,6)
        ctx.moveTo(margin + dx * scale, margin + dy * scale);
        // (7,6) - (14,6)
        ctx.lineTo(margin + dsizeX * scale + dx * scale, margin + dy * scale);
        // (14,6) - (14,12)
        ctx.lineTo(margin + dsizeX * scale + dx * scale, margin + dsizeY * scale + dy * scale);
        // (14,12) - (7,12)
        ctx.lineTo(margin + dx * scale, margin + dsizeY * scale + dy * scale);
        // (7,12) - (7,6)
        ctx.lineTo(margin + dx * scale, margin + dy * scale);
        ctx.stroke();

        doorId++;
      }
      roomId++;
    }
    renderError.innerText = "";
    // dane piętra
    // console.log("Nazwa pokoju: " + floor.state.name + ", x: " + x + ", y: " + y + ", sizeX: " + sizeX + ", sizeY: " + sizeY);
    // dane pokojów
    // console.log("Nazwa pokoju: " + rooms[roomId].state.name + ", rx: " + rx + ", ry: " + ry + ", rsizeX: " + rsizeX + ", rsizeY: " + rsizeY);
  }

  // Render strony
  render = () => {
    return (
    <div>

        <div>
          <SideNav
            onSelect={(selected) => {
              console.log(selected);
            }}
            className='mysidenav'
          >

            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="home">


              <NavItem eventKey="home" >
                <NavIcon>
                  <i className='fa fa-fw fa-home' style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText>Home</NavText>
              </NavItem>


              <NavItem eventKey="file" >
                <NavIcon>
                  <i className='fa-solid fa-file' style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText>
                  <input type="file" onChange={this.setSelectedFile} accept=".json" />
                </NavText>
              </NavItem>

              <NavItem eventKey="code" >
                <NavIcon>
                  <i className='fa-solid fa-code' style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText>
                  <textarea
                    id="textinput"
                    value={this.state.string}
                    onChange={this.inputChange} />
                </NavText>
              </NavItem>


              <NavItem eventKey="search" >
                <NavIcon>
                  <i className="fa-solid fa-paintbrush" style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText><button onClick={this.onButtonClick}>Render</button></NavText>
              </NavItem>

              <NavItem eventKey="show-beacons" >
                <NavIcon>
                  <i class="fa-solid fa-eye-low-vision" style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText><button onClick={this.clearCanvas}>Clear</button></NavText>
              </NavItem>

              <NavItem eventKey="select-wing" >
                <NavIcon>
                  <i class="fa-solid fa-door-open" style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText><label htmlFor="wing">Wing: </label>
                  <input
                    type="number"
                    onChange={this.setWingId}
                    value={this.state.wingId}
                    min="0"
                    max={this.getWingAmount() - 1}
                    name="wing" /></NavText>
              </NavItem>

              <NavItem eventKey="select-floor" >
                <NavIcon>
                  <i className="fa-solid fa-stairs" style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText>
                  <label htmlFor="floor">Floor: </label>
                  <input
                    type="number"
                    onChange={this.setFloorId}
                    value={this.state.floorId}
                    min="0"
                    max={this.getFloorAmount() - 1}
                    name="floor" />
                </NavText>
              </NavItem>

              <NavItem eventKey="zoom-in" >
                <NavIcon>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText>
                  <label htmlFor="margin">Margin: </label>
                  <input
                    type="number"
                    onChange={this.setMargin}
                    value={this.state.margin}
                    name="margin" />

                </NavText>
              </NavItem>

              <NavItem eventKey="zoom-out" >
                <NavIcon>
                  <i className="fa-solid fa-magnifying-glass-plus" style={{ fontSize: "1.5em" }} />
                </NavIcon>
                <NavText>
                  <label htmlFor="scale">Scale: </label>
                  <input
                    type="number"
                    onChange={this.setScale}
                    value={this.state.scale}
                    name="scale" />

                </NavText>
              </NavItem>



            </SideNav.Nav>
          </SideNav>
        </div>

        <div className='page'>
          <canvas id="canvas" width="640" height="480" style={{ border: '1px solid black', margin: '20px' }}></canvas><br />
          <p id="render_error" style={{ color: 'red' }} />
        </div>


      </div>
    )
  }
}
