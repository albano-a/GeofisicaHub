from flask import Flask, render_template, request, redirect
import shortuuid

app = Flask(__name__)

# Dicionário para armazenar links encurtados
url_database = {}

@app.route('/')
def index():
    return render_template('encurtador.html')

@app.route('/shorten', methods=['POST'])
def shorten():
    long_url = request.form.get('long_url')
    if long_url:
        short_url = generate_short_url()
        url_database[short_url] = long_url
        return render_template('index.html', short_url=short_url)
    else:
        return redirect('/')

@app.route('/<short_url>')
def redirect_to_url(short_url):
    long_url = url_database.get(short_url)
    if long_url:
        return redirect(long_url)
    else:
        return render_template('404.html'), 404

def generate_short_url():
    return shortuuid.uuid()[:8]

if __name__ == '__main__':
    app.run(debug=True)
