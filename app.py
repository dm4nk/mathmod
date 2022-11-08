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
        time=float(request_data['duration']),
        n=int(request_data['number_of_lines']),
        betta=float(request_data['power_for_duration']),
        alpha=float(request_data['power_for_time']),
        c=int(request_data['collectors_capacity']),
    )


if __name__ == '__main__':
    app.run(debug=True)
