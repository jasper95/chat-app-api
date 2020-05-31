import socketIo from 'socket.io'
import { InitializerContext } from 'types'
import serviceLocator from 'utils/serviceLocator'

type Socket = socketIo.Socket & { user_id: string; username: string }
export default function initializeSocket({ server }: InitializerContext) {
  const io = socketIo.listen(server.server)
  const DB = serviceLocator.get('DB')
  io.use((socket: Socket, next) => {
    if (!socket.user_id) {
      throw new Error('Unauthorized')
    }
    next()
  })

  io.on('connection', (socket: Socket) => {
    socket.on('joinUser', (data: { username: string; user_id: string }) => {
      socket.user_id = data.user_id
      socket.username = data.username
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
