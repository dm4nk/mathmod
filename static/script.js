var number_of_planets = 2;
var x = [],
  y = [];
var frames = [];
var TIMEOUT = 500;

Plotly.plot('graph', [{
  x: x,
  y: y,
  mode: 'merkers'
}], {
  xaxis: {
    range: [-10, 10]
  },
  yaxis: {
    range: [-10, 10]
  }
}, {
  showSendToCloud: true
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDataFromBackend() {
  x = [
    [1, 2, 3, 4, 5],
    [0, -1, -2, -4, -5]
  ];
  y = [
    [1, -2, -6, 6, 5],
    [-1, 2, 3, -4, -5]
  ];
}

function fillFrames() {
  for (i = 0; i < x.length; ++i) {
    frames.push({
      data: [{
        x: x[i],
        y: y[i]
      }]
    });
  }
  Plotly.addFrames('graph', frames);
}

function draw(i) {
  Plotly.animate('graph', {
    data: [{
      x: x.slice(0, i),
      y: y.slice(0, i),
    }]
  }, {
    transition: {
      duration: TIMEOUT,
    },
    frame: {
      duration: TIMEOUT,
      redraw: false,
    }
  });
}

function anim() {
  Plotly.animate('graph', {
  }, {
    transition: {
      duration: TIMEOUT,
    },
    frame: {
      duration: TIMEOUT,
      redraw: false,
    }
  });
}

function update() {
  for (var i = 0; i <= x.length; i++) {
    //draw(i);
    anim();
    sleep(TIMEOUT);
  }
}

function startAnimation() {
  console.log("Start", x)
  getDataFromBackend();
  fillFrames();
  requestAnimationFrame(update);
  console.log("End")
}