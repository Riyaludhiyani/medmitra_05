// index.js (Backend - Node + Express)

require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
const Parser = require('rss-parser');
const parser = new Parser();
const cors = require("cors");

const EmployeeModel = require("./models/Employee");

const cron = require("node-cron");



const app = express();
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cors());


// -----------------------------------------

// MongoDB Connection

// -----------------------------------------

mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB Connected"))

  .catch((err) => console.log("MongoDB Error:", err));


// -----------------------------------------
// Register User (UPDATED: Strong Password + Hashing)
// -----------------------------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, ...otherData } = req.body;

    // 1. Check if user already exists
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. STRONG PASSWORD VALIDATION
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // 3. HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. SAVE USER WITH HASHED PASSWORD
    const newUser = await EmployeeModel.create({
      name,
      email,
      password: hashedPassword,
      ...otherData,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

});



// -----------------------------------------

// Login

// -----------------------------------------

// -----------------------------------------
// Login (UPDATED: Hash Comparison)
// -----------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.json({ status: "No record existed" });
    }

    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.json({ status: "Success", user });
    } else {
      return res.json({ status: "Incorrect password" });
    }
  } catch (err) {
    res.json({ status: "Error", error: err.message });
  }
});


//----------------------------
// Outbreaks
// ----------------------------
app.get("/outbreaks", async (req, res) => {
  const rawCity = req.query.city;

  if (!rawCity) return res.json({ alerts: [] });

  const city = rawCity.trim();
  let alerts = [];

  try {
    const query = `${city} (outbreak OR disease OR virus OR hospital OR cases OR dengue OR malaria OR flu OR pollution)`;
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}+when:30d&hl=en-IN&gl=IN&ceid=IN:en`;

    const feed = await parser.parseURL(feedUrl);

    const keywords = [
      { term: "dengue", name: "Dengue Alert", color: "#ef4444" },
      { term: "malaria", name: "Malaria Alert", color: "#f59e0b" },
      { term: "chikungunya", name: "Chikungunya", color: "#f59e0b" },
      { term: "flu", name: "Seasonal Flu", color: "#3b82f6" },
      { term: "h1n1", name: "Swine Flu", color: "#ef4444" },
      { term: "virus", name: "Viral Infection", color: "#f59e0b" },
      { term: "typhoid", name: "Typhoid", color: "#ef4444" },
      { term: "cholera", name: "Cholera", color: "#ef4444" },
      { term: "respiratory", name: "Respiratory Risk", color: "#7f1d1d" },
      { term: "pollution", name: "Poor Air Quality", color: "#7f1d1d" },
      { term: "aqi", name: "High Pollution", color: "#7f1d1d" },
      { term: "smog", name: "Smog Alert", color: "#7f1d1d" },
      { term: "zika", name: "Zika Virus", color: "#ef4444" },
      { term: "covid", name: "COVID-19", color: "#ef4444" },
    ];

    const seenDiseases = new Set();

    feed.items.forEach((item) => {
      const title = item.title.toLowerCase();

      keywords.forEach((k) => {
        if (title.includes(k.term) && !seenDiseases.has(k.name)) {
          seenDiseases.add(k.name);

          alerts.push({
            disease: k.name,
            severity: "In News",
            color: k.color,
            cases: "Reported",
            lastUpdated: new Date(item.pubDate).toLocaleDateString(),
            tips: [`Headline: "${item.title.substring(0, 60)}..."`],
          });
        }
      });
    });
  } catch (err) {
    console.error("RSS Scan Error:", err.message);
  }

  if (alerts.length === 0) {
    alerts.push({
      disease: "No Active Outbreaks",
      severity: "Safe",
      color: "#10b981",
      cases: "Zero Reports",
      lastUpdated: "Just Now",
      tips: [
        "Great news! No major disease outbreaks reported in your area recently.",
        "Maintain good hygiene to stay healthy.",
        "Drink plenty of water and eat fresh food.",
        "Stay active and get good sleep.",
      ],
    });
  }

  res.json({ city: rawCity, alerts });
});

});










// -----------------------------------------

// Get user by email

// -----------------------------------------

app.get("/user/:email", async (req, res) => {

  try {

    const email = req.params.email;

    const user = await EmployeeModel.findOne({ email });



    if (!user) return res.status(404).json({ message: "User not found" });



    res.json(user);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

});



// -----------------------------------------

// Update User

// -----------------------------------------

app.put("/update/:email", async (req, res) => {

  try {

    const updatedUser = await EmployeeModel.findOneAndUpdate(

      { email: req.params.email },

      req.body,

      { new: true }

    );



    res.json({

      status: "Success",

      user: updatedUser,

    });

  } catch (error) {

    res.json({ status: "Error", error });

  }

});



// ------------------------------------------------

// Vaccination Recommended Schedule

// ------------------------------------------------

const recommendedSchedule = [

  { name: "BCG", agesMonths: [0] },

  { name: "HepB", agesMonths: [0, 1, 6] },

  { name: "OPV", agesMonths: [0, 6, 14] },

  { name: "DPT", agesMonths: [2, 4, 6, 18, 60] },

  { name: "Measles", agesMonths: [9, 15] },

];



function approxDobFromAge(ageString) {

  const n = parseInt(ageString, 10);

  if (!isNaN(n) && n > 0) {

    const d = new Date();

    d.setFullYear(d.getFullYear() - n);

    return d;

  }

  return null;

}



function buildSchedule(user) {

  const now = new Date();

  let dob = user.dob ? new Date(user.dob) : null;



  if (!dob && user.age) dob = approxDobFromAge(user.age);



  const history = Array.isArray(user.vaccinations) ? user.vaccinations : [];



  const schedule = recommendedSchedule.map((vac) => {

    const taken = history

      .filter((h) => h.vaccineName === vac.name)

      .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken));



    const dosesTaken = taken.length;

    const nextDoseIndex = dosesTaken;

    const completed = nextDoseIndex >= vac.agesMonths.length;



    let nextDueDate = null;

    let status = "unknown";



    if (completed) {

      status = "completed";

    } else if (dob) {

      const months = vac.agesMonths[nextDoseIndex];

      const due = new Date(dob);

      due.setMonth(due.getMonth() + months);

      nextDueDate = due;



      if (due <= now) status = "due";

      else {

        const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        status = days <= 30 ? "upcoming" : "scheduled";

      }

    } else {

      status = "unknown - no dob/age";

    }



    return {

      vaccineName: vac.name,

      dosesRecommended: vac.agesMonths.length,

      dosesTaken,

      nextDoseIndex,

      nextDueDate,

      status,

    };

  });



  return schedule;

}



// -----------------------------------------

// GET Vaccination Schedule

// -----------------------------------------

app.get("/vaccination/schedule/:email", async (req, res) => {

  try {

    const user = await EmployeeModel.findOne({ email: req.params.email }).lean();

    if (!user) return res.status(404).json({ error: "User not found" });



    const schedule = buildSchedule(user);

    res.json({ user, schedule });

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: "Server error" });

  }

});



// -----------------------------------------

// POST vaccination record

// -----------------------------------------

app.post("/user/:email/vaccination", async (req, res) => {

  let { vaccineName, nextDoseDate, doseNumber, totalDoses } = req.body;



  // Force date to YYYY-MM-DD format

  nextDoseDate = new Date(nextDoseDate).toISOString().split("T")[0];



  try {

    const user = await EmployeeModel.findOne({ email: req.params.email });



    if (!user) return res.status(404).json({ message: "User not found" });



    user.vaccinations.push({

      vaccineName,

      nextDoseDate,

      doseNumber,

      totalDoses,

      completed: false,

    });



    await user.save();



    res.json({ status: "success", user });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

});



// -----------------------------------------

// CRON JOB — Runs Every Minute

// (Currently only logs reminders)

// -----------------------------------------

cron.schedule("* * * * *", async () => {

  console.log("Running daily vaccination checks...");



  const users = await EmployeeModel.find();

  const today = new Date().toISOString().split("T")[0];



  users.forEach((user) => {

    (user.vaccinations || []).forEach((vac) => {

      if (!vac.completed && vac.nextDoseDate === today) {

        console.log(`Reminder: ${user.email} is due for ${vac.vaccineName}`);

      }

    });

  });

});




const axios = require("axios");



// Helper: geocode city -> { lat, lon, display_name }

async function geocodeCity(city) {

  const url = `https://nominatim.openstreetmap.org/search`;

  const params = {

    q: city + ', India',

    format: "json",

    addressdetails: 1,

    limit: 1,

  };

  const r = await axios.get(url, { params, headers: { 'User-Agent': 'Medmitra/1.0' } });

  if (!r.data || r.data.length === 0) return null;

  const p = r.data[0];

  return { lat: parseFloat(p.lat), lon: parseFloat(p.lon), display_name: p.display_name };

}



// Endpoint: /hospitals?city=Indore&radius=5000

// Helper: Calculate distance between two coordinates in meters (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Endpoint: /hospitals?lat=...&lon=... OR /hospitals?city=...
app.get("/hospitals", async (req, res) => {
  try {
    let lat, lon, displayName;

    // Case 1: Search by GPS Coordinates (Exact Location)
    if (req.query.lat && req.query.lon) {
      lat = parseFloat(req.query.lat);
      lon = parseFloat(req.query.lon);
      displayName = "Current Location";
    } 
    // Case 2: Search by City Name (Fallback)
    else if (req.query.city) {
      const place = await geocodeCity(req.query.city);
      if (!place) return res.status(404).json({ error: "City not found" });
      lat = place.lat;
      lon = place.lon;
      displayName = place.display_name;
    } else {
      return res.status(400).json({ error: "Latitude/Longitude or City required" });
    }

    const radius = 5000; // Search within 5km

    // Overpass API Query
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        relation["amenity"="hospital"](around:${radius},${lat},${lon});
      );
      out center tags;
    `;

    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const overpassResp = await axios.post(overpassUrl, overpassQuery, {
      headers: { "Content-Type": "text/plain", 'User-Agent': 'Medmitra/1.0' },
    });

    const elements = (overpassResp.data && overpassResp.data.elements) || [];

    // Process and Sort by Distance
    const hospitals = elements.map((el) => {
      const hLat = el.lat || (el.center && el.center.lat);
      const hLon = el.lon || (el.center && el.center.lon);
      
      return {
        id: el.id,
        name: (el.tags && (el.tags.name || el.tags["official_name"])) || "Unknown Hospital",
        lat: hLat,
        lon: hLon,
        dist: getDistance(lat, lon, hLat, hLon), // Calculate distance from user
        address: {
          street: el.tags && (el.tags["addr:street"] || ""),
          city: el.tags && (el.tags["addr:city"] || ""),
        },
        phone: el.tags && (el.tags.phone || el.tags["contact:phone"] || null),
      };
    })
    .filter(h => h.lat && h.lon)
    .sort((a, b) => a.dist - b.dist) // Sort: Nearest first
    .slice(0, 5); // Take only top 5

    res.json({
      location: displayName,
      center: { lat, lon },
      count: hospitals.length,
      hospitals,
    });

  } catch (err) {
    console.error("Hospitals lookup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/notifications/:email", async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const allNotifications = [];

    // 1. Add Persistent DB Notifications (Emergency Alerts)
    if (user.notifications && user.notifications.length > 0) {
      user.notifications.forEach(n => {
        allNotifications.push({
          message: n.message,
          type: n.type || "alert",
          date: n.date
        });
      });
    }

    // 2. Add Vaccination Reminders (Logic: Today + Next 7 Days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    (user.vaccinations || []).forEach((vac) => {
      if (!vac.completed) {
        const doseDate = new Date(vac.nextDoseDate);
        doseDate.setHours(0, 0, 0, 0);
        
        const diffTime = doseDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 7) {
          let msg = diffDays === 0 
            ? `Today is your vaccination date for ${vac.vaccineName}`
            : `Upcoming: ${vac.vaccineName} in ${diffDays} days.`;
            
          allNotifications.push({
            message: msg,
            type: "vaccine",
            date: vac.nextDoseDate
          });
        }
      }
    });

    // Sort: Newest first
    allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ notifications: allNotifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------
// POST Emergency Alert (SAFE VERSION)
// -----------------------------------------
app.post("/emergency/:email", async (req, res) => {
  try {
    const sender = await EmployeeModel.findOne({ email: req.params.email });
    if (!sender) return res.status(404).json({ error: "User not found" });

    // 1. Identify contacts (Using String() to prevent .trim() crashes)
    const contactsToNotify = [];
    
    if (sender.phonemem1) contactsToNotify.push(String(sender.phonemem1).trim());
    if (sender.phonemem2) contactsToNotify.push(String(sender.phonemem2).trim());

    if (contactsToNotify.length === 0) {
      return res.json({ status: "NoContacts", message: "No emergency contacts found." });
    }

    const message = `🚨 EMERGENCY: ${sender.name} needs help! Location: ${sender.city}. Call: ${sender.phone1}`;

    // 2. Find Users in DB who have these phone numbers
    // We update their 'notifications' array
    const result = await EmployeeModel.updateMany(
      { phone1: { $in: contactsToNotify } },
      { 
        $push: { 
          notifications: { 
            message: message, 
            type: "emergency",
            date: new Date()
          } 
        } 
      }
    );

    console.log(`Alert sent. Matched ${result.modifiedCount} members.`);

    res.json({
      status: "Success",
      matchedUsers: result.modifiedCount,
      message: "Alert sent successfully!"
    });

  } catch (err) {
    console.error("SERVER ERROR:", err); // Check your terminal for this log
    res.status(500).json({ error: err.message });
  }
});



// -----------------------------------------

// Start Server

// -----------------------------------------

const PORT = process.env.PORT || 3001;



app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});



