import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const assignPoint = assign({
            px: (context, event) => event.clientX,
            py: (context, event) => event.clientY,
}) 

const assignDelta = assign({
            dx: (context, event) => event.clientX - context.px,
            dy: (context, event) => event.clientY - context.py,
})
          
const assignPosition = assign({
            x: (context, event) => context.x + context.dx,
            y: (context, event) => context.y + context.dy,
            dx: 0,
            dy: 0,
            px: 0,
            py: 0
})
          
const resetPoint = assign({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  })

const machine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          // Assign the point
          // ...
          target: 'dragging',
          actions: assignPoint 
        },
        dblclick: {
          actions: resetPoint
        }
      },
    },
    dragging: {
      on: {
        mousemove: {
          // Assign the delta
          // ...
          // (no target!)
          actions: assignDelta
        },
        mouseup: {
          // Assign the position
          target: 'idle',
          actions: assignPosition
        },
        keyup: {
          target: 'idle',
          cond: (context, event) => {
            return event.key === 'Escape'
          },
          actions: resetPoint
        }
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody
elBox.addEventListener('mousedown', (event) => {
  service.send(event)
})

elBody.addEventListener('mousemove', (event) => {
  service.send(event)
})

elBody.addEventListener('mouseup', (event) => {
  service.send(event)
})

elBody.addEventListener('keyup', (event) => {
  service.send(event)
})

elBody.addEventListener('dblclick', (event) => {
  service.send(event)
})
