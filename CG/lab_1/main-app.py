import numpy as np
from bokeh.io             import curdoc
from bokeh.layouts        import row, column, widgetbox
from bokeh.models         import ColumnDataSource
from bokeh.models.widgets import TextInput
from bokeh.plotting       import Figure


def update(attr, old, new):
    try:
        phi = np.linspace(float(A.value), float(B.value), 1000)
        xs = float(a.value) * phi - float(b.value) * np.sin(phi)
        ys = float(a.value) - float(b.value) * np.cos(phi)
        source.data = dict(x=xs, y=ys)
    except ValueError:
        pass

# default values
phi = np.linspace(-10.0, 10.0, 1000)
xs = 1.0 * phi - 1.0 * np.sin(phi)
ys = 1.0 - 1.0 * np.cos(phi)

source = ColumnDataSource(data=dict(x=xs, y=ys))
plot = Figure(plot_width=800, title='Lab1', x_range=(-20, 20), y_range=(-10, 10), tools='crosshair,pan,reset,wheel_zoom', active_scroll='wheel_zoom', toolbar_location=None, x_axis_label='x', y_axis_label='y')
plot.line(x='x', y='y', source=source, line_width=2, line_color='black', legend='x = a*phi - b*sin(phi) y = a - b*cos(phi)')

a = TextInput(title='a', value='1.0')
b = TextInput(title='b', value='1.0')
A = TextInput(title='A', value='-10.0')
B = TextInput(title='B', value='10.0')

for w in [a, b, A, B]:
    w.on_change('value', update)

text_inputs = widgetbox(a, b, A, B)
curdoc().add_root(row(plot, text_inputs))
