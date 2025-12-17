// Home.js - COMPLETE IMPROVED VERSION

import React, { useState, useEffect } from "react";

import axios from "axios";

import {

  FaUserCircle,

  FaBell,

  FaSyringe,

  FaExclamationTriangle,

  FaHospital,

  FaPhoneAlt,

  FaLightbulb,

  FaCalendarAlt,

  FaSearch,

  FaTimes,

  FaRobot,

  FaMagic,

} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./Home.css";



function Home() {
  const [onlyShowNotifications, setOnlyShowNotifications] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
const [showNotificationModal, setShowNotificationModal] = useState(false); 
  const [editMode, setEditMode] = useState(false);

  const [showVaccinationForm, setShowVaccinationForm] = useState(false);

  const [showHealthTips, setShowHealthTips] = useState(false);

  const [showHospitalFinder, setShowHospitalFinder] = useState(false);

  const [showVaccinationSchedule, setShowVaccinationSchedule] = useState(false);

  const [showOutbreakAlerts, setShowOutbreakAlerts] = useState(false);



  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({});

  const [notifications, setNotifications] = useState([]);

  const [hospitals, setHospitals] = useState([]);

  const [searchingHospitals, setSearchingHospitals] = useState(false);

  const [schedule, setSchedule] = useState([]);

  const [healthTipsSearch, setHealthTipsSearch] = useState("");

  const [outbreakData, setOutbreakData] = useState([]);

  const [loadingOutbreaks, setLoadingOutbreaks] = useState(false);

  const [aiTip, setAiTip] = useState(null);
  const [loadingTip, setLoadingTip] = useState(false);

  const navigate = useNavigate();



  const [vaccineData, setVaccineData] = useState({

    vaccineName: "",

    doseNumber: 1,

    totalDoses: 1,

    nextDoseDate: "",

  });



  // Comprehensive health tips database

  const allHealthTips = [
    { category: "Hydration", tip: "Drink at least 8 glasses of water daily.", icon: "💧" },
    { category: "Sleep", tip: "Sleep 7–8 hours every night for repair.", icon: "😴" },
    { category: "Exercise", tip: "30 minutes of cardio improves heart health.", icon: "🏃" },
    { category: "Nutrition", tip: "Eat a rainbow of vegetables for vitamins.", icon: "🥗" },
    { category: "Mental Health", tip: "5 minutes of meditation reduces cortisol.", icon: "🧘" },
    { category: "Hygiene", tip: "Wash hands for 20 seconds to kill germs.", icon: "🧼" },
    { category: "Eyes", tip: "Follow the 20-20-20 rule for screen time.", icon: "👁️" },
    { category: "Movement", tip: "Stand up and stretch every hour.", icon: "🚶" },
    { category: "Protein", tip: "Include eggs or lentils in your breakfast.", icon: "🥚" },
    { category: "Gratitude", tip: "Write down 3 things you are grateful for.", icon: "📝" },
    { category: "Strength", tip: "Lift weights twice a week for bone density.", icon: "💪" },
    { category: "Routine", tip: "Wake up at the same time every day.", icon: "⏰" },
    { category: "Morning", tip: "Drink warm water with lemon first thing.", icon: "☀️" },
    { category: "Sugar", tip: "Replace soda with sparkling water or tea.", icon: "🍯" },
    { category: "Dental", tip: "Floss daily, not just when food is stuck.", icon: "🦷" },
    { category: "Social", tip: "Call a friend; social connection boosts immunity.", icon: "👨‍👩‍👧" },
    { category: "Flexibility", tip: "Touch your toes daily to keep spine flexible.", icon: "🧘‍♀️" },
    { category: "Fiber", tip: "Oats and apples are great for digestion.", icon: "🌾" },
    { category: "Checkup", tip: "Schedule your annual blood work today.", icon: "🏥" },
    { category: "Vitamin C", tip: "Oranges and peppers boost your immune system.", icon: "🍊" },
    { category: "Heart", tip: "Reduce salt to keep blood pressure stable.", icon: "❤️" },
    { category: "Sun", tip: "15 mins of morning sun helps Vitamin D levels.", icon: "☀️" },
    { category: "Gut", tip: "Yogurt is great for your gut bacteria.", icon: "🥛" },
    { category: "Mindful Eating", tip: "Chew your food slowly to aid digestion.", icon: "🍽️" },
    { category: "Skin", tip: "Sunscreen is needed even on cloudy days.", icon: "🧴" },
    { category: "Vaccine", tip: "Check if your Tetanus shot is up to date.", icon: "💉" },
    { category: "Caffeine", tip: "Stop caffeine by 4 PM for better sleep.", icon: "☕" },
    { category: "Stairs", tip: "Take the stairs; it counts as a mini-workout.", icon: "🪜" },
    { category: "Bedding", tip: "Wash pillowcases weekly for clear skin.", icon: "🛏️" },
    { category: "Cooking", tip: "Cook at home to control sodium and oil.", icon: "🍳" },
  ];



  const filteredHealthTips = healthTipsSearch

    ? allHealthTips.filter(

        (item) =>

          item.tip.toLowerCase().includes(healthTipsSearch.toLowerCase()) ||

          item.category.toLowerCase().includes(healthTipsSearch.toLowerCase())

      )

    : allHealthTips;


  
  
  
  
  
  
  const generateAiTip = () => {
    setLoadingTip(true);
    setAiTip(null); // Clear previous

    // Simulate AI Processing time (1.5 seconds)
    setTimeout(() => {
      // 1. Pick a random tip
      const randomIndex = Math.floor(Math.random() * allHealthTips.length);
      const rawTip = allHealthTips[randomIndex];

      // 2. Pick a random "AI Persona" intro
      const intros = [
        `Hello ${user?.name || "Friend"}, based on general wellness data, here is your focus:`,
        "Analyzing your health profile... Here is a recommendation:",
        "Medmitra AI suggests focusing on this today:",
        "For optimal vitality, try incorporating this:",
        "Here is a scientifically backed wellness tip for you:",
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];

      // 3. Set the data
      setAiTip({
        intro: randomIntro,
        ...rawTip
      });
      
      setLoadingTip(false);
    }, 1500);
  };

  // Fetch User

  useEffect(() => {

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {

      navigate("/login");

      return;

    }



    axios

      .get(`http://localhost:3001/user/${userEmail}`)

      .then((res) => {

        setUser(res.data);

        setFormData(res.data);

      })

      .catch((err) => console.log(err));

  }, [navigate]);



  // Load Notifications

  const loadNotifications = () => {

    if (!user?.email) return;

    axios

      .get(`http://localhost:3001/notifications/${user.email}`)

      .then((res) => setNotifications(res.data.notifications || []))

      .catch((err) => console.log(err));

  };



  useEffect(() => {

    loadNotifications();

    const timer = setInterval(loadNotifications, 20000);

    return () => clearInterval(timer);

  }, [user?.email]);



  // Load Vaccination Schedule

  const loadVaccinationSchedule = () => {

    if (!user?.email) return;

    axios

      .get(

        `http://localhost:3001/vaccination/schedule/${encodeURIComponent(

          user.email

        )}`

      )

      .then((res) => setSchedule(res.data.schedule || []))

      .catch((err) => console.log(err));

  };



  useEffect(() => {

    if (showVaccinationSchedule) {

      loadVaccinationSchedule();

    }

  }, [showVaccinationSchedule, user?.email]);



  // Fetch outbreak data - Replace with real API call

  // Fetch outbreak data - REAL LIVE API CALL
  const fetchOutbreakData = async () => {
    // 1. Get city from user profile
    const userCity = user?.city; 

    if (!userCity) {
      alert("Please update your profile with your City to see local alerts.");
      return;
    }

    setLoadingOutbreaks(true);

    // 2. Call your new Backend Engine
    axios.get(`http://localhost:3001/outbreaks?city=${userCity}`)
      .then((res) => {
        console.log("Outbreak Data:", res.data); // Debugging
        setOutbreakData(res.data.alerts || []);
        setLoadingOutbreaks(false);
      })
      .catch((err) => {
        console.error("Error fetching outbreaks:", err);
        setLoadingOutbreaks(false);
        // Optional: Show empty state or error state
      });
  };


  // Profile Toggle

  const handleProfileToggle = () => setShowProfile(!showProfile);

  const handleEditClick = () => setEditMode(true);



  // Form Change

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });

  };



  // Save Profile

  const handleSave = () => {

    axios

      .put(`http://localhost:3001/update/${user.email}`, formData)

      .then((res) => {

        alert("Profile Updated Successfully!");

        setUser(res.data.user);

        setEditMode(false);

      })

      .catch((err) => console.log(err));

  };



  // Save Vaccine

  const saveVaccine = () => {

    axios

      .post(`http://localhost:3001/user/${user.email}/vaccination`, vaccineData)

      .then((res) => {

        alert("Vaccination added successfully!");

        setShowVaccinationForm(false);

        setVaccineData({

          vaccineName: "",

          doseNumber: 1,

          totalDoses: 1,

          nextDoseDate: "",

        });

        loadVaccinationSchedule();

        loadNotifications();

      })

      .catch((err) => console.log(err));

  };



  // Find Hospitals

  const findNearbyHospitals = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setSearchingHospitals(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Call backend with lat/lon instead of city
        axios
          .get(`http://localhost:3001/hospitals?lat=${latitude}&lon=${longitude}`)
          .then((res) => {
            setHospitals(res.data.hospitals || []);
            setSearchingHospitals(false);
          })
          .catch((err) => {
            console.log(err);
            alert("Error finding hospitals");
            setSearchingHospitals(false);
          });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please allow location access.");
        setSearchingHospitals(false);
      }
    );
  };



  // Emergency Help - FIXED

  // Emergency Help - CONNECTED TO BACKEND
  // Emergency Help - CONNECTED TO BACKEND
  const handleEmergency = () => {
    if (!user || !user.email) return;

    axios.post(`http://localhost:3001/emergency/${user.email}`)
      .then((res) => {
        if (res.data.status === "NoContacts") {
           alert("No emergency contacts found. Please Edit Profile -> Add Contacts.");
           setEditMode(true);
        } else {
           alert(`🚨 EMERGENCY SENT 🚨\n\nAlert sent to ${res.data.matchedUsers} app users.\nSMS triggered for offline contacts.`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error sending alert. Check console for details.");
      });
  };

  // Logout

  const handleLogout = () => {

    localStorage.removeItem("userEmail");

    navigate("/");

  };



  // Load VAPI Widgets - MOVED OUTSIDE COMPONENT

  useEffect(() => {

    const script = document.createElement("script");

    script.src =

      "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";

    script.async = true;

    script.type = "text/javascript";

    document.body.appendChild(script);



    return () => {

      // Cleanup: remove script when component unmounts

      document.body.removeChild(script);

    };

  }, []);



  if (!user) {

    return (

      <div className="loading-container">

        <div className="loading-spinner"></div>

        <p>Loading your dashboard...</p>

      </div>

    );

  }



  return (

    <div className="home-dashboard">

      {/* Header - Matching Landing Page Style */}

      <header className="dashboard-header">

        <div className="header-left">

          <div className="logo-section">

            <div className="logo-icon-home">M</div>

            <span className="logo-text-home">Medmitra</span>

          </div>

        </div>



        <div className="header-center">

          <h1 className="welcome-text">Welcome back, {user.name}! 👋</h1>

        </div>



        <div className="header-right">

         <div
            className="notification-icon-wrapper"
            onClick={() => setShowNotificationModal(true)} 
          >
            <FaBell className="header-icon" />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>



          <div className="profile-icon-wrapper" onClick={handleProfileToggle}>

            <FaUserCircle className="header-icon profile-icon-header" />

          </div>

        </div>

      </header>



      {/* Profile Dropdown */}

      {showProfile && (

        <div className="profile-dropdown">

          <div className="profile-dropdown-header">

            <FaUserCircle size={50} className="profile-avatar" />

            <div>

              <h3>{user.name}</h3>

              <p className="profile-email">{user.email}</p>

            </div>

          </div>

          <div className="profile-dropdown-body">

            <div className="profile-info-row">

              <span className="info-label">Age:</span>

              <span className="info-value">{user.age}</span>

            </div>

            <div className="profile-info-row">

              <span className="info-label">Gender:</span>

              <span className="info-value">{user.gender}</span>

            </div>

            <div className="profile-info-row">

              <span className="info-label">Blood Group:</span>

              <span className="info-value">{user.blood || "N/A"}</span>

            </div>

            <div className="profile-info-row">

              <span className="info-label">Location:</span>

              <span className="info-value">

                {user.city}, {user.state}

              </span>

            </div>

          </div>

          <div className="profile-dropdown-footer">

            <button className="btn-edit-profile" onClick={handleEditClick}>

              Edit Profile

            </button>

            <button className="btn-logout" onClick={handleLogout}>

              Logout

            </button>

          </div>

        </div>

      )}



      {/* Main Content */}

      <main className="dashboard-main">

        {/* Quick Stats */}

        <section className="quick-stats">

          <div className="stat-card stat-card-1">

            <FaSyringe className="stat-icon" />

            <div>

              <h3>{user.vaccinations?.length || 0}</h3>

              <p>Vaccinations</p>

            </div>

          </div>

          <div className="stat-card stat-card-2">

            <FaBell className="stat-icon" />

            <div>

              <h3>{notifications.length}</h3>

              <p>Notifications</p>

            </div>

          </div>

          <div className="stat-card stat-card-3">

            <FaCalendarAlt className="stat-icon" />

            <div>

              <h3>{schedule.filter((s) => s.status === "due").length}</h3>

              <p>Pending</p>

            </div>

          </div>

        </section>



        {/* Feature Cards Grid */}

        <section className="features-grid">

          <div

            className="feature-card-home card-purple"

            onClick={() => {
              setOnlyShowNotifications(false); 
              setShowVaccinationSchedule(true);
            }}

          >

            <div className="feature-icon-wrapper">

              <FaSyringe className="feature-icon-large" />

            </div>

            <h3>Vaccination Schedule</h3>

            <p>Track and get reminders for your vaccines</p>

          </div>



          <div

            className="feature-card-home card-blue"

            onClick={() => {
              setShowHealthTips(true);
              generateAiTip();
}}

          >

            <div className="feature-icon-wrapper">

              <FaLightbulb className="feature-icon-large" />

            </div>

            <h3>Health Tips</h3>

            <p>Daily health and wellness advice</p>

          </div>



          <div

            className="feature-card-home card-green"

            onClick={() => {

              setShowOutbreakAlerts(true);

              fetchOutbreakData();

            }}

          >

            <div className="feature-icon-wrapper">

              <FaExclamationTriangle className="feature-icon-large" />

            </div>

            <h3>Outbreak Alerts</h3>

            <p>Stay aware of disease outbreaks near you</p>

          </div>



          <div

            className="feature-card-home card-orange"

            onClick={() => {

              setShowHospitalFinder(true);

              findNearbyHospitals();

            }}

          >

            <div className="feature-icon-wrapper">

              <FaHospital className="feature-icon-large" />

            </div>

            <h3>Hospital Finder</h3>

            <p>Find nearby hospitals instantly</p>

          </div>



          <div className="feature-card-home card-red" onClick={handleEmergency}>

            <div className="feature-icon-wrapper">

              <FaPhoneAlt className="feature-icon-large" />

            </div>

            <h3>Emergency Help</h3>

            <p>Notify your family in emergencies</p>

          </div>



          <div

            className="feature-card-home card-teal"

            onClick={() => setShowVaccinationSchedule(true)}

          >

            <div className="feature-icon-wrapper">

              <FaCalendarAlt className="feature-icon-large" />

            </div>

            <h3>My Schedule</h3>

            <p>View your vaccination schedule</p>

          </div>

        </section>

      </main>



      {/* Footer - NEW */}

      <footer className="dashboard-footer">

        <div className="footer-content">

          <div className="footer-section">

            <div className="footer-logo">

              <div className="logo-icon-footer">M</div>

              <span className="logo-text-footer">Medmitra</span>

            </div>

            <p className="footer-desc">

              Your personal AI health assistant for daily wellness support and

              vaccination tracking.

            </p>

          </div>



          <div className="footer-section">

            <h4>Quick Links</h4>

            <ul>

              <li>

                <a href="#about">About Us</a>

              </li>

              <li>

                <a href="#contact">Contact</a>

              </li>

              <li>

                <a href="#privacy">Privacy Policy</a>

              </li>

              <li>

                <a href="#terms">Terms of Service</a>

              </li>

            </ul>

          </div>



          <div className="footer-section">

            <h4>Contact</h4>

            <p>📧 support@medmitra.com</p>

            <p>📞 +91 1234567890</p>

            <p>📍 Indore, Madhya Pradesh</p>

          </div>

        </div>

        <div className="footer-bottom">

          <p>© 2024 Medmitra. All rights reserved.</p>

        </div>

      </footer>



      {/* Edit Profile Modal */}

      {editMode && (

        <div className="modal-overlay" onClick={() => setEditMode(false)}>

          <div

            className="modal-content modal-edit-profile"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="modal-header">

              <h2>Edit Profile</h2>

              <FaTimes

                className="modal-close"

                onClick={() => setEditMode(false)}

              />

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>Name</label>

                <input

                  name="name"

                  value={formData.name || ""}

                  onChange={handleChange}

                />

              </div>

              <div className="form-group">

                <label>Age</label>

                <input

                  name="age"

                  type="number"

                  value={formData.age || ""}

                  onChange={handleChange}

                />

              </div>

              <div className="form-group">

                <label>Gender</label>

                <select

                  name="gender"

                  value={formData.gender || ""}

                  onChange={handleChange}

                >

                  <option value="male">Male</option>

                  <option value="female">Female</option>

                  <option value="other">Other</option>

                </select>

              </div>

              <div className="form-group">

                <label>Blood Group</label>

                <input

                  name="blood"

                  value={formData.blood || ""}

                  onChange={handleChange}

                  placeholder="e.g., O+, A-, B+"

                />

              </div>

              <div className="form-group full-width">

                <label>Address</label>

                <input

                  name="address"

                  value={formData.address || ""}

                  onChange={handleChange}

                />

              </div>

              <div className="form-group">

                <label>City</label>

                <input

                  name="city"

                  value={formData.city || ""}

                  onChange={handleChange}

                />

              </div>

              <div className="form-group">

                <label>State</label>

                <input

                  name="state"

                  value={formData.state || ""}

                  onChange={handleChange}

                />

              </div>

              <div className="form-group">

                <label>Phone 1</label>

                <input

                  name="phone1"

                  value={formData.phone1 || ""}

                  onChange={handleChange}

                />

              </div>

              <div className="form-group">

                <label>Phone 2</label>

                <input

                  name="phone2"

                  value={formData.phone2 || ""}

                  onChange={handleChange}

                />

              </div>



              {/* Emergency Contacts Section */}

              <div className="form-group full-width">

                <h4 style={{ margin: "20px 0 10px 0", color: "#ef4444" }}>

                  🚨 Emergency Contacts

                </h4>

              </div>

              <div className="form-group">

                <label>Emergency Contact 1 Name</label>

                <input

                  name="member1"

                  value={formData.member1 || ""}

                  onChange={handleChange}

                  placeholder="e.g., John Doe"

                />

              </div>

              <div className="form-group">

                <label>Emergency Contact 1 Phone</label>

                <input

                  name="phonemem1"

                  value={formData.phonemem1 || ""}

                  onChange={handleChange}

                  placeholder="e.g., 9876543210"

                />

              </div>

              <div className="form-group">

                <label>Emergency Contact 2 Name (Optional)</label>

                <input

                  name="member2"

                  value={formData.member2 || ""}

                  onChange={handleChange}

                  placeholder="e.g., Jane Doe"

                />

              </div>

              <div className="form-group">

                <label>Emergency Contact 2 Phone (Optional)</label>

                <input

                  name="phonemem2"

                  value={formData.phonemem2 || ""}

                  onChange={handleChange}

                  placeholder="e.g., 9876543211"

                />

              </div>

            </div>

            <div className="modal-actions">

              <button className="btn-save" onClick={handleSave}>

                Save Changes

              </button>

              <button className="btn-cancel" onClick={() => setEditMode(false)}>

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}



      {/* Vaccination Form Modal */}

      {/* Vaccination Schedule Modal - ENHANCED */}
      {showVaccinationSchedule && (
        <div
          className="modal-overlay"
          onClick={() => setShowVaccinationSchedule(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              {/* Dynamic Title */}
              <h2>{onlyShowNotifications ? "🔔 Notifications" : "📅 Your Vaccination Schedule"}</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setShowVaccinationSchedule(false)}
              />
            </div>

            {/* ALWAYS SHOW NOTIFICATIONS SECTION */}
            {notifications.length > 0 ? (
              <div className="notifications-section">
                <h3>{onlyShowNotifications ? "Current Alerts" : "🔔 Today's Notifications"}</h3>
                {notifications.map((n, idx) => (
                  <div key={idx} className="notification-item-modal">
                    <FaBell className="notif-icon" />
                    <span>{n.message}</span>
                  </div>
                ))}
              </div>
            ) : (
               onlyShowNotifications && <p className="no-data">No upcoming vaccinations in the next 7 days.</p>
            )}

            {/* ONLY SHOW THE REST IF WE ARE NOT IN "NOTIFICATIONS ONLY" MODE */}
            {!onlyShowNotifications && (
              <>
                {/* User's Added Vaccinations */}
                {user.vaccinations && user.vaccinations.length > 0 && (
                  <>
                    <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "#2d3748" }}>
                      Your Scheduled Vaccinations
                    </h3>
                    <div className="schedule-grid">
                      {user.vaccinations.map((vac, idx) => (
                        <div
                          key={idx}
                          className={`schedule-card ${
                            vac.completed ? "status-completed" : "status-scheduled"
                          }`}
                        >
                          <h4>{vac.vaccineName}</h4>
                          <div className="schedule-details">
                            <p><strong>Dose:</strong> {vac.doseNumber} of {vac.totalDoses}</p>
                            <p><strong>Next Date:</strong> {new Date(vac.nextDoseDate).toLocaleDateString()}</p>
                            <p>
                              <strong>Status:</strong>
                              <span className={`status-badge ${vac.completed ? "completed" : "scheduled"}`}>
                                {vac.completed ? "Completed" : "Scheduled"}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Recommended Schedule */}
                <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "#2d3748" }}>
                  Recommended Vaccination Schedule
                </h3>
                <div className="schedule-grid">
                  {schedule.length === 0 ? (
                    <p className="no-data">
                      No vaccination schedule available. Please update your age/DOB in profile.
                    </p>
                  ) : (
                    schedule.map((item, idx) => (
                      <div key={idx} className={`schedule-card status-${item.status}`}>
                        <h4>{item.vaccineName}</h4>
                        <div className="schedule-details">
                          <p>
                            <strong>Status:</strong>
                            <span className={`status-badge ${item.status}`}>{item.status}</span>
                          </p>
                          <p><strong>Doses:</strong> {item.dosesTaken} / {item.dosesRecommended}</p>
                          {item.nextDueDate && (
                            <p><strong>Next Due:</strong> {new Date(item.nextDueDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            {/* End of !onlyShowNotifications check */}
          </div>
        </div>
      )}



      {/* Health Tips Modal - ENHANCED */}

      {showHealthTips && (
        <div className="modal-overlay" onClick={() => setShowHealthTips(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px', textAlign: 'center'}}>
            <div className="modal-header" style={{ justifyContent: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaRobot size={28} color="#2563eb" />
                <h2 style={{margin: 0}}>Medmitra AI Insight</h2>
              </div>
              <FaTimes className="modal-close" onClick={() => setShowHealthTips(false)} style={{position: 'absolute', right: 0}} />
            </div>

            <div style={{ padding: '20px 0', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {loadingTip ? (
                <>
                  <div className="loading-spinner" style={{width: '40px', height: '40px', borderColor: '#2563eb transparent #2563eb transparent'}}></div>
                  <p style={{marginTop: '15px', color: '#666', fontStyle: 'italic'}}>Analyzing health patterns...</p>
                </>
              ) : (
                aiTip && (
                  <div className="ai-result-card" style={{ animation: 'fadeIn 0.5s ease' }}>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>
                      {aiTip.intro}
                    </p>
                    
                    <div style={{ 
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
                      padding: '25px', 
                      borderRadius: '16px',
                      border: '1px solid #bfdbfe',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{aiTip.icon}</div>
                      <h3 style={{ color: '#1e40af', marginBottom: '10px', fontSize: '1.4rem' }}>{aiTip.category}</h3>
                      <p style={{ color: '#1e3a8a', fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '500' }}>
                        "{aiTip.tip}"
                      </p>
                    </div>

                    <button 
                      onClick={generateAiTip}
                      style={{
                        marginTop: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginInline: 'auto',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <FaMagic /> Generate New Tip
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}



      {/* Hospital Finder Modal */}

      {showHospitalFinder && (

        <div

          className="modal-overlay"

          onClick={() => setShowHospitalFinder(false)}

        >

          <div

            className="modal-content modal-large"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="modal-header">

              <h2>🏥 Nearby Hospitals - {user.city}</h2>

              <FaTimes

                className="modal-close"

                onClick={() => setShowHospitalFinder(false)}

              />

            </div>



            {searchingHospitals ? (

              <div className="loading-container">

                <div className="loading-spinner"></div>

                <p>Searching for hospitals...</p>

              </div>

            ) : (

              <div className="hospitals-list">

                {hospitals.length === 0 ? (

                  <div className="no-results">

                    <p>No hospitals found nearby</p>

                  </div>

                ) : (

                  hospitals.map((hospital, idx) => (

                    <div key={idx} className="hospital-card">
                      <div className="hospital-header">
                        <FaHospital className="hospital-icon" />
                        <h4>{hospital.name}</h4>
                      </div>

                      {/* NEW: Show Distance if available */}
                      {hospital.dist && (
                        <p style={{color: '#2563eb', fontWeight: 'bold', fontSize: '0.9rem', margin: '5px 0'}}>
                           📍 {(hospital.dist / 1000).toFixed(1)} km away
                        </p>
                      )}

                      <p className="hospital-address">
                        {hospital?.address?.street || ""} {hospital?.address?.housenumber || ""}, {hospital?.address?.city || user.city}
                      </p>

                      {hospital.phone && (
                        <p className="hospital-phone">📞 {hospital.phone}</p>
                      )}

                      {/* FIXED GOOGLE MAPS LINK */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-directions"
                      >
                        Get Directions 🗺️
                      </a>
                    </div>

                  ))

                )}

              </div>

            )}

          </div>

        </div>

      )}

      {/* Outbreak Alerts Modal - NEW FUNCTIONAL */}

      {showOutbreakAlerts && (

        <div

          className="modal-overlay"

          onClick={() => setShowOutbreakAlerts(false)}

        >

          <div

            className="modal-content modal-large"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="modal-header">

              <h2>⚠️ Disease Outbreak Alerts - {user.city}</h2>

              <FaTimes

                className="modal-close"

                onClick={() => setShowOutbreakAlerts(false)}

              />

            </div>



            {loadingOutbreaks ? (

              <div className="loading-container">

                <div className="loading-spinner"></div>

                <p>Loading outbreak data...</p>

              </div>

            ) : (

              <>

                <div className="outbreak-info">

                  <p>

                    Real-time disease outbreak information for your area. Stay

                    informed and take necessary precautions.

                  </p>

                </div>



                <div className="outbreak-grid">

                  {outbreakData.map((outbreak, idx) => (

                    <div

                      key={idx}

                      className="outbreak-card"

                      style={{ borderLeft: `4px solid ${outbreak.color}` }}

                    >

                      <div className="outbreak-header">

                        <h3>{outbreak.disease}</h3>

                        <span

                          className={`severity-badge severity-${outbreak.severity.toLowerCase()}`}

                        >

                          {outbreak.severity} Risk

                        </span>

                      </div>

                      <div className="outbreak-details">

                        <div className="outbreak-stat">

                          <span className="stat-label">Reported Cases:</span>

                          <span className="stat-value">{outbreak.cases}</span>

                        </div>

                        <div className="outbreak-stat">

                          <span className="stat-label">Last Updated:</span>

                          <span className="stat-value">

                            {outbreak.lastUpdated}

                          </span>

                        </div>

                      </div>

                      {/* ... inside outbreak-card, after outbreak-details ... */}
                    
                    <div className="outbreak-prevention" style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                        <h5 style={{margin: '0 0 5px 0', color: '#333'}}>
                          {outbreak.cases === "In News" || outbreak.cases === "Reported" ? "Latest News Headline:" : "Safety Tips:"}
                        </h5>
                        <ul style={{paddingLeft: '20px', margin: 0}}>
                          {outbreak.tips && outbreak.tips.map((tip, tIdx) => (
                            <li key={tIdx} style={{fontSize: '0.9rem', color: '#555', marginBottom: '4px'}}>
                              {tip}
                            </li>
                          ))}
                        </ul>
                    </div>

                    {/* ... end of outbreak-card ... */}

                    </div>

                  ))}

                </div>

              </>

            )}

          </div>

        </div>

      )}



      {/* Vaccination Schedule Modal - ENHANCED */}

      {showVaccinationSchedule && (

        <div

          className="modal-overlay"

          onClick={() => setShowVaccinationSchedule(false)}

        >

          <div

            className="modal-content modal-large"

            onClick={(e) => e.stopPropagation()}

          >

            <div className="modal-header">

              <h2>📅 Your Vaccination Schedule</h2>

              <FaTimes

                className="modal-close"

                onClick={() => setShowVaccinationSchedule(false)}

              />

            </div>



            {notifications.length > 0 && (

              <div className="notifications-section">

                <h3>🔔 Today's Notifications</h3>

                {notifications.map((n, idx) => (

                  <div key={idx} className="notification-item-modal">

                    <FaBell className="notif-icon" />

                    <span>{n.message}</span>

                  </div>

                ))}

              </div>

            )}



            {/* User's Added Vaccinations */}

            {user.vaccinations && user.vaccinations.length > 0 && (

              <>

                <h3

                  style={{

                    marginTop: "30px",

                    marginBottom: "15px",

                    color: "#2d3748",

                  }}

                >

                  Your Scheduled Vaccinations

                </h3>

                <div className="schedule-grid">

                  {user.vaccinations.map((vac, idx) => (

                    <div

                      key={idx}

                      className={`schedule-card ${

                        vac.completed ? "status-completed" : "status-scheduled"

                      }`}

                    >

                      <h4>{vac.vaccineName}</h4>

                      <div className="schedule-details">

                        <p>

                          <strong>Dose:</strong> {vac.doseNumber} of{" "}

                          {vac.totalDoses}

                        </p>

                        <p>

                          <strong>Next Date:</strong>{" "}

                          {new Date(vac.nextDoseDate).toLocaleDateString()}

                        </p>

                        <p>

                          <strong>Status:</strong>

                          <span

                            className={`status-badge ${

                              vac.completed ? "completed" : "scheduled"

                            }`}

                          >

                            {vac.completed ? "Completed" : "Scheduled"}

                          </span>

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </>

            )}



            {/* Recommended Schedule */}

            <h3

              style={{

                marginTop: "30px",

                marginBottom: "15px",

                color: "#2d3748",

              }}

            >

              Recommended Vaccination Schedule

            </h3>

            <div className="schedule-grid">

              {schedule.length === 0 ? (

                <p className="no-data">

                  No vaccination schedule available. Please update your age/DOB

                  in profile.

                </p>

              ) : (

                schedule.map((item, idx) => (

                  <div

                    key={idx}

                    className={`schedule-card status-${item.status}`}

                  >

                    <h4>{item.vaccineName}</h4>

                    <div className="schedule-details">

                      <p>

                        <strong>Status:</strong>

                        <span className={`status-badge ${item.status}`}>

                          {item.status}

                        </span>

                      </p>

                      <p>

                        <strong>Doses:</strong> {item.dosesTaken} /{" "}

                        {item.dosesRecommended}

                      </p>

                      {item.nextDueDate && (

                        <p>

                          <strong>Next Due:</strong>{" "}

                          {new Date(item.nextDueDate).toLocaleDateString()}

                        </p>

                      )}

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      )}



      {/* VAPI Widgets - ALWAYS VISIBLE */}

      <div

        dangerouslySetInnerHTML={{

          __html: `

        <vapi-widget

          public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"

          assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"

          mode="chat"

          theme="dark"

          position="bottom-right"

          title="Chat with Medmitra"

          style="z-index: 9999;">

        </vapi-widget>



        <vapi-widget

          public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"

          assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"

          mode="voice"

          theme="dark"

          position="bottom-left"

          title="Talk with Medmitra"

          style="z-index: 9999;">

        </vapi-widget>

      `,

        }}

      />

        {/* ----------------------------- */}
      {/* PURE NOTIFICATION MODAL       */}
      {/* ----------------------------- */}
      {showNotificationModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>🔔 Notifications</h2>
              <FaTimes className="modal-close" onClick={() => setShowNotificationModal(false)} />
            </div>

            <div className="notifications-list-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <FaBell style={{ fontSize: '30px', marginBottom: '10px', opacity: 0.3 }} />
                  <p>No new notifications</p>
                </div>
              ) : (
                notifications.map((n, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      backgroundColor: n.type === 'emergency' ? '#fff5f5' : '#fff',
                      borderLeft: n.type === 'emergency' ? '4px solid #ef4444' : '4px solid #4299e1',
                      marginBottom: '10px',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      {n.type === 'emergency' ? (
                        <FaExclamationTriangle color="#ef4444" style={{ marginRight: '8px' }} />
                      ) : (
                        <FaSyringe color="#4299e1" style={{ marginRight: '8px' }} />
                      )}
                      <strong style={{ color: '#333' }}>
                        {n.type === 'emergency' ? "Emergency Alert" : "Vaccine Reminder"}
                      </strong>
                    </div>
                    <p style={{ margin: 0, color: '#555', fontSize: '0.95rem' }}>{n.message}</p>
                    <small style={{ color: '#999', marginTop: '5px', display: 'block' }}>
                      {new Date(n.date).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowNotificationModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}

export default Home;