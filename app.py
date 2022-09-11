from flask import Flask, render_template, request

from logic import calculate

app = Flask(__name__)


@app.route('/')
def index():  # put application's code here
    return render_template('index.html')


@app.route('/draw_plots', methods=['POST', 'GET'])
def draw_plots():
    return calculate(int(request.args.get('n')),
                     int(request.args.get('s')),
                     int(request.args.get('d')),
                     str(request.args.get('schema')),
                     request.args.get('x_array'),
                     request.args.get('y_array'),
                     request.args.get('vx_array'),
                     request.args.get('vy_array'),
                     request.args.get('mass_array'),)


if __name__ == '__main__':
    app.run(debug=True)
