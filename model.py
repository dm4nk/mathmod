import matplotlib.pyplot as plt
import numpy as np

def method_runge_kutta(n, h, alpha, b, count):
    k1 = function(n, alpha, b, count)
    k2 = function(n + 0.5 * h * k1, alpha, b, count)
    k3 = function(n + 0.5 * h * k2, alpha, b, count)
    k4 = function(n + h * k3, alpha, b, count)
    return (k1 + 2 * k2 + 2 * k3 + k4) * h / 6


def function(n, alpha, b, count):
    arr = []
    for i in range(count):
        delta = n[i] * alpha[i]
        for j in range(count):
            delta += n[i] * n[j] * b[i, j]
        arr.append(delta)
    return np.asarray(arr)


def calculate(number_of_populations: int,
              step: float,
              duration: int,
              N: [float],
              alpha: [float],
              B: [[float]]):
    print(number_of_populations, step, duration, N, alpha, B)

    time_points = np.arange(0, duration, step)
    n_points = []
    summary_count = np.zeros(len(time_points))
    alpha = np.asarray(alpha)
    N = np.asarray(N)
    B = np.asarray(B)

    for i in range(0, number_of_populations):
        n = []
        for time in time_points:
            n.append(N[i])
            N += method_runge_kutta(N, step, alpha, B, number_of_populations)
        n_points.append(n)

    for i in range(0, number_of_populations):
        summary_count = summary_count + n_points[i]

    graphs = []
    for i in range(0, number_of_populations):
        graphs.append({
            'x': time_points.tolist(),
            'y': n_points[i],
        })

    # print("Calculated", graphs)

    return {
        'customData': {
            'summary_count': summary_count.tolist(),
        },
        'graphs': graphs
    }
