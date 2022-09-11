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

Plotly.plot('plot1', {
    data: getStartTraces(getDataFromBackend()),
    layout: getLayout(),
    config: {showSendToCloud: true},
    frames: getFrames(getDataFromBackend()),
});

Plotly.plot('plot2', {
    data: getFullTraces(getDataFromBackend()),
    config: {showSendToCloud: true},
});

function getLayout() {
    return {
        xaxis: {

        },
        yaxis: {

        },
        hovermode: 'closest',
        // We'll use updatemenus (whose functionality includes menus as
        // well as buttons) to create a play button and a pause button.
        // The play button works by passing `null`, which indicates that
        // Plotly should animate all frames. The pause button works by
        // passing `[null]`, which indicates we'd like to interrupt any
        // currently running animations with a new list of frames. Here
        // The new list of frames is empty, so it halts the animation.
        updatemenus: [{
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: {t: 87, r: 10},
            buttons: [{
                method: 'animate',
                args: [null, {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: {duration: 300},
                    frame: {duration: 500, redraw: false}
                }],
                label: 'Play'
            }, {
                method: 'animate',
                args: [[null], {
                    mode: 'immediate',
                    transition: {duration: 0},
                    frame: {duration: 0, redraw: false}
                }],
                label: 'Pause'
            }]
        }],
        // Finally, add the slider and use `pad` to position it
        // nicely next to the buttons.
        sliders: [{
            pad: {l: 130, t: 55},
            currentvalue: {
                visible: true,
                //prefix: 'Year:',
                xanchor: 'right',
                font: {size: 20, color: '#666'}
            },
            steps: getSteps(getDataFromBackend())
        }]
    }
}

function getStartTraces(data) {
    let traces = [];

    for (let i = 0; i < data.length; i++) {
        traces.push({
            //name: continents[i],
            x: [data[i].x[0]],
            y: [data[i].y[0]],
            //text: data.text.slice(),
            mode: 'markers',
            marker: {
                //size: data.marker.size.slice(),
                size: 15,
                sizemode: 'area',
                sizeref: 200000
            }
        });
    }

    console.log("traces", traces);
    return traces;
}

function getFullTraces(data) {
    let traces = [];

    for (let i = 0; i < data.length; i++) {
        traces.push({
            //name: continents[i],
            x: data[i].x,
            y: data[i].y,
            //text: data.text.slice(),
        });
    }

    console.log("traces", traces);
    return traces;
}

function getSteps(data) {
    let steps = [];

    for (let i = 0; i < data[0].x.length; i++) {
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

    console.log("steps", steps);
    return steps;
}

function getFrames(data) {
    let frames = [];

    for (let i = 0; i < data[0].x.length; i++) {
        frames.push({
            name: i,
            data: data.map(planet => {
                return {
                    x: [planet.x[i]],
                    y: [planet.y[i]]
                    // x: planet.x.slice(0, i),
                    // y: planet.y.slice(0, i)
                }
            })
        });
    }

    console.log("frames", frames);
    return frames;
}