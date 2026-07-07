from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load("floods.save")
scaler = joblib.load("scaler.save")


@app.route('/')
def home():
    return render_template("home.html")


@app.route('/predict-page')
def predict_page():
    return render_template("predict.html")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        annual = float(request.form['annual'])
        janfeb = float(request.form['janfeb'])
        marmay = float(request.form['marmay'])
        junsep = float(request.form['junsep'])
        octdec = float(request.form['octdec'])

        data = np.array([[annual, janfeb, marmay, junsep, octdec]])
        data = scaler.transform(data)

        # Prediction
        prediction = model.predict(data)[0]

        # Prediction probability
        probability = model.predict_proba(data)[0]

        # Probability of flood (class 1)
        risk = round(probability[1] * 100)

        if prediction == 1:
            return render_template("flood.html", risk=risk)
        else:
            return render_template("noflood.html", risk=risk)

    except Exception as e:
        return f"Error: {e}"
if __name__ == "__main__":
    app.run(debug=True)