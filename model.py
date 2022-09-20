import matplotlib.pyplot as plt

gravity = 6.67 / (10 ** 11)


class Planet:
    def __init__(self, x, y, vx, vy, m):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.m = m
        self.ax = 0.0
        self.ay = 0.0
        self.ax_array = []
        self.ay_array = []
        self.x_array = [x]
        self.y_array = [y]


def init(n: int, x_array: [float], y_array: [float], vx_array: [float], vy_array: [float],
         mass_array: [float]) -> [Planet]:
    """Инициализация планет по начальным значениям"""
    list_planets = []
    for i in range(0, n):
        list_planets.append(Planet(x_array[i], y_array[i], vx_array[i], vy_array[i], mass_array[i]))
    return list_planets


def calculate_a(planets: [Planet], delta_x: [float] = [], delta_y: [float] = []):
    """Вычисление ускорения каждой планеты"""
    for planet in planets:
        planet.ax = 0.0
        planet.ay = 0.0

    # есть сдвиг по координате
    if len(delta_x):
        for planet, x, y in zip(planets, delta_x, delta_y):
            planet.x += x
            planet.y += y

    for first_planet in planets:
        for second_planet in planets:
            if first_planet == second_planet:
                continue
            dx = second_planet.x - first_planet.x
            dy = second_planet.y - first_planet.y
            r_2 = 1.0 / ((dx * dx + dy * dy) ** 0.5)
            fabs = gravity * second_planet.m * r_2 ** 3
            first_planet.ax += fabs * dx
            first_planet.ay += fabs * dy

    # убираем сдвиг
    if len(delta_x):
        for planet, x, y in zip(planets, delta_x, delta_y):
            planet.x -= x
            planet.y -= y


def calculate_a_to_runge(planets: [Planet], dt: int):
    """Вычисление ускорений каждой планеты"""

    delta_x = []
    delta_y = []

    for planet in planets:
        planet.ax_array = []
        planet.ay_array = []

    for step in range(0, 4):
        calculate_a(planets, delta_x, delta_y)
        delta_x = []
        delta_y = []

        for planet in planets:
            planet.ax_array.append(planet.ax)
            planet.ay_array.append(planet.ay)
            delta_x.append(planet.ax * dt / 2)
            delta_y.append(planet.ay * dt / 2)


    calculate_a(planets)


def calculate_by_euler(planets: [Planet],
                       dt: int,
                       d: int):
    """ Пересчет координат каждой планеты по методу Эйлера"""
    for t in range(0, d, dt):
        calculate_a(planets)
        for planet in planets:
            planet.x += planet.vx * dt
            planet.y += planet.vy * dt
            planet.y_array.append(planet.y)
            planet.x_array.append(planet.x)
            planet.vx += planet.ax * dt
            planet.vy += planet.ay * dt


def calculate_by_runge(planets: [Planet],
                       dt: int,
                       d: int):
    """ Пересчет координат каждой планеты по методу Рунге_Кутты"""
    for t in range(0, d, dt):
        calculate_a_to_runge(planets, dt)
        for planet in planets:
            planet.x += planet.vx * dt + dt * dt * (planet.ax_array[0] + planet.ax_array[1] + planet.ax_array[2]) / 6
            planet.y += planet.vy * dt + dt * dt * (planet.ay_array[0] + planet.ay_array[1] + planet.ay_array[2]) / 6
            planet.y_array.append(planet.y)
            planet.x_array.append(planet.x)
            planet.vx += (planet.ax_array[0] + 2 * planet.ax_array[1] + 2 * planet.ax_array[2] + planet.ax_array[
                3]) * dt / 6
            planet.vy += (planet.ay_array[0] + 2 * planet.ay_array[1] + 2 * planet.ay_array[2] + planet.ay_array[
                3]) * dt / 6


if __name__ == '__main__':
    # T = 86400.0
    # dt = 3600.0
    # n = 3
    # schema = 'Eiler'
    x_array = [0.0, 149500000000.0, 299000000000.0]
    # x_array = [0.0, 149500000000.0]
    y_array = [0.0, 0.0, 0.0]
    # y_array = [0.0, 0.0]
    vx_array = [0.0, 0.0, 0.0]
    # vx_array = [0.0, 0.0]
    vy_array = [0.0, 23297.87, 16474.08]
    # vy_array = [0.0, 23297.87]
    mass_array = [1.2166E30, 6.083E24, 1.2166E25]
    # mass_array = [1.2166E30, 6.083E24]

    planets = init(3, x_array, y_array, vx_array, vy_array, mass_array)
    # calculate_by_euler(planets, 3600, 31536000)
    calculate_by_runge(planets, 3600, 31536000)
    plt.plot(planets[0].x_array, planets[0].y_array)
    plt.plot(planets[1].x_array, planets[1].y_array)
    plt.plot(planets[2].x_array, planets[2].y_array)
    plt.show()
