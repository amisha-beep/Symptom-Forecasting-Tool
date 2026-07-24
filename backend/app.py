from flask import Flask, render_template, request
import sqlite3

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
if __name__ == "__main__":
    app.run(debug=True)