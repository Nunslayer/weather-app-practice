import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import CardPlace from './components/CardPlace'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearchLocation} from '@fortawesome/free-solid-svg-icons'
import { useLoadScript } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from 'use-places-autocomplete'
//const libraries = ['places']
export default function WeatherApp () {
  const { isLoaded} = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries:['places']
  })
  if(!isLoaded) {
    return <h1>loading...</h1>
  }
  return (
    <App />
  )
} 
function App() {

  const [isReady, setIsReady] = useState(false)
  const [weather, setWeather] = useState([])
  const [forecast, setForecast] = useState([])
  const [placeData, setPlaceData] = useState(null)
  const [placeName, setNamePlace] = useState(null)
  
  const getLocation = ({ lat, lng }) => {
      const urlWeater = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_APP_OPEN_WEATHER_DOT_ORG_API_KEY}&units=metric&lang=es`
      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_APP_OPEN_WEATHER_DOT_ORG_API_KEY}&units=metric&lang=es`
      axios.get(urlWeater)
        .then(response => setWeather(response.data))
        .catch(error => console.log(error))
      axios.get(urlForecast)
        .then(response => {
          setForecast(response.data.list)
          setIsReady(true)
        })
        .catch(error => console.log(error))
      return
  }

  useEffect(()=>{
    const getUserLocation = async() => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }

      const succes = async(pos) => {
        const crd = pos.coords;
        const latAndLng = { lat: crd.latitude, lng: crd.longitude }
        let results = await getGeocode({location: latAndLng})
        results = results.filter(result => result.types[0]==='locality')
        setNamePlace(results[0].formatted_address)
        const request = {
          placeId: results[0].place_id,
          fields: ['name', 'photo']
        }
        const {name, photos} = await getDetails(request)
        const urlPhoto = photos[0].getUrl({maxWidth: 1600, maxHeight: 400})
        setPlaceData(urlPhoto)
        return getLocation(latAndLng)
      }
      const error = (error) => {
        alert('error' + error)
      }

      await navigator.geolocation.getCurrentPosition(succes, error, options)
      return
    }
    getUserLocation()
  }, [])

  return (
    <div className="App">
        <PlacesAutocomplete
            setPlaceData={setPlaceData}
            setNamePlace={setNamePlace}
            getLocation = {getLocation}
        />
        <CardPlace
          isReady={isReady}
          weather={weather}
          placeData={placeData}
          placeName={placeName}
          forecast={forecast}
        />
    </div>
  )
}
       
const PlacesAutocomplete = ({ setPlaceData, setNamePlace, getLocation }) => {
  
  const {ready, value, setValue, suggestions:{ status, data }, clearSuggestions} = usePlacesAutocomplete()
  const searchIcon = <FontAwesomeIcon icon={faSearchLocation}/>

  const handleSelect = ({ description, place_id }) => async() =>{
    setValue(description, false)
    clearSuggestions()    
    const request = {
      placeId: place_id,
      fields: ['name', 'photo']
    }
    const results = await getGeocode({ address: description })
    console.log(results[0])
    const {lat,lng} = await getLatLng(results[0]);
    setNamePlace(results[0].formatted_address)    
    if(results[0].types[0] === 'route'){
      setPlaceData("https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80")
      getLocation({lat,lng})
      return
    }else{
      const {photos} = await getDetails(request)
      const urlPhoto = photos[0].getUrl({maxWidth: 1080, maxHeight: 600})
      setPlaceData(urlPhoto)
      getLocation({lat,lng})
    }
  }

  const renderSuggestions = () =>
    data.map((suggestions) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text},
      } = suggestions
      return (
        <li key={place_id} onClick={handleSelect(suggestions)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })
  
  return (
    <div className="container-form" >
      <div className='container-input-autocomplete'>  
        <input 
          className='input-autocomplete'
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder='city name'
        />
        <span>  {searchIcon}  </span>
      </div>
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  )
}

