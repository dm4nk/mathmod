const submitBtn = document.querySelector('.submit-btn');
const switchBtn = document.getElementById('switch-plot');

function getIntById(id) {
    return parseInt(document.getElementById(id)?.value);
}

function getFloatById(id) {
    return parseFloat(document.getElementById(id)?.value);
}

submitBtn.addEventListener('click', async function (event) {
    const duration = getFloatById('duration');
    const number_of_lines = getIntById('number-of-lines');
    const power_for_duration = getFloatById('power-for-duration');
    const power_for_time = getFloatById('power-for-time');
    const collectors_capacity = getIntById('collectors-capacity');

    const data = {
        'duration': duration,
        'number_of_lines': number_of_lines,
        'power_for_duration': power_for_duration,
        'power_for_time': power_for_time,
        'collectors_capacity': collectors_capacity,
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

    if (!togglePlot) {
        Promise.all([getStartTraces(data), getLayout(data), getFrames(data)]).then(buildFirstPlot);
    }

    // getFullTraces(data).then(buildSecondPlot);
}

async function buildFirstPlot([startTraces, layout, frames]) {
    console.log('started 1 plot');
    Plotly.react('plot1', {
        data: startTraces,
        layout: layout,
        config: {showSendToCloud: true},
        frames: frames,
    }).then(() => console.log('finished 1 plot'));

}

async function buildSecondPlot(res) {
    console.log('started 2 plot');
    Plotly.react('plot2', {
        data: res,
        config: {showSendToCloud: true},
    }).then(() => console.log('finished 2 plot'));
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
            mode: 'markers',
            marker: {
                size: 15,
                sizemode: 'area',
                sizeref: 200000
            }
        });
    }

    console.log("traces finished");
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
    console.log("full traces finished");
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

    console.log("steps finished");
    return steps;
}

async function getFrames(data) {
    let frames = [];

    for (let i = 0; i < data.graphs[0].x.length; ++i) {
        frames.push({
            name: i,
            data: data.graphs.map(planet => {
                return {
                    x: planet.x.slice(0, i),
                    y: planet.y.slice(0, i),
                    mode: 'markers',
                    marker: {
                        size: 15,
                        sizemode: 'area',
                        sizeref: 200000
                    }
                }
            })
        });
    }

    console.log("frames finished");
    return frames;
}