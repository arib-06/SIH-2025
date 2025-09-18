from translate import Translator
from flask import Flask, render_template, request, send_from_directory
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

@app.get('/ar')
def ar():
    return render_template('ar.html')
@app.get('/assistant')
def assistant():
    return render_template('assistant.html')
@app.get('/hotel')
def hotel():
    return render_template('hotel-results.html')

@app.get('/hotel-results')
def hotel_results():
    destination = request.args.get('destination', '')
    checkin = request.args.get('checkin', '')
    checkout = request.args.get('checkout', '')
    return render_template('hotel-results.html', destination=destination, checkin=checkin, checkout=checkout)
@app.get('/')
def index():
    return render_template('index.html')
@app.get('/navbar')
def navbar():
    return render_template('navbar.html')
@app.get('/recomendations')
def recomendations():
    search_query = request.args.get('q', '')  # Get the search query from URL parameters
    return render_template('recomendations.html', search_query=search_query)
@app.get('/reel')
def reel():
    return render_template('reel.html')
@app.get('/settings')
def settings():
    return render_template('settings.html')
@app.get('/signin')
def signin():
    return render_template('signin.html')
@app.get('/signup')
def signup():
    return render_template('signup.html')
@app.get('/sos')
def sos():
    return render_template('sos.html')
@app.get('/tourist_guide')
def tourist_guide():
    return render_template('tourist_guide.html')
@app.get('/translate')
def translate():
    return render_template('translate.html')
@app.get('/traverz_gamification')
def traverz_gamification():
    return render_template('traverz_gamification.html')


@app.post('/translate')
def transla():
    data = request.get_json(silent=True) or {}
    if 'target' not in data or 'q' not in data:
        return "", 400
    try:
        translator = Translator(to_lang=data['target'])
        translated_text = translator.translate(data['q'])
        return translated_text
    except Exception as e:
        return str(e), 500

if __name__=="__main__":
    app.run(debug=True)