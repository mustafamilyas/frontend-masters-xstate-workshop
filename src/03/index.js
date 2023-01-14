import { createMachine, interpret } from 'xstate';

const elBox = document.querySelector('#box');

const machine = createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        mousedown: {
          target: 'active',
        },
      },
    },
    active: {
      on: {
        mouseup: {
          target: 'inactive',
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  console.log('transition 1',state);

  elBox.dataset.state = state.value;
});

service.onTransition((state) => {
  console.log('transition 2', state);

});

service.onTransition((state) => {
  console.log('transition 3',state);

});

service.start();

elBox.addEventListener('mousedown', (event) => {
  // service.send({ type: 'mousedown', ... })
  service.send(event);
});

elBox.addEventListener('mouseup', (event) => {
  // service.send({ type: 'mousedown', ... })
  service.send(event);
});
