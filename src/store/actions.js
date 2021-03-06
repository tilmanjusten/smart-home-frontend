import axios from 'axios'

export default {
  addItem ({ commit }, item) {
    item.date = new Date(item.date)

    commit('addItem', item)
  },
  populate ({ dispatch, getters }) {
    axios.get(`${getters.weatherApiBaseUrl}/api/v1/items`)
      .then(data => {
        dispatch('populateItems', data.data)
      })
      .catch(err => console.error(err))

    axios.get(`${getters.weatherApiBaseUrl}/api/v1/devices`)
      .then(data => {
        dispatch('populateDevices', data.data)
      })
      .catch(err => console.error(err))
  },
  // trigger state change only once on app start
  // addItem does trigger state change for every addition
  populateItems ({ commit }, data) {
    if (data && data.length) {
      let items = data.map(item => {
        item.date = new Date(item.date)

        return item
      })

      commit('populateItems', items)
    }
  },
  populateDevices ({ commit }, data) {
    if (data && data.length) {
      data.map(device => commit('addDevice', device))
    }
  },
  updateLightsStateFromApi ({ commit, getters }) {
    let requests = []

    getters.lights.forEach((light, lightIndex) => {
      const request = axios.get(`${getters.lightsApiBaseUrl}/state/${light.name_id}`)
        .then(res => {
          if (res.data.hasOwnProperty('state')) {
            commit('setLightState', { id: lightIndex, state: res.data.state })
          }
        })

      requests.push(request)
    })

    Promise.all(requests).then(() => {
      commit('lastUpdatedLightsStateFromApi', true)
    })
  },
  switchLight ({ commit, getters }, data) {
    let action = `${getters.lightsApiBaseUrl}/switch/${data.name_id}/${data.state}`

    axios.get(action)
      .then(res => {
        if (res.data.hasOwnProperty('state')) {
          commit('setLightState', { id: getters.lightIndexByNameId(data.name_id), state: res.data.state })
        }
      })
      .catch(err => console.error(err))
  }
}
