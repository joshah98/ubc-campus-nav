import { useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./app.css";
import { SearchBar } from './components/SearchBar.js';

function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.2606,
    longitude: -123.2460,
    zoom: 14
  });
  

  const [showPopup, togglePopup] = useState(true);

  return (
    <div className="app">
      <SearchBar/>        
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/joshah/ckrfy2ocs2v4x18lfk22f06cu"
        >
        <Marker latitude={49.2606} longitude={-123.246} offsetLeft={-20} offsetTop={-10}>
          <Room style={{fontSize: viewport.zoom * 3}}/>
        </Marker>
        {/* {showPopup && <Popup
          latitude={49.2606}
          longitude={-123.2460}
          closeButton={true}
          closeOnClick={false}
          onClose={() => togglePopup(false)}
          anchor="left" >
          <div className="checkpoint">
          <label>Building</label>
          <h4 className="content">UBC building</h4>
          <label>Time</label>
          <p className="content">9:30-10:30</p>
          </div>
        </Popup>} */}
      </ReactMapGL>
    </div>
  );
}

export default App;
