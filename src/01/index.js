const elBox = document.querySelector('#box');


function stateMachine() {
  const machine = {
    initial: 'active',
    states: {
      active: {
        on: {
          toggle: 'inactive'
        }
      },
      inactive: {
        on: {
          toggle: 'active'
        }
      },
    }
  }
  let currentState = machine.initial;
  // Pure function that returns the next state,
  // given the current state and sent event
  function transition(state, event) {
    return machine?.states[state]?.on[event] || state
  }
  
  // Keep track of your current state
  function send(event) {
    console.log('send')
    // Determine the next value of `currentState`
    currentState = transition(currentState, event)
    elBox.dataset.state = currentState;
  }

  return {
    send
  }
}

const appMachine = stateMachine();

elBox.addEventListener('click', () => {
  // send a click event
  appMachine.send('toggle')
});
