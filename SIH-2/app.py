from translate import Translator
from flask import Flask, request, send_from_directory
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

@app.get('/static/')
def root():
    return send_from_directory(app.static_folder,'index.html')

@app.post('/translate')
def transla():
    data=request.get_json()
    print(data)
    translator=Translator(to_lang=data.get('target'))
    translated_text=(translator.translate(data.get('q')))
    return translated_text

if __name__=="__main__":
    app.run(debug=True)