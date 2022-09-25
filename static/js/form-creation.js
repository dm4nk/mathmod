G = 6.6743 * 10 ** -11;


INNER_HTML = `
    <div class="parameters">
                <div class="input-control">
                    <label>Name
                        <input class="name" type="text" value="OAOAOA" step="1" required>
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
                        <input class="mass" type="text" value="0" required onkeypress="return charCode!==45">
                    </label>
                </div>
            </div>
    `;


function onValueChanged() {
    const number = parseInt(document.querySelector('#n').value);
    if (number > 20) {
        alert("too much...");
        return;
    }
    const number_old = document.querySelectorAll('.__x').length;
    const form = document.getElementById('planet-container');

    if (number > number_old) {
        for (let i = number_old; i < number; i++) {
            const element = document.createElement('div');
            element.innerHTML = INNER_HTML;
            form.appendChild(element);
        }

        const sun_x = 0;
        const sun_vy = 0;
        const sun_mass = 1.2166e30;

        const init_x = 149_500_000_000;
        const init_vy = 23297;
        const init_mass = 6.083e24;

        const values_x = [sun_x];
        const values_vy = [sun_vy];
        const values_mass = [sun_mass];

        for (let i = 0; i < number - 1; i++) {
            const x = (init_x * 2 ** i).toFixed(6);
            const vy = Math.sqrt(G * sun_mass / x).toFixed(6);
            const mass = (init_mass * 2 ** i).toFixed(6);

            values_x.push(x);
            values_vy.push(vy);
            values_mass.push(mass);
        }

        for (let i = number_old; i < number; i++) {
            const x_value = document.querySelectorAll('.__x')[i].value;
            document.querySelectorAll('.__x')[i].value = x_value === '0' ? values_x[i] : x_value;
            const vy_value = document.querySelectorAll('.vy')[i].value;
            document.querySelectorAll('.vy')[i].value = vy_value === '0' ? values_vy[i] : vy_value;
            const mass_value = document.querySelectorAll('.mass')[i].value;
            document.querySelectorAll('.mass')[i].value = mass_value === '0' ? values_mass[i] : mass_value;
        }
    } else {
        for (let i = number; i < number_old; i++) {
            document.getElementsByClassName('parameters')[number].remove();
        }
    }
}