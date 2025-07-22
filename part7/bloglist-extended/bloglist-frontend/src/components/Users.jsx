import { Link, Routes, Route } from 'react-router-dom'
import User from './User'



const Users = ({ blogs }) => {
  const map = {}

  blogs.forEach(blog => {
    const user = blog.user
    const id = user.id
    const name = user.name

    if(!map[id]) {
      map[id] = { name, blogs: 0 }
    }
    map[id].blogs += 1
  })

  const separateUsers = Object.entries(map)
  // console.log(separateUsers)

  return (
    <div>

      <Routes>
        <Route path='/' element={
          <>
            <h2>users</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>blogs created</th>
                </tr>
              </thead>
              <tbody>
                {separateUsers.map(([id, info]) => (
                  <tr key={id}>
                    <td><Link to={id}>{info.name}</Link></td>
                    <td>{info.blogs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }/>
        <Route path=':id' element={<User blogs={blogs}/>}/>
      </Routes>
    </div>
  )
}

export default Users