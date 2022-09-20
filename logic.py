def calculate(n: int,
              dt: int,
              d: int,
              schema: str,
              x_array: [float],
              y_array: [float],
              vx_array: [float],
              vy_array: [float],
              mass_array: str):
    print(n, dt, d, schema, x_array, y_array, vx_array, vy_array, mass_array)
    return {
        'customData': {
            'energy': [1, 2, 3, 4],
            'mass_vx': [5, 6, 7, 8],
            'mass_vy': [9, 10, 11, 12],
        },
        'graphs': [
            {
                'x': [0, 0, 0, 0],
                'y': [0, 0, 0, 0],
            },
            {
                'x': [1, 2, 3, 4],
                'y': [-1, -2, -3, -4],
            },
            {
                'x': [1.5, 1.5, 2.5, 10],
                'y': [1.5, 1.5, 2.5, 2.5],
            },
        ]
    }
