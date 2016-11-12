import * as options from '../options'
import * as ReduxState from '../redux/ReduxState'

import { createIO } from 'impure'

export function loadInitialOptions () {
  return createIO(({ store }) => {
    store.dispatch({
      type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
      options: options.getAllCurrentOptions()
    })

    // HACK: Dispatch when options change!
    options.events.on('changed', () => {
      store.dispatch({
        type: ReduxState.OPTIONS_LOADED_FROM_STORAGE,
        options: options.getAllCurrentOptions()
      })
    })
  })
}

export function updateOptions (updater) {
  return createIO(({ store }) => {
    const currentOptions = store.getState().options
    const nextOptions = updater(currentOptions)
    const changes = { }
    console.log(nextOptions)
    for (const key of Object.keys(currentOptions)) {
      if (nextOptions[key] !== currentOptions[key]) {
        changes[key] = nextOptions[key]
      }
    }
    console.log(changes)
    return options.setOptions(changes)
  })
}

export function setOptions (changes) {
  return createIO(() => {
    options.setOptions(changes)
  })
}

export function setKeyCode (mode, key, keyCode) {
  return setOptions({ ['input.P1.keyboard.' + mode + '.' + key]: keyCode })
}

export function setMode (mode) {
  return setOptions({ 'player.P1.mode': mode })
}

export function setSpeed (speed) {
  return setOptions({ 'player.P1.speed': speed })
}

export function setLeadTime (leadTime) {
  return setOptions({ 'player.P1.lead-time': leadTime })
}

// LEGACY LAND
export function setLaneCover (laneCover) {
  return setOptions({ 'player.P1.lane-cover': laneCover })
}

export function setScratch (position) {
  if (position === 'off') {
    return setMode('KB')
  } else {
    return setOptions({
      'player.P1.mode': 'BM',
      'player.P1.scratch': position,
    })
  }
}
