function buildMatrix(number) {
    let innerHtmlString = ``;
    // introduce div
    innerHtmlString += `<div class="parameters">`;

    //introduce table
    innerHtmlString += `<table>`;

    // make table header
    innerHtmlString += `<tr>`;
    innerHtmlString += `<th></th>`;
    for (let row = 0; row < number; row++) {
        innerHtmlString += `<th>${row}</th>`
    }
    innerHtmlString += `<tr>`;

    // introduce table body
    innerHtmlString += `<tbody>`;

    for (let row = 0; row < number; row++) {
        innerHtmlString += `<tr>`;
        innerHtmlString += `<th>${row}</th>`
        for (let col = 0; col < number; col++) {
            let value;
            if (col === row)
                value = 0;
            else if (row < col)
                value = -0.0001;
            else
                value = 0.0001;

            innerHtmlString += `<td>
                <div class="input-control">
                   <input 
                   id="input_matrix${row}${col}" 
                   type="number" 
                   value="${value}" 
                   step="0.000001" 
                   required 
                   style="text-align: center; min-width: 100px">
                </div>
            </td>`
        }
        innerHtmlString += `</tr>`;
    }

    innerHtmlString += `</tbody>`;
    innerHtmlString += `</table>`;
    innerHtmlString += `</div>`;

    return innerHtmlString;
}

function buildTable(number) {
    let innerHtmlString = ``;

    // introduce div
    innerHtmlString += `<div class="parameters">`;

    //introduce table
    innerHtmlString += `<table>`;

    //introducing header
    innerHtmlString += `<tr>`;
    innerHtmlString += `<th>${number}</th>`;
    innerHtmlString += `<th>QUANTITY</th>`;
    innerHtmlString += `<th>ALPHA</th>`;
    innerHtmlString += `<tr>`;

    // introduce table body
    innerHtmlString += `<tbody>`;

    for (let row = 0; row < number; row++) {
        innerHtmlString += `<tr>`;
        innerHtmlString += `<th>${row}</th>`

        let quantity = 100 * (row + 1);
        let alpha = -0.01;
        if (row === 0)
            alpha = 0.01;

        innerHtmlString += `<td>
                <div class="input-control">
                   <input 
                   id="input_quantity${row}" 
                   type="number" 
                   value="${quantity}" 
                   step="0.000001" 
                   required 
                   onkeypress="return charCode!==45"
                   style="text-align: center">
                </div>
        </td>`
        innerHtmlString += `<td>
                  <div class="input-control">
                   <input 
                   id="input_alpha${row}" 
                   type="number" 
                   value="${alpha}" 
                   step="0.000001" 
                   required 
                   style="text-align: center">
                </div>
        </td>`
        innerHtmlString += `<tr>`;
    }

    innerHtmlString += `</tbody>`;
    innerHtmlString += `</table>`;
    innerHtmlString += `</div>`;

    return innerHtmlString;
}

function onValueChanged() {
    const number = parseInt(document.querySelector('#n').value);
    if (number > 20) {
        alert("too much...");
        return;
    }

    document.getElementById('planet-container').innerHTML = buildMatrix(number) + buildTable(number);
}