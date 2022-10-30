from flask import Flask, render_template, request

from model import calculate

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/draw_plots', methods=['POST'])
def draw_plots():
    print("got a request")
    request_data = request.get_json()
    print(request_data)

    return calculate(
        number_of_populations=int(request_data['number_of_populations']),
        step=float(request_data['step']),
        duration=int(request_data['duration']),
        N=[float(num) for num in request_data['N']],
        alpha=[float(num) for num in request_data['alpha']],
        B=request_data['B'],
    )


if __name__ == '__main__':
    app.run(debug=True)
