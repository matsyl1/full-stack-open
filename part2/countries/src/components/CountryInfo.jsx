const CountryInfo = ({ countries, weather }) => {

    return (
        <>
        {countries.map(i =>
            <div key={i.name.common}>
            <h2>{i.name.common}</h2>
            <div>Capital: {i.capital}</div>
            <div>Area: {i.area} km²</div>
            <div>Population: {i.population}</div>
            <h4>Languages:</h4>
            <ul>{Object.values(i.languages).map(i =>
                <li key={i}>{i}</li>)}
            </ul>
            <img src={i.flags.png} style={{maxWidth: "100px", border: "1px solid black"}}/>
            </div>
        )}
        <h4>Weather in {countries[0].capital}:</h4>
        <div>Temperature: {weather.temp} °C</div>
        <div>Wind: {weather.wind} m/s</div>
        <div>Conditions: {weather.description}</div>
        <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}/>
        </>
    )
}

export default CountryInfo