import React, { useEffect,useState } from 'react';
import ReactMapGL,{Marker,Popup} from 'react-map-gl';
import {PinDrop,Star} from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage=window.localStorage;
  const [currentUser,setCurrentUser]=useState(myStorage.getItem("user"));
  const [pins,setPins]= useState([])
  const [currentPlaceId, setCurrentPlaceId]=useState(null);
  const [newPlace,setNewPlace] =useState(null);
  const [title,setTitle]=useState(null);
  const [desc,setDesc]=useState(null);
  const [rating,setRating]=useState(0);
  const [showRegister, setShowRegister]=useState(false);
  const [showLogin, setShowLogin]=useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 2
  });

  useEffect(() => {
    const getPins=async ()=>{
       try{
          const allpins=await axios.get("/pins");
          setPins(allpins.data);
       }catch(err)
       {
          console.log(err)
       }
    };
    getPins()
  }, []);

  const handleMarkerClick = (id,lat ,long)=>{
    setCurrentPlaceId(id)
    setViewport({...viewport, latitude:lat,longitude:long})
  }

  const handleAddClick=(e)=>{
      const [long,lat]=e.lngLat;
      setNewPlace({
        lat:latitude,
        long:longitude,
      });
  };

  const handleSubmit= async (e)=>{
    e.preventDefault();
    const newPin={
      username:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,

    }

    try{

      const res=await axios.post("/pins", newPin)
      setPins([...pins,res.data]);
      setNewPlace(null);
    }catch(err)
    {
       console.log(err);
    }
  };

  const handleLogout=()=>{
    setCurrentUser(null);
    myStorage.removeItem("user");
  }

  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken ={process.env.REACT_APP_MAPBOX} 
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/ptlharshil/ckox30sx810jc17s66viwy6hx" 
      onDblClick={handleAddClick} 
      transitionDuration="20">
       {pins.map(p=>(

      <>
       
        <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom*7} offsetTop={viewport.zoom*3.5}>
           <PinDrop style={{color:'slateblue',fontSize:viewport.zoom*10,cursor:'pointer'}}
            onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
           />
        </Marker>
        {p.id===currentPlaceId &&
        <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          //onClose={() => togglePopup(false)}
          anchor="left"
          onClose={()=>setCurrentPlaceId(null)} >
          <div className="card"></div>
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
              {Array(p.rating).fill(<Star className="star"/>)}
            </div>
            <label>Information</label>
            <span className="username">Created by: {p.username}</span>
            <span className="date">{format(p.createdAt)}</span>
        </Popup>}
      </>
        ))}

      {newPlace &&(
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          //onClose={() => togglePopup(false)}
          anchor="left"
          onClose={()=>setNewPlace(null)} >
             <div>
               <form onSubmit={handleSubmit}>
                 <label>Title</label>
                 <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}></input>
                 <label>Review</label>
                 <textarea placeholder="Your Experience" onChange={(e)=>setDesc(e.target.value)}></textarea>
                 <label>Rating</label>
                 <select onChange={(e)=>setRating(e.target.value)}>
                   <option value="1">1</option>
                   <option value="2">2</option>
                   <option value="3">3</option>
                   <option value="4">4</option>
                   <option value="5">5</option>
                 </select>
                 <button className="submitButton" type="submit">Add Pin</button>
               </form>
             </div>
          </Popup>
          )}
          {currentUser ? (<button className="button logout" onClick={handleLogout}>Logout</button>):(
            <div className="buttons">
              <button className="button login" onClick={()=>setShowLogin(true)}>Sign In</button>
              <button className="button register" onClick={()=>setShowRegister(true)}>Sign Up</button>
            </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister}/>}
          {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
          
          
      </ReactMapGL>
    </div>
  );
}

export default App;
