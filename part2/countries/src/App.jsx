import { useState, useEffect } from 'react'
import countryServices from "./services/countries"
import weatherServices from "./services/weather"
import Search from './components/Search'
import CountryInfo from './components/CountryInfo'
import Matches from './components/Matches'


function App() {
  const [value, setValue] = useState("")
  const [allCountries, setAllCountries] = useState([])
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState({temp: null, wind: null, description: null, icon: null})

  //Get countries once & store locally
  useEffect(() => {
    countryServices
      .getCountries()
      .then(res => {
        setAllCountries(res)
      })
  }, [])

  //Filter thru locally stored
  useEffect(() => {
    if (value !== "") {
      const match = allCountries.filter(i => i.name.common.toLowerCase().includes(value.toLowerCase()))
      setCountries(match)
    } else {
      setCountries([])
    }
  }, [value, allCountries])

    //Get weather
    useEffect(() => {
      if(countries.length === 1) {
        weatherServices
          .getWeather(countries[0].capital)
          .then(res => {
            setWeather({temp: res.main.temp.toFixed(2), 
                        wind: res.wind.speed, 
                        description: res.weather[0].description,
                        icon: res.weather[0].icon})
          })
      }
    }, [countries])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <>
      <Search value={value} handleChange={handleChange}/>
      {countries.length > 10 ? (
        <div>Too many matches - specify another filter</div>
      ) : countries.length === 1 ? (
      <CountryInfo countries={countries} weather={weather}/>
      ) : (  
      <Matches countries={countries} setCountries={setCountries}/>
      )}
    </>
  )
}

export default App