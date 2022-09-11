const DATA = transformData(getDataFromBackend());

function transformData(data) {
    console.log(data)
    let slides = data[0].x.length;

    let x_matr = []
    let y_matr = []

    data.forEach(planet => {
        x_matr.push(planet.x);
        y_matr.push(planet.y);
    });

    x_matr = transpose(x_matr);
    y_matr = transpose(y_matr);

    let returnData = {
        slides: slides,
        x: x_matr,
        y: y_matr,
    };

    console.log(returnData);

    return returnData;
}

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function getDataFromBackend() {
    return [
        {
            x: [0, 0, 0, 0],
            y: [0, 0, 0, 0],
        },
        {
            x: [1, 2, 3, 4],
            y: [-1, -2, -3, -4],
        },
        {
            x: [1.5, 1.5, 2.5, 2.5],
            y: [1.5, 1.5, 2.5, 2.5],
        },
    ]
}

Plotly.newPlot('myDiv', {
    data: getData(DATA),
    layout: {
        sliders: [{
            pad: {t: 30},
            x: 0.05,
            len: 0.95,
            currentvalue: {
                xanchor: 'right',
                prefix: 'color: ',
                font: {
                    color: '#888',
                    size: 20
                }
            },
            transition: {duration: 300},
            // By default, animate commands are bound to the most recently animated frame:
            steps: getSteps(DATA)
        }],
        updatemenus: [{
            type: 'buttons',
            showactive: false,
            x: 0.05,
            y: 0,
            xanchor: 'right',
            yanchor: 'top',
            pad: {t: 60, r: 20},
            buttons: [{
                label: 'Play',
                method: 'animate',
                args: [null, {
                    fromcurrent: true,
                    frame: {redraw: false, duration: 300},
                    transition: {duration: 300}
                }]
            }]
        }]
    },
    // The slider itself does not contain any notion of timing, so animating a slider
    // must be accomplished through a sequence of frames. Here we'll change the color
    // and the data of a single trace:
    frames: getFrames(DATA)
});

function getFrames(data) {
    let frames = [];

    for (let i = 0; i < data.slides; i++) {
        frames.push({
            name: i,
            data: [{
                x: data.x[i],
                y: data.y[i]
            }]
        });
    }
    console.log(frames);

    return frames;
}

function getSteps(data) {

    let steps = [];

    for (let i = 0; i < data.slides; i++) {
        steps.push({
            label: i,
            method: 'animate',
            args: [[i], {
                mode: 'immediate',
                frame: {redraw: false, duration: 300},
                transition: {duration: 300},
            }]
        });
    }

    return steps;
}

function getData(data) {
    return [{
        x: data.x[0],
        y: data.y[0],
        mode: 'markers',
        marker: {
            size: 30,
            sizemode: 'area',
            sizeref: 200000
        }
    }]
}

Plotly.newPlot('myDiv2', {
    data: getAllData(DATA),
});

function getAllData(data){
    return [{
        x: data.x.flat(),
        y: data.y.flat(),
        mode: 'markers',
        marker: {
            size: 5,
            sizemode: 'area',
            sizeref: 200000
        }
    }]
}