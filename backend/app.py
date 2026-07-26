from flask import Flask, render_template, request
import sqlite3
import requests

app = Flask(__name__)

@app.route("/")
def home():
    connection = sqlite3.connect("symptom.db")
    connection.close()
    return render_template("index.html")
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        connection = sqlite3.connect("symptom.db")
        cursor = connection.cursor()

        try:
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, password)
            )
            connection.commit()
            message = "✅ Account created successfully!"
        except sqlite3.IntegrityError:
            message = "❌ Username already exists!"

        connection.close()
        return message

    return "Signup route is working!"
@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    connection = sqlite3.connect("symptom.db")
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (username, password)
    )

    user = cursor.fetchone()
    connection.close()

    if user:
        return "Login Successful"
    else:
        return "Username or Password is incorrect"
@app.route("/predict", methods=["POST"])
def predict():
    name = request.form["name"]
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
    connection = sqlite3.connect("symptom.db")
    cursor = connection.cursor()

    cursor.execute(
    """
     INSERT INTO symptom_history (username, symptoms, prediction, age, disease)
     VALUES (?, ?, ?, ?, ?)
     """,
     (name, symptoms, prediction, age, disease)
)

    connection.commit()
    connection.close()

    return "Symptom history saved successfully!"
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
if __name__ == "__main__":
    app.run(debug=True)