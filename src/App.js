import { useEffect, useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./app.css";
import { SearchBar } from './components/Searchbar/SearchBar.js';
import SummaryTab from './components/SummaryTab/SummaryTab.js';
import PolylineOverlay from './components/PolylineOverlay/PolylineOverlay';
import Header from './components/Header/Header';
import axios from 'axios';

const containsObject = (obj, list) => {

  for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
          return true;
      }
  }

  return false;
}

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
    if (pins.length > 1) {
      routeMap();
    } else if (pins.length === 1) {
      setRoutes([]);
    }

  }, [pins]);

  const routeMap = () => {
    let coords = "";
    pins.filter(p => p.show === true).map(pin => {
      coords = coords.concat(`;${pin.longitude},${pin.latitude}`);
    });
    coords = coords.substr(1, coords.length);

    axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&access_token=${process.env.REACT_APP_MAP_TOKEN}`)
      .then(result => setRoutes(result.data.routes[0].geometry.coordinates));
  };



  const addFillers = (oldPins) => {
    if (oldPins.length > 0) {
      let pinsFilled = [...oldPins];
      let fillers = [];
      const n = oldPins.length;
      
      for (let i = 0; i < n - 1; i++) {
        let currEnd = oldPins[i].end;
        let nextStart = oldPins[i+1].start;
  
        if (currEnd !== nextStart) {
          console.log(`Filler between ${currEnd} and ${nextStart}`);
          let filler = {
            course: "Empty block",
            section: "",
            building: "",
            start: currEnd,
            end: nextStart,
            latitude: null,
            longitude: null,
            show: false,
            index: i + 1 + fillers.length, // This accounts for the changing size of the pin array after adding fillers
            prevCourseBuilding: oldPins[i].building
          }
  
          fillers.push(filler);
  
        }
      }
  
      for (const f of fillers) {
        pinsFilled.splice(f.index, 0, f);
      }
  
      setPins(pinsFilled);
    }
  };




  const insertNewCourse = (course) => {
    let oldPins = pins.filter(p => p.show === true);
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

    addFillers(oldPins);
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
              longitude: data[0].longitude,
              show: true,
              index: null,
              prevCourseBuilding: null
            };
            
            if (!containsObject(newPin, pins)) {
              insertNewCourse(newPin);
            }
          })
      });

      setViewport(viewport);

  };

  const removeCourse = (course) => {
    let newCourses = pins.filter(p => p.show === true);
    const index = newCourses.indexOf(course);
    if (index > -1) {
      newCourses.splice(index, 1);

      if (newCourses.length === 0) {
        setPins([]);
      } else {
        addFillers(newCourses);
      }
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
          {pins.filter(p => p.show === true).map((p, i) =>
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