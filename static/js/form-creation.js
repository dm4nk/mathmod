function createForm() {
    const number = parseInt(document.querySelector('#n').value);
    if(number> 20){
        alert("too much...");
        return;
    }

    const form = document.getElementById('planet-container');

    console.log("number", number);
    form.innerHTML = `<p>Planet Parameters</p>`;

    for (let i = 0; i < number; i++) {
        form.innerHTML += `
    <div class="parameters">
                <div class="input-control">
                    <label>Name
                        <input class="name" type="text" value="Uranus" step="1" required>
                    </label>
                </div>

                <div class="input-control">
                    <label>X
                        <input class="__x" type="number" value="0" step="0.000001" required onkeypress="return charCode!==45">
                    </label>
                </div>

                <div class="input-control">
                    <label>Y
                        <input class="__y" type="number" value="0" step="0.000001" required onkeypress="return charCode!==45">
                    </label>
                </div>

                <div class="input-control">
                    <label>Vx
                        <input class="vx" type="number" value="0" step="0.000001" required onkeypress="return charCode!==45">
                    </label>
                </div>

                <div class="input-control">
                    <label>Vy
                        <input class="vy" type="number" value="0" step="0.000001" required onkeypress="return charCode!==45">
                    </label>
                </div>

                <div class="input-control">
                    <label>Mass
                        <input class="mass" type="text" value="6,083E24" required onkeypress="return charCode!==45">
                    </label>
                </div>
            </div>
    `;
    }
}