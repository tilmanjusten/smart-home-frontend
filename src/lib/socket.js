import io from 'socket.io-client'
import store from '@/store'

const socket = io(store.getters.socketUrl)

socket.on('update', data => {
  store.dispatch('addItem', data)
})

export default () => {

}
