import socketIo from 'socket.io'
import { InitializerContext, AuthSession } from 'types'
import serviceLocator from 'utils/serviceLocator'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

type Socket = socketIo.Socket & { user_id: string; username: string }
export default function initializeSocket({ server }: InitializerContext) {
  const io = socketIo.listen(server.server)
  const DB = serviceLocator.get('DB')

  io.use((socket: Socket, next) => {
    const { cookie: cookie_header } = socket.request.headers
    if (cookie_header) {
      const { access_token } = cookie.parse(cookie_header)
      if (access_token) {
        const { user_id, username } = jwt.verify(access_token, process.env.AUTH_SECRET) as AuthSession
        socket.user_id = user_id
        socket.username = username
      }
    }
    next()
  })

  io.on('connection', (socket: Socket) => {
    socket.broadcast.emit('userJoined', {
      username: socket.username,
    })
    socket.on('newMessage', async (data, cb) => {
      const response = await DB.insert('message', data)
      socket.broadcast.emit('stopTyping', { username: socket.username, id: socket.user_id })
      io.emit('newMessage', {
        ...response,
        sender: socket.username,
      })
      cb()
    })

    socket.on('typing', () => {
      socket.broadcast.emit('typing', { username: socket.username, id: socket.user_id })
    })

    socket.on('stopTyping', () => {
      socket.broadcast.emit('stopTyping', { username: socket.username, id: socket.user_id })
    })
  })

  serviceLocator.registerService('io', io)
}
