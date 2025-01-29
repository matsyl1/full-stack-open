const Matches = ({ countries, setCountries }) => {

const handleClick = (i) => {
    setCountries([i])
    }
    
    return (
        <>
        {countries.map(i =>
            <div key={i.name.common}>
              {i.name.common}
              <button onClick={() => handleClick(i)}>show</button>
            </div>
        )}
        </>
    )
}

export default Matches