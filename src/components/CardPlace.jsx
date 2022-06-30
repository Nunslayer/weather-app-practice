import { useState } from 'react'
import Spinner from './Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLocationDot} from '@fortawesome/free-solid-svg-icons'
import CardForecast from './CardForecast'

const CardPlace = ({placeData, placeName, weather, isReady, forecast}) => {    

    const [isCelsius, setIsCelsius] = useState(true)
    if(!isReady){
        return <Spinner />
    }
    
    const { icon, description } = weather.weather[0]
    const markerIcon = <FontAwesomeIcon icon={faLocationDot} />
    const {temp, temp_min, temp_max} = weather.main
        
    const urlIconFormater = (iconId) => {
        return `http://openweathermap.org/img/w/${iconId}.png`
    }

    const newForecast = forecast.filter((fore, index)=> index===4 ||index===12 || index===20 ||  index===28 || index===36)
    const dateFormater = (dt) => {
        let dateData
        if(dt === 0){
            dateData = new Date()
        }else{
            dateData = new Date(dt)
        }
        const monthsInText = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        const weekDaysLiteral = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
        const dayInNumber = dateData.getDay()
        const monthInNumber = dateData.getMonth()
        const monthLiteral = monthsInText.filter((month, index)=> index ===monthInNumber)
        const dayLiteral =  weekDaysLiteral.filter((day,index) => index===dayInNumber)
        const hourText = dateData.getHours()+':'+dateData.getMinutes()
        return {
            day: dayLiteral,
            dateMonth: dateData.getDate()+'/'+monthLiteral,
            hour: hourText,
        }
    }

    return (
        <>
            { isReady === true? (
                <div className="card">
                    <div className="container-weather">
                        <div className="container-tittles">
                            <h3 className='weather-tittle'>
                                {placeName} <span>{markerIcon}</span>
                            </h3>
                            <p className='weather-subtittle'>
                                <span>{dateFormater(0).day}</span> <span>{dateFormater(0).dateMonth}</span>
                            </p>
                        </div>
                        <div className="subcontainer">                            
                            <div className="data-container">
                                <p className="main-data-weather">
                                    { isCelsius===true?(temp).toFixed():((temp*(9/5))+32).toFixed()}<span>{isCelsius===true?'°C':'°F'}</span>
                                </p>
                                <br />
                                <span className='min-max-weather'>
                                    <span>max: { isCelsius===true?(temp_min).toFixed():((temp_min*(9/5))+32).toFixed()}{isCelsius===true?'°C':'°F'}</span>
                                    /
                                    <span>min: { isCelsius===true?(temp_max).toFixed():((temp_max*(9/5))+32).toFixed()}{isCelsius===true?'°C':'°F'}</span>
                                </span>
                            </div>
                            <div className="icon-container">
                                <img src={urlIconFormater(icon)} alt="nothing to say" />
                                <span>{description}</span>
                            </div>                            
                        </div>
                        <img className='place-image' src={placeData} alt="city image" />
                        <button className={isCelsius?'btn-cf':'btn-cf onF'} onClick={()=>setIsCelsius(!isCelsius)} >
                            <div 
                                className={isCelsius?"circle-option":"circle-option onF"}
                            >
                                {isCelsius===true?'c':'f'}
                            </div>
                        </button>
                    </div>
                    
                    <CardForecast
                    dateFormater={dateFormater}
                    newForecast={newForecast}
                    urlIconFormater={urlIconFormater}
                    isCelsius={isCelsius}
                    />
                </div>
            ):<h1>I am sorry so much, my bad</h1>}
        </>
    )
}

export default CardPlace