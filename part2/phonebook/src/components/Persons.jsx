const Persons = ({ search, persons, filtered, handleDelete }) => {
    return (
        <>
        {(search === "" ? persons : filtered).map(i =>
            <div key={i.id}>
                {i.name} {i.number} 
                <button onClick={() => handleDelete(i.name, i.id)}>delete</button>
            </div>
          )}
        </>
    )
}

export default Persons