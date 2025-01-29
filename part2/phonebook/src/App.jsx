import { useState, useEffect } from 'react'
import "./index.css"
import personServices from "./services/persons.js"
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from "./components/Notification.jsx"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState([])
  const [notification, setNotification] = useState({msg: null, type: null})

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        setNotification({msg: `Failed to fetch contacts: ${error.message}`, type: "error"})
      })
  }, [])
  
  const addContact = (event) => {
    event.preventDefault()
    const existingName = persons.some(i => i.name.trim() === newName.trim())
    const existingNumber = persons.some(i => i.number.trim() === newNumber.trim())

    if (existingName && !existingNumber) {
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const existingContact = persons.find(i => i.name.trim() === newName.trim()) 
        const id = existingContact ? existingContact.id : null
        const contact = persons.find(i => i.id === id)
        const changedContact = {...contact, number: newNumber}
        
        personServices
          .update(id, changedContact)
          .then(res => {
            setPersons(persons.map(i => i.id === id ? res : i))
            setNewName("")
            setNewNumber("")
            setNotification({msg: `Number changed for ${res.name}`, type: "success"})
            setTimeout(() => {
              setNotification({msg: null, type: null})
            }, 3000)

          })
          .catch(error => {
            setNotification({msg: `Information of ${changedContact.name} has already been removed from server`, type: "error"})
            setPersons(persons.filter(i => i.id !== id))
            setTimeout(() => {
              setNotification({msg: null, type: null})
            }, 3000)
            setNewName("")
            setNewNumber("")
          })
      }
    } 
    else {
      const contactObject = 
        { name: newName.trim(),
          number: newNumber.trim(),
        }
      
      personServices
        .create(contactObject)
        .then(res => {
          setPersons(persons.concat(res))
          setNewName("")
          setNewNumber("")

          setNotification({msg: `Added ${res.name}`, type: "success"})
          setTimeout(() => {
            setNotification({msg: null, type: null})
          }, 3000)

        })
        .catch(error => {
          setNotification({msg: `Failed to add new contact: ${error.message}`, type: "error"})
        })
    }
  }

  const handleDelete = (name, id) => {
    if(window.confirm(`Delete ${name}?`)) {
      personServices
      .remove(id)  
      .then(() => {
        setPersons(persons.filter(i => i.id !== id))
      })
      .catch(error => {
        setNotification({msg: `Failed to delete contact: ${error.message}`, type: "error"})
      })
    } 
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameSearch = (event) => {
    const input = event.target.value
    setSearch(input)
    const match = persons.filter(i => i.name.toLowerCase().startsWith(input.toLowerCase()))
    setFiltered(match)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Filter search={search} handleNameSearch={handleNameSearch}/> 
      <h2>add a new</h2>
      <PersonForm addContact={addContact} 
                  newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons search={search} persons={persons} filtered={filtered} handleDelete={handleDelete}/>
    </div>
  )
}

export default App