import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

const machine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
    drags: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          cond: 'availableDrags',
          actions: 'assignPoint',
          target: 'dragging',
        },
      },
    },
    dragging: {
      entry: 'incrementDrags',
      on: {
        mousemove: {
          actions: 'assignDelta',
        },
        mouseup: {
          actions: 'assignPosition',
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: 'resetPosition',
        },
      },
    },
  },
}, {
  actions: {
    assignPoint : assign({
      px: (context, event) => event.clientX,
      py: (context, event) => event.clientY,
    }),

    assignPosition : assign({
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
    }),

    assignDelta : assign({
      dx: (context, event) => {
        return event.clientX - context.px;
      },
      dy: (context, event) => {
        return event.clientY - context.py;
      },
    }),

    resetPosition : assign({
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
      drags: (context) => context.drags - 1
    }),

    incrementDrags : assign({ drags: (context) => context.drags + 1 }),
  },
  guards: {
    availableDrags: (context) => context.drags < 5
  }
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;
    elBox.dataset.drags = state.context.drags;

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
});
