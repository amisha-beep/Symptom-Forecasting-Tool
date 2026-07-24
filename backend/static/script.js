// ==========================================
// AUTH SYSTEM (localStorage)
// ==========================================

const authPage = document.getElementById("authPage");
const appContainer = document.getElementById("appContainer");

const loginForm = document.getElementById("loginForm");
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

    const count =
        selectedSymptoms.length;

    let risk = "Low";
    let color = "#22c55e";

    if (count >= 4) {
        risk = "Medium";
        color = "#f59e0b";
    }

    if (count >= 8) {
        risk = "High";
        color = "#ef4444";
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

        <div class="risk"
        style="background:${color}">
            ${risk} Risk
        </div>

        <div class="forecast">

            <h3>📈 7-Day Forecast</h3>

            <p>Day 1: ${Math.min(count+1,10)}/10</p>
            <p>Day 3: ${Math.min(count+2,10)}/10</p>
            <p>Day 5: ${Math.min(count+1,10)}/10</p>
            <p>Day 7: ${Math.max(count-1,1)}/10</p>

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

        function(position){

           window.userLatitude = position.coords.latitude;
window.userLongitude = position.coords.longitude;

console.log(window.userLatitude);
console.log(window.userLongitude);

            alert("Location received successfully!");

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            findNearbyDoctors();

        },

        function(error){

            if(error.code === error.PERMISSION_DENIED){
                alert("You denied location permission.");
            }
            else if(error.code === error.POSITION_UNAVAILABLE){
                alert("Location unavailable.");
            }
            else if(error.code === error.TIMEOUT){
                alert("Location request timed out.");
            }
            else{
                alert("Unknown error.");
            }

        }

    );

}
async function findNearbyDoctors() {

    const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${window.userLatitude},${window.userLongitude});
      node["amenity"="clinic"](around:5000,${window.userLatitude},${window.userLongitude});
      node["healthcare"="doctor"](around:5000,${window.userLatitude},${window.userLongitude});
    );
    out;
    `;

    try {

        const response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

        const data = await response.json();

        console.log(data);

        alert("Found " + data.elements.length + " nearby hospitals/clinics.");

    } catch (err) {

        console.error(err);
        alert("Unable to fetch nearby doctors.");

    }

}