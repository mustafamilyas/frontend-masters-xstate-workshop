import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignPosition = assign({
  x: (context, event) => {
    return context.x + context.dx;
  },
  y: (context, event) => {
    return context.y + context.dy;
  },
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
  dy: (context, event) => {
    return event.clientY - context.py;
  },
});

const assignDeltaHorizontal = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
  dy: 0
});

const assignDeltaVertical = assign({
  dy: (context, event) => {
    return event.clientY - context.py;
  },
  dx: 0
});

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const isHorizontalChange = (context, event) => {
  const _dx = Math.abs(event.clientX - context.px);
  const _dy = Math.abs(event.clientY - context.py);
  return _dx > _dy;
}

const dragDropMachine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
    locked: false,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: assignPoint,
          target: 'dragging',
        },
      },
    },
    dragging: {
      initial: 'unlocked', 
      states: {
        unlocked: {
          on: {
            'keydown.shift': {
              target: 'locked',
              actions: assign({locked: true})
            }
          }
        },
        locked: {
          on: {
            'keyup.shift': {
              target: 'unlocked',
              actions: assign({locked: true})
            },
            mousemove: [
              {
                cond: isHorizontalChange,
                actions: assignDeltaHorizontal
              }, {
                actions: assignDeltaVertical
              }
            ]
          }
        },
      },
      on: {
        mousemove: {
          actions: assignDelta,
          internal: false,
        },
        mouseup: {
          actions: [assignPosition],
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: resetPosition,
        },
      },
    },
  },
});

const service = interpret(dragDropMachine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(' ');

  if (state.changed) {
    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();

elBox.addEventListener('mousedown', (event) => {
  service.send(event);
});

elBody.addEventListener('mousemove', (event) => {
  service.send(event);
});

elBody.addEventListener('mouseup', (event) => {
  service.send(event);
});

elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    service.send('keyup.escape');
  }
  if (e.key === 'Shift') {
    service.send('keyup.shift')
  }
});

elBody.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    service.send('keydown.shift')
  }
})
