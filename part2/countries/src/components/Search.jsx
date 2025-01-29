const Search = ({ value, handleChange }) => {
    return (
        <>
            <label htmlFor="search">Search for countries:</label> 
            <div><input id='search' value={value} onChange={handleChange}/></div>
        </>
    )
}

export default Search