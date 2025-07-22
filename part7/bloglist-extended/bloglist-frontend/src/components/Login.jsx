import { Table, Form, Button } from 'react-bootstrap'

const Login = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => (
  <>
    <h2>log into application</h2>
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <Form.Label>password:</Form.Label>
        <Form.Control
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant='primary' data-testid="login-button" type="submit">
        login
      </Button>
    </Form>
  </>
)

export default Login
