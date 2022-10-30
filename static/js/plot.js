const submitBtn = document.querySelector('.submit-btn');
const switchBtn = document.getElementById('switch-plot');

function getIntById(id) {
    return parseInt(document.getElementById(id)?.value);
}

function getFloatById(id) {
    return parseFloat(document.getElementById(id)?.value);
}

submitBtn.addEventListener('click', async function (event) {
    const n = getFloatById('n');
    const s = getFloatById('s');
    const d = getIntById('d');

    let N = [];
    let alpha = [];
    let B = [];

    for (let row = 0; row < n; ++row) {
        N.push(getFloatById('input_quantity' + row));
        alpha.push(getFloatById('input_alpha' + row));
    }

    for (let row = 0; row < n; ++row) {
        let B_row = []
        for (let col = 0; col < n; ++col) {
            B_row.push(getFloatById('input_matrix' + row + col));
        }
        B.push(B_row)
    }


    const data = {
        number_of_populations: n,
        step: s,
        duration: d,
        N: N,
        alpha: alpha,
        B: B,
    };

    console.log("data", data);
    event.preventDefault();

    console.log("START");
    $.ajax({
        type: "POST",
        url: "/draw_plots",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (result) {
            console.log(result);
            buildPlots(result);
            console.log("REFRESHED");
        },
        error: function (result, status) {
            console.log(result);
            alert("Unexpected Error. Try again");
        },
        dataType: "json"
    });
});


function buildPlots(data) {
    const togglePlot = document.querySelector('#switch-plot').checked;

    Plotly.purge('plot1');
    if (!togglePlot) {
        Promise.all([getStartTraces(data), getLayout(data), getFrames(data)])
            .then(([startTraces, layout, frames]) => {
                console.log('AAAAAAAAAA')
                Plotly.newPlot('plot1', {
                    data: startTraces,
                    layout: layout,
                    config: {showSendToCloud: true},
                    frames: frames,
                });
            })
    }

    Plotly.purge('plot2');
    getFullTraces(data).then(res => {
        Plotly.newPlot('plot2', {
            data: res,
            config: {showSendToCloud: true},
        });
        console.log("Got plot2");
    })
}

async function getLayout(data) {
    return {
        xaxis: {},
        yaxis: {},
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
                    transition: {duration: 1},
                    frame: {duration: 1, redraw: false}
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
            steps: await getSteps(data)
        }]
    }
}

async function getStartTraces(data) {
    let traces = [];

    for (let i = 0; i < data.graphs.length; i++) {
        traces.push({
            x: [data.graphs[i].x[0]],
            y: [data.graphs[i].y[0]],
            // mode: 'markers',
            // marker: {
            //     //size: data.marker.size.slice(),
            //     size: 15,
            //     sizemode: 'area',
            //     sizeref: 200000
            // }
        });
    }

    console.log("traces", traces);
    return traces;
}

async function getFullTraces(data) {
    let traces = [];

    for (let i = 0; i < data.graphs.length; i++) {
        traces.push({
            x: data.graphs[i].x,
            y: data.graphs[i].y,
        });
    }

    console.log("traces", traces);
    return traces;
}

async function getSteps(data) {
    let steps = [];
    const s = getFloatById('s');

    for (let i = 0; i < data.graphs[0].x.length; i++) {
        let label = "Summary: " + data.customData.summary_count[i].toFixed(2) + "\n" +
            "Current time: " + (s * i).toFixed(1);

        steps.push({
            label: label,
            method: 'animate',
            args: [[i], {
                mode: 'immediate',
                frame: {redraw: false, duration: 1},
                transition: {duration: 1},
            }]
        });
    }

    console.log("steps", steps);
    return steps;
}

async function getFrames(data) {
    let frames = [];

    for (let i = 0; i < data.graphs[0].x.length; ++i) {
        frames.push({
            name: i,
            data: data.graphs.map(planet => {
                return {
                    // x: [planet.x[i]],
                    // y: [planet.y[i]],
                    x: planet.x.slice(0, i),
                    y: planet.y.slice(0, i),
                }
            })
        });
    }

    console.log("frames", frames);
    return frames;
}