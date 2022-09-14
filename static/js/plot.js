const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', function (event) {
    const n = parseInt(document.querySelector('#n').value);
    const s = parseInt(document.querySelector('#s').value);
    const d = parseInt(document.querySelector('#d').value);
    const schema = document.querySelector('input[name="radio"]:checked').value;

    const x_array = Array.from(document.querySelectorAll('.__x')).map(input => parseFloat(input.value));
    const y_array = Array.from(document.querySelectorAll('.__y')).map(input => parseFloat(input.value));
    const vx_array = Array.from(document.querySelectorAll('.vx')).map(input => parseFloat(input.value));
    const vy_array = Array.from(document.querySelectorAll('.vy')).map(input => parseFloat(input.value));
    const mass_array = Array.from(document.querySelectorAll('.mass')).map(input => parseFloat(input.value));

    const data = {
        n: n,
        s: s,
        d: d,
        schema: schema,
        x_array: x_array,
        y_array: y_array,
        vx_array: vx_array,
        vy_array: vy_array,
        mass_array: mass_array,
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
            alert("Unexpected Error. Ty again");
        },
        dataType: "json"
    });
});


function buildPlots(data) {
    Plotly.purge('plot1');
    Plotly.plot('plot1', {
        data: getStartTraces(data),
        layout: getLayout(data),
        config: {showSendToCloud: true},
        frames: getFrames(data),
    });

    Plotly.purge('plot2');
    Plotly.plot('plot2', {
        data: getFullTraces(data),
        config: {showSendToCloud: true},
    });
}

function getLayout(data) {
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
            steps: getSteps(data)
        }]
    }
}

function getStartTraces(data) {
    let traces = [];

    for (let i = 0; i < data.graphs.length; i++) {
        traces.push({
            //name: continents[i],
            x: [data.graphs[i].x[0]],
            y: [data.graphs[i].y[0]],
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

    for (let i = 0; i < data.graphs.length; i++) {
        traces.push({
            //name: continents[i],
            x: data.graphs[i].x,
            y: data.graphs[i].y,
            //text: data.text.slice(),
        });
    }

    console.log("traces", traces);
    return traces;
}

function getSteps(data) {
    let steps = [];
    const s = parseInt(document.querySelector('#s').value);

    for (let i = 0; i < data.graphs[0].x.length; i++) {
        let label = "Energy: " + data.customData.energy[i] + "\n" +
            "Current time: " + s * i + "\n" +
            "Mass vx: " + data.customData.mass_vx[i] + "\n" +
            "Mass vy: " + data.customData.mass_vy[i];

        steps.push({
            label: label,
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

    for (let i = 0; i < data.graphs[0].x.length; i++) {
        frames.push({
            name: i,
            data: data.graphs.map(planet => {
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