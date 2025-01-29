import axios from "axios"

const APIKey = import.meta.env.VITE_API_KEY

const getWeather = (capital) => {
    const req = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital},&APPID=${APIKey}&units=metric`)
    return req.then(res => res.data)
}

export default { getWeather }