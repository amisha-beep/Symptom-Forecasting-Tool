from flask import Flask, render_template, request, session, redirect, url_for
import requests
import os
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key="amisha@21"

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class SymptomHistory(db.Model):
    __tablename__ = "symptom_history"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    symptoms = db.Column(db.Text, nullable=False)
    prediction = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    disease = db.Column(db.String(200), nullable=False)


with app.app_context():
    db.create_all()
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        hashed_password = generate_password_hash(password)

        try:
            user = User(username=username, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            return "✅ Account created successfully!"

        except Exception as e:
            db.session.rollback()
            return str(e)

    return "Signup route is working!"


@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        session["username"] = username
        return "Login Successful"
    else:
        return "Invalid Username or Password"

    
@app.route("/predict", methods=["POST"])
def predict():
    username = session.get("username")

    if not username:
        return redirect(url_for("home"))

    age = request.form["age"]
    symptoms = request.form["symptoms"]

    # Temporary prediction
    symptom_list = [s.strip() for s in symptoms.split(",") if s.strip()]

    high_risk = [
        "Chest Pain",
        "Shortness of Breath",
        "Loss of Consciousness"
    ]

    medium_risk = [
        "Fever",
        "Persistent Cough",
        "Severe Headache"
    ]

    prediction = "Low Risk"
    disease = "General Check-up Recommended"

    for symptom in symptom_list:
        if symptom in high_risk:
            prediction = "High Risk"
            disease = "Possible Cardiac or Respiratory Emergency"
            break
        elif symptom in medium_risk:
            prediction = "Medium Risk"
            disease = "Possible Viral Infection"

    print("Symptoms received:", symptom_list)
    print("Prediction:", prediction)

    history = SymptomHistory(
        username=username,
        symptoms=symptoms,
        prediction=prediction,
        age=int(age),
        disease=disease
    )

    db.session.add(history)
    db.session.commit()

    return "Symptom history saved successfully!"

@app.route("/history")
def history():
    username = session.get("username")

    if not username:
        return redirect(url_for("home"))

    history = SymptomHistory.query.filter_by(username=username).all()

    return render_template("history.html", history=history)
@app.route("/nearby-doctors", methods=["POST"])
def nearby_doctors():

    data = request.get_json()

    latitude = data["latitude"]
    longitude = data["longitude"]

    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:5000,{latitude},{longitude});
      node["amenity"="clinic"](around:5000,{latitude},{longitude});
      node["healthcare"="doctor"](around:5000,{latitude},{longitude});
    );
    out body;
    """

    response = requests.post(
        "https://overpass-api.de/api/interpreter",
        data=query
    )

    return response.text, 200, {"Content-Type": "application/json"}


@app.route("/logout")
def logout():
    if "username" in session:
        session.clear()

    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)