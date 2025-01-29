const Filter = ({ search, handleNameSearch }) => {
    return (
        <div>
        filter shown with: <input value={search} onChange={handleNameSearch} />
      </div>
    )
}

export default Filter