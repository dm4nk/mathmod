def calculate(n: int,
              s: int,
              d: int,
              schema: str,
              x_array: [float],
              y_array: [float],
              vx_array: [float],
              vy_array: [float],
              mass_array: str):
    print(n, s, d, schema, x_array, y_array, vx_array, vy_array, mass_array)
    return [
        {
            'x': [0, 0, 0, 0],
            'y': [0, 0, 0, 0],
        },
        {
            'x': [1, 2, 3, 4],
            'y': [-1, -2, -3, -4],
        },
        {
            'x': [0.5, 1.5, 2.5, 3.5],
            'y': [0.5, 1.5, 2.5, 3.5],
        },
    ]
