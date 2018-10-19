import axios from 'axios'

const apiBaseUrl = process.env.NODE_ENV === 'production' ? 'http://raspi:3000' : 'http://localhost:3000'
const lightsApiBaseUrl = 'http://lichter.fritz.box'

export default {
  addItem ({ commit }, item) {
    commit('addItem', item)
    commit('setLatestItem', item.origin)
  },
  populate ({ commit }) {
    axios.get(`${apiBaseUrl}/api/v1/items`)
      .then(data => {
        commit('populateItems', data.data)
      })
      .catch(err => console.error(err))

    axios.get(`${apiBaseUrl}/api/v1/devices`)
      .then(data => {
        commit('populateDevices', data.data)
      })
      .catch(err => console.error(err))
  },
  pupulateLatest ({ commit, state }) {
    let latestItems = state.items.slice(-1)

    if (!latestItems.length) {
      return
    }

    let latest = latestItems[0]

    latest.data.forEach(item => {
      if (!item) {
        return
      }

      commit('setLatestItem', item)
    })
  },
  setLatestItem ({ commit }, item) {
    commit('setLatestItem', item.origin)
  },
  updateLightsStateFromApi ({ commit, getters }) {
    let requests = []

    getters.lights.forEach((light, lightIndex) => {
      const request = axios.get(`${lightsApiBaseUrl}/state/${light.name_id}`)
        .then(data => {
          commit('setLightState', { id: lightIndex, state: data.data.state })
        })

      requests.push(request)
    })

    Promise.all(requests).then(() => {
      commit('lastUpdatedLightsStateFromApi', true)
    })
  }
}
