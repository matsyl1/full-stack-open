const Login = ({ username, password, setUsername, setPassword, handleLogin }) => (
  <>
    <h2>log into application</h2>
    <form onSubmit={handleLogin}>
      <div>
    username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
    password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button data-testid='login-button' type="submit">login</button>
    </form>
  </>
)

export default Login