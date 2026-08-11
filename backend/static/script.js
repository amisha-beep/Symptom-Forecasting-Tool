// ==========================================
// AUTH SYSTEM (localStorage)
// ==========================================

const authPage = document.getElementById("authPage");
const appContainer = document.getElementById("appContainer");

const inForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

// Switch Forms

showLogin.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupForm.style.display = "none";

    showLogin.classList.add("active-tab");
    showSignup.classList.remove("active-tab");
});

showSignup.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";

    showSignup.classList.add("active-tab");
    showLogin.classList.remove("active-tab");
});

// Sign Up
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        signupMessage.innerHTML = "❌ Passwords do not match";
        signupMessage.style.color = "red";
        return;
    }

    signupMessage.innerHTML = "Sending data to server...";
    signupMessage.style.color = "blue";

    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.text())
    .then(data => {
        signupMessage.innerHTML = data;
        signupMessage.style.color = "green";
        signupForm.reset();
    })
    .catch(error => {
        signupMessage.innerHTML = "❌ Error connecting to server";
        signupMessage.style.color = "red";
        console.error(error);
    });
});

// Sign In

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.text())
    .then(data => {

        if (data === "Login Successful") {

            loginMessage.innerHTML = "✅ " + data;
            loginMessage.style.color = "green";

            authPage.style.display = "none";
            appContainer.style.display = "block";

            loginForm.reset();

        } else {

            loginMessage.innerHTML = "❌ " + data;
            loginMessage.style.color = "red";

        }

    })
    .catch(error => {

        loginMessage.innerHTML = "❌ Error connecting to server";
        loginMessage.style.color = "red";
        console.error(error);

    });
});

// ==========================================
// SYMPTOMS DATABASE
// ==========================================

const symptoms = [
"Abdominal Pain",
"Anxiety",
"Back Pain",
"Bleeding",
"Blurred Vision",
"Body Pain",
"Breathlessness",
"Chest Pain",
"Chills",
"Confusion",
"Constipation",
"Cough",
"Depression",
"Diarrhea",
"Dizziness",
"Dry Mouth",
"Ear Pain",
"Eye Irritation",
"Fatigue",
"Fever",
"Headache",
"Heart Palpitations",
"Hoarseness",
"Indigestion",
"Insomnia",
"Joint Pain",
"Loss of Appetite",
"Loss of Smell",
"Loss of Taste",
"Memory Problems",
"Migraine",
"Mood Swings",
"Muscle Pain",
"Nasal Congestion",
"Nausea",
"Night Sweats",
"Runny Nose",
"Seizures",
"Shortness of Breath",
"Skin Rash",
"Sore Throat",
"Stomach Cramps",
"Swollen Glands",
"Tingling",
"Tremors",
"Vomiting",
"Weakness",
"Wheezing"
];

// ==========================================
// SEARCHABLE SYMPTOM SELECTOR
// ==========================================

const dropdown =
document.getElementById("symptomDropdown");

const search =
document.getElementById("symptomSearch");

const selectedContainer =
document.getElementById("selectedSymptoms");

let selectedSymptoms = [];

function renderSymptoms(filter = "") {

    dropdown.innerHTML = "";

    symptoms
        .filter(symptom =>
            symptom.toLowerCase()
            .includes(filter.toLowerCase())
        )
        .forEach(symptom => {

            const div =
                document.createElement("div");

            div.className = "dropdown-item";

            div.textContent = symptom;

            div.onclick = () => {

                if (
                    !selectedSymptoms.includes(symptom)
                ) {
                    selectedSymptoms.push(symptom);
                    renderSelected();
                }
            };

            dropdown.appendChild(div);
        });
}

function renderSelected() {

    selectedContainer.innerHTML = "";

    selectedSymptoms.forEach(symptom => {

        const tag =
            document.createElement("div");

        tag.className = "tag";

        tag.innerHTML = `
            ${symptom}
            <span onclick="removeSymptom('${symptom}')">
            ✖
            </span>
        `;

        selectedContainer.appendChild(tag);
    });
}

function removeSymptom(symptom) {

    selectedSymptoms =
        selectedSymptoms.filter(
            item => item !== symptom
        );

    renderSelected();
}

search.addEventListener("input", () => {
    renderSymptoms(search.value);
});

renderSymptoms();

// ==========================================
// HEALTH ASSESSMENT
// ==========================================

document
.getElementById("symptomForm")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const name =
        document.getElementById("name").value;

    const age =
        document.getElementById("age").value;
        fetch("/predict", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body:
        `name=${encodeURIComponent(name)}` +
        `&age=${encodeURIComponent(age)}` +
        `&symptoms=${encodeURIComponent(selectedSymptoms.join(", "))}`
})
.then(response => response.text())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error(error);
});

    const count =
        selectedSymptoms.length;
let risk = "Low";
let color = "#22c55e";
let disease = "General Check-up Recommended";

if (selectedSymptoms.includes("Chest Pain") ||
    selectedSymptoms.includes("Shortness of Breath") ||
    selectedSymptoms.includes("Loss of Consciousness")) {

    risk = "High";
    color = "#ef4444";
    disease = "Possible Cardiac or Respiratory Emergency";

} else if (selectedSymptoms.includes("Fever") ||
           selectedSymptoms.includes("Persistent Cough") ||
           selectedSymptoms.includes("Severe Headache")) {

    risk = "Medium";
    color = "#f59e0b";
    disease = "Possible Viral Infection";
}

    const result =
        document.getElementById("result");

    result.style.display = "block";

    result.innerHTML = `
    <h2 class="assessment-title">
        📋 Health Assessment Report
    </h2>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Age:</strong> ${age}</p>
    <p><strong>Symptoms:</strong> ${count}</p>

    <p>
        <strong>Selected:</strong>
        ${selectedSymptoms.join(", ")}
    </p>

    <div class="risk" style="background:${color}">
        ${risk} Risk
    </div>
    <p><strong>Likely Disease:</strong> ${disease}</p>

    <div class="forecast">

        <h3>📈 7-Day Forecast</h3>

        <p>Day 1: ${Math.min(count + 1, 10)}/10</p>
        <p>Day 3: ${Math.min(count + 2, 10)}/10</p>
        <p>Day 5: ${Math.min(count + 1, 10)}/10</p>
        <p>Day 7: ${Math.max(count - 1, 1)}/10</p>

        <h3>💡 Precautions</h3>

        <ul>
            <li>Stay hydrated</li>
            <li>Get adequate rest</li>
            <li>Monitor symptom progression</li>
            <li>Consult a healthcare professional if symptoms worsen</li>
        </ul>

    </div>
`;

   result.scrollIntoView({
    behavior: "smooth"
});

// Get user's location
getUserLocation();

});


function getUserLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            window.userLatitude = position.coords.latitude;
            window.userLongitude = position.coords.longitude;

            console.log("Latitude:", window.userLatitude);
            console.log("Longitude:", window.userLongitude);

            
            findNearbyDoctors();

        },

        function(error) {

            if (error.code === error.PERMISSION_DENIED) {
                alert("You denied location permission.");
            }
            else if (error.code === error.POSITION_UNAVAILABLE) {
                alert("Location unavailable.");
            }
            else if (error.code === error.TIMEOUT) {
                alert("Location request timed out.");
            }
            else {
                alert("Unknown error.");
            }

        },

        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000
        }

    );

}
async function findNearbyDoctors() {

    const result = document.getElementById("result");
    result.innerHTML += "<p id='loadingHospitals'>🔍 Finding nearby hospitals...</p>";
    

    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:5000,${window.userLatitude},${window.userLongitude});
      node["amenity"="clinic"](around:5000,${window.userLatitude},${window.userLongitude});
      node["healthcare"="doctor"](around:5000,${window.userLatitude},${window.userLongitude});
    );
    out;
    `;

    try {

       const response = await fetch("/nearby-doctors", {
             method: "POST",
             headers: {
              "Content-Type": "application/json"
},
             body: JSON.stringify({
               latitude: window.userLatitude,
               longitude: window.userLongitude
})
    }
);

       const text = await response.text();

        console.log("Status:", response.status);
        console.log("Response:");
        console.log(text);

        if (text.startsWith("<?xml")) {
            console.log(text);
            alert("The API returned XML instead of JSON. Check the browser console.");
            return;
}

        const data = JSON.parse(text);

console.log("Backend returned:");
console.log(data);

if (data.error) {
    alert(data.error);
    return;
}

if (!data.elements || data.elements.length === 0) {
    alert("No hospitals found.");
    console.log(data);
    return;
}
       let hospitalList = "<h3>🏥 Nearby Hospitals</h3>";

       data.elements.slice(0,5).forEach(place => {
          hospitalList += `
          <div class="hospital-card">
            <h4>🏥 ${place.tags.name || "Unnamed Hospital"}</h4>
            <p>${place.tags["addr:street"] || "Address not available"}</p>
            <p>${place.tags["addr:city"] || ""}</p>
          </div>
          `;
});
        result.innerHTML += hospitalList;
        hospitalList += "</ul>";
        
        

        document.getElementById("loadingHospitals").remove();
        result.innerHTML += hospitalList;
    } catch (err) {

    const loading = document.getElementById("loadingHospitals");
    if (loading) {
        loading.remove();
    }

    console.error(err);
    alert("Error: " + err.message);
}
}

document.getElementById("logoutBtn").addEventListener("click", function () {

    fetch("http://127.0.0.1:5000/logout")
        .then(response => response.text())
        .then(data => {

           window.location.href = "/";
        })
        .catch(error => {
            console.error(error);
            alert("Logout failed.");
        });

});

const themeToggle = document.getElementById("themeToggle");


if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});