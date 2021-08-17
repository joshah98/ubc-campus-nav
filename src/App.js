import { useEffect, useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./app.css";
import { SearchBar } from './components/Searchbar/SearchBar.js';
import SummaryTab from './components/SummaryTab/SummaryTab.js';
import PolylineOverlay from './components/PolylineOverlay/PolylineOverlay';
import Header from './components/Header/Header';
import axios from 'axios';

const App = () => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.2606,
    longitude: -123.2460,
    zoom: 14
  });
  
  const [pins, setPins] = useState([]);
  const [popup, setPopup] = useState(null);
  const [routes, setRoutes] = useState([]);

  
  useEffect(() => {
    console.log("Length of pins: "+pins.length)
    if (pins.length > 1) {
      routeMap();
    } else if (pins.length === 1) {
      setRoutes([]);
    }

  }, [pins]);

  const routeMap = () => {
    let coords = "";
    pins.map(pin => {
      coords = coords.concat(`;${pin.longitude},${pin.latitude}`);
      console.log(coords);
    });
    coords = coords.substr(1, coords.length);
    console.log(coords);

    axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&access_token=${process.env.REACT_APP_MAP_TOKEN}`)
      .then(result => setRoutes(result.data.routes[0].geometry.coordinates));
  };

  const insertNewCourse = (course) => {
    let oldPins = [...pins];
    let index = 0;
    
    if (oldPins.length === 0) {
      setPins([course]);
    }
    
    // new start before curr start, new end before curr start => insert, break loop
    // new start before curr start, new end after curr start => error, course overlap
    // new start after curr start => increment, continue loop
    // if index is at length, then insert to back of array
    
    while (index < oldPins.length) {
      let currCourse = oldPins[index];
      if (Date.parse(`01/01/2000 ${currCourse.start}`) > Date.parse(`01/01/2000 ${course.start}`)) {
        if (Date.parse(`01/01/2000 ${currCourse.start}`) > Date.parse(`01/01/2000 ${course.end}`)) {
          oldPins.splice(index, 0, course);
          setPins(oldPins);
          
          break;
        } else {
          console.log("ERROR");
          break;
        }
      }
      
      index++;
      
      if (index === oldPins.length) {
        oldPins.push(course);
        setPins(oldPins);
        break;
      }
    }
  };

  const addNewPin = (course, section) => {
    axios.get(`https://ubcapi.herokuapp.com/courses/${course}/${section}`)
      .then(result => {
        let building = result.data[0].building;
        let start = result.data[0].start;
        let end = result.data[0].end;

        axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_GEOCODE_TOKEN}&query=${building} vancouver`)
          .then(result => {
            let data = result.data.data.filter(loc => {
              return loc.neighbourhood === "University of British Columbia";
            });

            let newPin = {
              course: course,
              section: section,
              building: building,
              start: start,
              end: end,
              latitude: data[0].latitude,
              longitude: data[0].longitude
            };

            insertNewCourse(newPin);
          })
      });

      setViewport(viewport);

  };

  const removeCourse = (course) => {
    let newCourses = [...pins];
    const index = newCourses.indexOf(course);
    if (index > -1) {
      newCourses.splice(index, 1);
      setPins(newCourses);
    }
  };

  return (
    <div className="app">
      <Header/>
      <SearchBar newPin={(course, section) => addNewPin(course, section) }/>
      <SummaryTab courses={pins} remove={(course) => removeCourse(course)}/>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/joshah/ckrfy2ocs2v4x18lfk22f06cu"
        onClick={() => {setPopup(null)}}
        >

        <PolylineOverlay points={routes} />

        <div className="markers">
          {pins.map((p, i) =>            
            <Marker latitude={p.latitude} longitude={p.longitude} offsetLeft={-20} offsetTop={-10} key={i} onClick={() => setPopup(p)}>
              <Room className="room" style={{fontSize:"40px"}} />
            </Marker>
          )}
        </div>

        {popup !== null && <Popup
          className="popup-content"
          latitude={popup.latitude}
          longitude={popup.longitude}
          anchor="bottom" >
          <div className="checkpoint">
            <label>Course</label>
            <h4 className="popupCourse">{popup.course}</h4>
            <label>Building</label>
            <h4 className="content">{popup.building}</h4>
            <label>Time</label>
            <p className="content">{popup.start} - {popup.end}</p>
          </div>
        </Popup>}
      </ReactMapGL>
    </div>
  );
};

export default App;