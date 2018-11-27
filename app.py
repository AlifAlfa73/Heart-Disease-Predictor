from flask import Flask, render_template, request, jsonify
import os
from predict import predict_data


app = Flask(__name__, template_folder='template/')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/checker')
def checker():
    return render_template('checker.html')


@app.route('/api/prediction', methods=['POST'])
def predict():
    body = request.json
    resp = predict_data(body)
    resp["name"] = body["name"]
    return jsonify(resp)


app.run(port=os.environ.get('PORT', 5050), debug=True)
