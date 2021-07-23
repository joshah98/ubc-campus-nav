import { useState } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import {Room} from "@material-ui/icons";

function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.2606,
    longitude: -123.2460,
    zoom: 14
  });

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        <Marker latitude={49.2606} longitude={-123.246} offsetLeft={-20} offsetTop={-10}>
          <Room style={{fontSize: viewport.zoom * 3}}/>
        </Marker>  
      </ReactMapGL>
    </div>
  );
}

export default App;
