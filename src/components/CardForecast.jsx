const CardForecast = ( {newForecast, dateFormater, urlIconFormater, isCelsius} ) => {
    
    const renderForecastCards = () =>
    newForecast.map((forecast) => {
      const { dt, dt_txt, main:{temp, temp_min, temp_max} } = forecast
      const { icon, description } = forecast.weather[0]
      return (
        <div className='card-forecast' key={dt} >
          <h4>{dateFormater(dt_txt).day}</h4>
          <p className='forecast-subtittle'>{dateFormater(dt_txt).dateMonth}</p>
          <div className="container-icon-forecast">
            <img src={urlIconFormater(icon)} alt="" />
            <p>{description}</p>
          </div>
            <div className="data-container-forecast">
                <p className="main-data-forecast">
                     { isCelsius===true?(temp).toFixed():((temp*(9/5))+32).toFixed()} <span>{isCelsius===true?'°C':'°F'}</span>
                </p>
            </div>
            <p className='min-max-forecast'>
                <span>min: { isCelsius===true?(temp_min).toFixed():((temp_min*(9/5))+32).toFixed()}{isCelsius===true?'°C':'°F'}</span>
                    /
                <span>max: { isCelsius===true?(temp_max).toFixed():((temp_max*(9/5))+32).toFixed()}{isCelsius===true?'°C':'°F'}</span>
            </p>
        </div>
      )
    })

    return(
        <div className="container-card-forecast">
            {renderForecastCards()}
        </div>
    )
}

export default CardForecast 