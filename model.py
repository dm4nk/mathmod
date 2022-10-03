import numpy as np

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

    if len(delta_x):
        for planet, x, y in zip(planets, delta_x, delta_y):
            planet.x -= x
            planet.y -= y


def calculate_a_to_runge(planets: [Planet], dt: int):
    """Вычисление ускорений каждой планеты"""

    delta_x = []
    delta_y = []
    planets_ax = []
    planets_ay = []
    for step in range(0, 4):
        calculate_a(planets, delta_x, delta_y)
        delta_x = []
        delta_y = []
        ax_array = []
        ay_array = []
        for planet in planets:
            ax_array.append(planet.ax)
            ay_array.append(planet.ay)

            if step == 3:
                delta_x.append(planet.ax * dt)
                delta_y.append(planet.ay * dt)
            else:
                delta_x.append(planet.ax * dt / 2)
                delta_y.append(planet.ay * dt / 2)

        planets_ax.append(ax_array)
        planets_ay.append(ay_array)
    # calculate_a(planets)
    planets_ax = np.transpose(planets_ax)
    planets_ay = np.transpose(planets_ay)
    return planets_ax, planets_ay


def calculate_energy_and_mass(planets):
    e = 0.0
    m = m_x = m_y = 0
    """Вычисление общей энергии системы и координат центра масс"""
    for first_planet in planets:
        m += first_planet.m
        m_x += first_planet.m * first_planet.x
        m_y += first_planet.m * first_planet.y
        for second_planet in planets:
            if first_planet == second_planet:
                continue
            dx = second_planet.x - first_planet.x
            dy = second_planet.y - first_planet.y
            r_2 = 1.0 / ((dx * dx + dy * dy) ** 0.5)
            e += first_planet.m * second_planet.m * r_2
    e = - e * gravity / 2
    m_vx = m_x / m
    m_vy = m_y / m
    return e, m_vx, m_vy


def calculate_by_euler(planets: [Planet],
                       dt: int,
                       d: int):
    """ Пересчет координат каждой планеты по методу Эйлера"""
    energy = []
    mass_vx = []
    mass_vy = []
    e, m_vx, m_vy = calculate_energy_and_mass(planets)
    energy.append(e)
    mass_vx.append(m_vx)
    mass_vy.append(m_vy)
    for t in range(0, d, dt):
        calculate_a(planets)
        for planet in planets:
            planet.x += planet.vx * dt
            planet.y += planet.vy * dt
            planet.y_array.append(planet.y)
            planet.x_array.append(planet.x)
            planet.vx += planet.ax * dt
            planet.vy += planet.ay * dt
        e, m_vx, m_vy = calculate_energy_and_mass(planets)
        energy.append(e)
        mass_vx.append(m_vx)
        mass_vy.append(m_vy)
    return energy, mass_vx, mass_vy


def calculate_by_runge(planets: [Planet],
                       dt: int,
                       d: int):
    """ Пересчет координат каждой планеты по методу Рунге_Кутты"""
    energy = []
    mass_vx = []
    mass_vy = []
    e, m_vx, m_vy = calculate_energy_and_mass(planets)
    energy.append(e)
    mass_vx.append(m_vx)
    mass_vy.append(m_vy)
    for t in range(0, d, dt):
        planets_ax, planets_ay = calculate_a_to_runge(planets, dt)
        for planet, ax, ay in zip(planets, planets_ax, planets_ay):
            planet.x += planet.vx * dt + dt * dt * (ax[0] + ax[1] + ax[2]) / 6
            planet.y += planet.vy * dt + dt * dt * (ay[0] + ay[1] + ay[2]) / 6
            planet.y_array.append(planet.y)
            planet.x_array.append(planet.x)
            planet.vx += (ax[0] + 2 * ax[1] + 2 * ax[2] + ax[3]) * dt / 6
            planet.vy += (ay[0] + 2 * ay[1] + 2 * ay[2] + ay[3]) * dt / 6
        e, m_vx, m_vy = calculate_energy_and_mass(planets)
        energy.append(e)
        mass_vx.append(m_vx)
        mass_vy.append(m_vy)
    return energy, mass_vx, mass_vy


def calculate(n: int,
              dt: int,
              d: int,
              schema: str,
              x_array: [float],
              y_array: [float],
              vx_array: [float],
              vy_array: [float],
              mass_array: [float]):
    # print(n, dt, d, schema, x_array, y_array, vx_array, vy_array, mass_array)

    planets_list = init(n, x_array, y_array, vx_array, vy_array, mass_array)
    if schema == 'Euler':
        energy, mass_vx, mass_vy = calculate_by_euler(planets_list, dt, d)
    else:
        energy, mass_vx, mass_vy = calculate_by_runge(planets_list, dt, d)

    graphs = []
    for planet in planets_list:
        graphs.append({
            'x': planet.x_array,
            'y': planet.y_array
        })

    print("Calculated", graphs)

    return {
        'customData': {
            'energy': energy,
            'mass_vx': mass_vx,
            'mass_vy': mass_vy,
        },
        'graphs': graphs
    }
