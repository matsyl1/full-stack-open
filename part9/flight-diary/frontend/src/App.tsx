import { useState, useEffect } from "react";
import { getAllDiaries, addDiary } from "./services/diaryService";
import type { DiaryEntry, Visibility, Weather } from "./types";
import axios from "axios";

const App = () => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  const [comment, setComment] = useState('');
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    });
  }, [])


  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!weather || !visibility || !date) {
      setNotification("Select date/weather/visibility.");
      return;
    }

    const newDiary = {
      date,
      weather,
      visibility,
      comment,
    };

    try {
      const added = await addDiary(newDiary);
      setDiaries(diaries.concat(added));
      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
      setNotification('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNotification(error.response?.data?.error);
      } else if (error instanceof Error) {
        setNotification(error.message);
      } else {
        setNotification('Unknown error');
      }
    };
  };


  return (
    <>
      <h3>Add new entry</h3>
        <div style={{ color:'red' }}>{notification}</div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date">Date </label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label>Weather: </label>
              <input type="radio" id="sunny" name="weather" value="sunny" checked={weather === 'sunny'} onChange={(e) => setWeather(e.target.value as Weather)} />
                <label htmlFor="sunny">sunny</label>
              <input type="radio" id="rainy" name="weather" value="rainy" checked={weather === 'rainy'} onChange={(e) => setWeather(e.target.value as Weather)} />
                <label htmlFor="rainy">rainy</label>
              <input type="radio" id="cloudy" name="weather" value="cloudy" checked={weather === 'cloudy'} onChange={(e) => setWeather(e.target.value as Weather)} />
                <label htmlFor="cloudy">cloudy</label>
              <input type="radio" id="stormy" name="weather" value="stormy" checked={weather === 'stormy'} onChange={(e) => setWeather(e.target.value as Weather)} />
                <label htmlFor="stormy">stormy</label>
              <input type="radio" id="windy" name="weather" value="windy" checked={weather === 'windy'} onChange={(e) => setWeather(e.target.value as Weather)} />
                <label htmlFor="windy">windy</label>
          </div>
          <div>
            <label>Visibility: </label>
              <input type="radio" id="great" name="visibility" value="great" checked={visibility === 'great'} onChange={(e) => setVisibility(e.target.value as Visibility)} />
                <label htmlFor="great">great</label>
              <input type="radio" id="good" name="visibility" value="good" checked={visibility === 'good'} onChange={(e) => setVisibility(e.target.value as Visibility)} />
                <label htmlFor="good">good</label>
              <input type="radio" id="ok" name="visibility" value="ok" checked={visibility === 'ok'} onChange={(e) => setVisibility(e.target.value as Visibility)} />
                <label htmlFor="ok">ok</label>
              <input type="radio" id="poor" name="visibility" value="poor" checked={visibility === 'poor'} onChange={(e) => setVisibility(e.target.value as Visibility)} />
                <label htmlFor="poor">poor</label>

          </div>
          <div>
            <label htmlFor="comment">Comment </label>
            <input type="text" id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button type="submit">add</button>
        </form>
      <h3>Diary entries</h3>
        {diaries.map(diary => (
          <div key={diary.id}>
            <h4>{diary.date}</h4>
            <div>Weather: {diary.weather}</div>
            <div>Visibility: {diary.visibility}</div>
            <div><i>"{diary.comment}"</i></div>
          </div>
      ))}
    </>
  )
}

export default App
