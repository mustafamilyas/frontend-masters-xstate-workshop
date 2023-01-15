import { createMachine, interpret } from 'xstate';

const elApp = document.querySelector('#app');
const elOffButton = document.querySelector('#offButton');
const elOnButton = document.querySelector('#onButton');
const elModeButton = document.querySelector('#modeButton');

const displayMachine = createMachine({
  initial: 'hidden',
  states: {
    hidden: {
      on: {
        TURN_ON: 'visible.hist',
      },
    },
    visible: {
      initial: 'light',
      states: {
        light: {
          on: {
            SWITCH: 'dark'
          }
        },
        dark: {
          on: {
            SWITCH: 'light'
          }
        },
        // if we target this states, it will point to the last state in this level
        hist: {
          type: 'history',
          // type of history, default shallow, shallow only current level deep
          // if set to deep, then can remember the nested state
          history: 'shallow',
          // this is the default state, if the state is empty, so basically overriding initial, if we can hist directly
          target: 'dark'
        }
      },
      on: {
        TURN_OFF: 'hidden',
      },
    },
  },
});

const displayService = interpret(displayMachine)
  .onTransition((state) => {
    elApp.dataset.state = state.toStrings().join(' ');
  })
  .start();

// Add event listeners for:
// - clicking elOnButton (TURN_ON)
// - clicking elOffButton (TURN_OFF)
// - clicking elModeButton (SWITCH)

elOnButton.addEventListener('click', () => {
  displayService.send('TURN_ON');
});

elOffButton.addEventListener('click', () => {
  displayService.send('TURN_OFF');
});

elModeButton.addEventListener('click', () => {
  displayService.send('SWITCH');
});
