from flask import Flask, render_template, request

from logic import calculate

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/draw_plots', methods=['POST'])
def draw_plots():
    print("got a request")
    request_data = request.get_json()
    print(request_data)

    return calculate(int(request_data['n']),
                     int(request_data['s']),
                     int(request_data['d']),
                     request_data['schema'],
                     request_data['x_array'],
                     request_data['y_array'],
                     request_data['vx_array'],
                     request_data['vy_array'],
                     request_data['mass_array'],)


if __name__ == '__main__':
    app.run(debug=True)
