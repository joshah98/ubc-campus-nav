import { useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./app.css";
import { SearchBar } from './components/Searchbar/SearchBar.js';
import axios from 'axios';

const App = () => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.2606,
    longitude: -123.2460,
    zoom: 14
  });

  const [pins, addPin] = useState([]);
  const [markers, addMarker] = useState([]);

  const [showPopup, togglePopup] = useState(true);

  const addNewMarker = (course, section, building, time) => {
    let newMarker = {
      course: course,
      section: section,
      building: building,
      time: time
    };

    addMarker([...markers, newMarker]);
  };

  const addNewPin = (course, section) => {
    axios.get(`https://ubcapi.herokuapp.com/courses/${course}/${section}`)
      .then(result => {
        let building = result.data[0].building;
        let time = result.data[0].time;

        addNewMarker(course, section, building, time);

        axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_GEOCODE_TOKEN}&query=${building} vancouver`)
          .then(result => {
            let newPin = {
              latitude: result.data.data[0].latitude,
              longitude: result.data.data[0].longitude
            };

            addPin([...pins, newPin]);
          })
      });

      setViewport(viewport);

  };

  return (
    <div className="app">
      <SearchBar newPin={(course, section) => addNewPin(course, section) }/>        
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/joshah/ckrfy2ocs2v4x18lfk22f06cu"
        >

        <div className="markers">
          {pins.map((p, i) =>            
            <Marker latitude={p.latitude} longitude={p.longitude} offsetLeft={-20} offsetTop={-10} key={i}>
              <Room style={{fontSize: viewport.zoom * 3}}/>
            </Marker>
          )}
        </div>

        {/* {showPopup && <Popup
          latitude={49.264208}
          longitude={-123.253054}
          closeButton={true}
          closeOnClick={false}
          onClose={() => togglePopup(false)}
          anchor="left" >
          <div className="checkpoint">
          <label>Course</label>
          <h4 className="course">CHEM 111 101</h4>
          <label>Building</label>
          <h4 className="content">UBC building</h4>
          <label>Time</label>
          <p className="content">9:30-10:30</p>
          </div>
        </Popup>} */}
      </ReactMapGL>
    </div>
  );
};

export default App;