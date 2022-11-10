import random
import math

import numpy as np
import matplotlib.pyplot as plt


def get_amount_of_busy_line(matrix: np.ndarray):
    """
    Функция, возвращающая количество загруженных линий
    :param matrix: матрица распределения вызовов по линиям
    :return: количество загруженных линий
    """
    free_lines = 0
    for i in range(matrix.shape[0]):
        if np.all(matrix[i][:] == 0):
            free_lines += 1
    return matrix.shape[0] - free_lines


def get_workload_of_lines(matrix: np.ndarray):
    """
    Функция, возвращающая количество загруженных линий в конкретный момент времени
    :param matrix: матрица распределения вызовов по линиям
    :return: workload: массив, элементы которого - количество загруженных линий в момент времени
    """
    workload = []
    for j in range(matrix.shape[1]):
        t = 0
        for i in range(matrix.shape[0]):
            if matrix[i][j] != 0:
                t += 1
        workload.append(t)
    return workload


def distribution(time: int, n: int, t_array: [float], d_array: [float], c: int):
    """
    Функция, распределяющая каждый поступающий вызов из t_array по линиям. Первый вызов всегда будет принят первой
    линией, каждый следующий будет искать сначала полностью свободную линию для всей длительности вызова, если такой
    линии нет, будет искать не полностью нагруженную линию. Если все линии загружены в момент вызова или на протяжении
    вызова, то он отклоняется.
    :param time: время моделирования
    :param n: количество линий, > 0!
    :param t_array: массив моментов времени начала вызова
    :param d_array: массив длительностей вызовов
    :param c: емкость накомителя (сколько заявок может рассмотреть линия одновременно) > 0!
    :return: matrix: n * (количество точек дискретизации по времени) и rejection: количество отклоненных вызовов
    """
    if n > 0 and len(t_array) > 1:
        rejection = 0
        amount = math.ceil(time / 0.1)
        matrix = np.zeros((n, amount), dtype=float)  # строки - линии, столбцы - время
        for i in range(len(t_array)):
            end = t_array[i] + d_array[i]  # время окончания
            start_index = int(t_array[i] / 0.1)  # индекс, соответсвующий времени начала
            end_index = int(end / 0.1)  # индекс, соответсвующий времени окончания
            if end > time:
                end_index = amount - 1

            if i == 0:  # для первого события
                for j in range(start_index, end_index + 1):
                    matrix[0][j] += 1
            else:
                idx = []  # все индексы события
                for j in range(start_index, end_index + 1):
                    idx.append(j)
                flag = False
                for line in range(0, n):  # сначала находим полностью свободную линию
                    if np.any(matrix[line][idx] != 0):
                        continue
                    else:
                        matrix[line][idx] += 1
                        flag = True
                        break
                if not flag:  # ищем среди частично занятых
                    for line in range(0, n):
                        if np.all(matrix[line][idx] < c):
                            matrix[line][idx] += 1
                            flag = True
                            break
                if not flag:
                    rejection += 1
        return matrix, rejection


def calculate(time: float, n: int, alpha: float, betta: float, c: int):
    """
    Функция, рассчитывающая все необходимые значения
    :param time: время моделирования
    :param n: количество линий, > 0!
    :param alpha: показатель для времени
    :param betta: показатель для длительности
    :param c: емкость накомителя (сколько заявок может рассмотреть линия одновременно) > 0!
    :return: graphs: m[i] - точки для графика по оси Y
                     time_points - точки для графика по оси X
                     num - общее число вызовов
                     r - количество отклоненных вызоовов
                     efficiency - эффективность системы
                     busy_lines - количество занятых линий
                     workload - количество загруженных линий в момент времени
    """

    t = 0.0
    t_array, d_array = [], []

    while True:
        z = random.expovariate(alpha) / 3
        t += z
        if t > time:
            break
        t_array.append(t)  # массив моментов
        d_array.append(random.expovariate(betta))  # массив длительностей

    m, r = distribution(time, n, t_array, d_array, c)
    num = len(t_array)
    efficiency = r / num
    busy_lines = get_amount_of_busy_line(m)
    workload = get_workload_of_lines(m)

    amount = math.ceil(time / 0.1)
    time_points = np.linspace(0, time, num=amount)

    graphs = []
    for i in range(0, m.shape[0]):
        m_masked = np.ma.masked_where(m[i] == 0, m[i])

        x, y, = [], []
        for _t, _m in zip(time_points, m_masked):
            x.append(_t)
            y.append(_m * (i + 1) if _m else 0)

        graphs.append({
            'x': x,
            'y': y,
        })

    return {
        'customData': {
            'number_of_calls': num,
            'cancelled_calls': r,
            'efficiency': efficiency,
            'busy_lines': busy_lines,
            'workload': workload,
        },
        'graphs': graphs
    }


if __name__ == '__main__':
    calculate(100, 3, 0.1, 0.1, 2)
