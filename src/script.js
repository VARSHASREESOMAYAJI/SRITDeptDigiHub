// Default Data
const defaultUsers = [
  { email: "224g1a0501@srit.ac.in", password: "1234", role: "student", name: "Abhilash" },
  { email: "224g1a0502@srit.ac.in", password: "1234", role: "student", name: "Akhila" },
  { email: "224g1a0503@srit.ac.in", password: "1234", role: "student", name: "Abignaya" },
  { email: "224g1a0504@srit.ac.in", password: "1234", role: "student", name: "Rahul" },
  { email: "224g1a0505@srit.ac.in", password: "1234", role: "student", name: "Sneha" },
  { email: "224g1a0506@srit.ac.in", password: "1234", role: "student", name: "Vikram" },
  { email: "224g1a0507@srit.ac.in", password: "1234", role: "student", name: "Priya" },
  { email: "224g1a0508@srit.ac.in", password: "1234", role: "student", name: "Arjun" },
  { email: "224g1a0509@srit.ac.in", password: "1234", role: "student", name: "Divya" },
  { email: "224g1a0510@srit.ac.in", password: "1234", role: "student", name: "Karthik" },
  { email: "kavitha@srit.ac.in", password: "1234", role: "faculty", name: "Kavitha" },
  { email: "lokesh@srit.ac.in", password: "1234", role: "faculty", name: "Lokesh" },
  { email: "narsimha@srit.ac.in", password: "1234", role: "faculty", name: "Narsimha" },
  { email: "veeraprakash@srit.ac.in", password: "1234", role: "hod", name: "Dr. Veera Prakash" },
  { email: "admin@srit.ac.in", password: "admin123", role: "admin", name: "Admin" }
];

const defaultAnnouncements = [
  { id: 1, title: "Mid Exams Schedule Released", desc: "Check portal for timetable", date: "2026-04-01" },
  { id: 2, title: "Project Review on Monday", desc: "Prepare PPT", date: "2026-04-03" },
  { id: 3, title: "Hackathon Registration Open", desc: "Register before deadline", date: "2026-04-05" }
];

const defaultAttendance = {
  "224g1a0501@srit.ac.in": { "Data Structures": "85%", "Operating Systems": "90%", "DBMS": "82%" },
  "224g1a0502@srit.ac.in": { "Data Structures": "92%", "Operating Systems": "88%", "DBMS": "95%" },
  "224g1a0503@srit.ac.in": { "Data Structures": "78%", "Operating Systems": "75%", "DBMS": "80%" },
  "224g1a0504@srit.ac.in": { "Data Structures": "88%", "Operating Systems": "85%", "DBMS": "90%" },
  "224g1a0505@srit.ac.in": { "Data Structures": "95%", "Operating Systems": "92%", "DBMS": "98%" },
  "224g1a0506@srit.ac.in": { "Data Structures": "82%", "Operating Systems": "80%", "DBMS": "85%" },
  "224g1a0507@srit.ac.in": { "Data Structures": "90%", "Operating Systems": "88%", "DBMS": "92%" },
  "224g1a0508@srit.ac.in": { "Data Structures": "87%", "Operating Systems": "85%", "DBMS": "89%" },
  "224g1a0509@srit.ac.in": { "Data Structures": "91%", "Operating Systems": "90%", "DBMS": "93%" },
  "224g1a0510@srit.ac.in": { "Data Structures": "84%", "Operating Systems": "82%", "DBMS": "86%" }
};

// Initialize LocalStorage
function initStorage() {
  // Migration: If existing users have "Student X" names, update them
  const existingUsers = JSON.parse(localStorage.getItem("users"));
  if (existingUsers && existingUsers.some(u => u.name.startsWith("Student "))) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem("announcements")) {
    localStorage.setItem("announcements", JSON.stringify(defaultAnnouncements));
  }
  if (!localStorage.getItem("attendance")) {
    localStorage.setItem("attendance", JSON.stringify(defaultAttendance));
  }
  if (!localStorage.getItem("leaves")) {
    localStorage.setItem("leaves", JSON.stringify([]));
  }
  if (!localStorage.getItem("activities")) {
    localStorage.setItem("activities", JSON.stringify([
      { text: "System initialized", time: new Date().toLocaleString(), email: "system" }
    ]));
  }
  if (!localStorage.getItem("messages")) {
    localStorage.setItem("messages", JSON.stringify([]));
  }
}

function logActivity(text) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.unshift({ 
    text, 
    time: new Date().toLocaleString(), 
    email: currentUser ? currentUser.email : "system" 
  });
  localStorage.setItem("activities", JSON.stringify(activities.slice(0, 20))); // Keep last 20
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white z-[1000] transition-all duration-300 transform translate-y-10 opacity-0 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 100);
  
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

initStorage();

// State Management
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// DOM Elements
const appRoot = document.getElementById("app-root");

// Router / View Switcher
window.renderView = function(viewName) {
  appRoot.innerHTML = "";
  
  if (viewName === "landing") {
    renderLanding();
  } else if (viewName === "login") {
    renderLogin();
  } else if (viewName === "dashboard") {
    if (!currentUser) return window.renderView("login");
    renderDashboard();
  }
}

const renderView = window.renderView;

// Views
function renderLanding() {
  appRoot.innerHTML = `
    <div class="landing-page">
      <header class="hero">
        <div class="floating-elements">
          <div class="floating-item" style="left: 10%; animation-delay: 0s; font-size: 40px;">📚</div>
          <div class="floating-item" style="left: 30%; animation-delay: 5s; font-size: 30px;">💻</div>
          <div class="floating-item" style="left: 50%; animation-delay: 2s; font-size: 45px;">📖</div>
          <div class="floating-item" style="left: 70%; animation-delay: 8s; font-size: 35px;">🎓</div>
          <div class="floating-item" style="left: 90%; animation-delay: 4s; font-size: 40px;">📝</div>
        </div>
        <div class="hero-content">
          <h1>SRIT Digital Hub</h1>
          <p>Empowering Knowledge through a Centralized Academic Communication & Smart Management System.</p>
          <div class="flex gap-4">
            <button class="btn btn-primary" onclick="renderView('login')">Login to Portal</button>
            <button class="btn btn-outline" onclick="document.getElementById('features').scrollIntoView({behavior: 'smooth'})">Explore Features</button>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://tse1.mm.bing.net/th/id/OIP.dYB0VtikKLrlVBD4Q9x69gHaIL?rs=1&pid=ImgDetMain&o=7&rm=3" alt="SRIT Logo" class="w-full max-w-[450px] h-auto object-contain drop-shadow-2xl" onerror="this.src='https://picsum.photos/seed/srit/450/450';this.onerror=null;" referrerPolicy="no-referrer">
        </div>
      </header>

      <section id="features">
        <h2 class="text-center text-3xl mb-10">Smart Features</h2>
        <div class="features-grid">
          <div class="card">
            <div class="card-icon"><i data-lucide="calendar"></i></div>
            <h3>Attendance Tracking</h3>
            <p>Real-time attendance monitoring for students and faculty.</p>
          </div>
          <div class="card">
            <div class="card-icon"><i data-lucide="file-text"></i></div>
            <h3>Leave Management</h3>
            <p>Seamless leave application and approval workflow.</p>
          </div>
          <div class="card">
            <div class="card-icon"><i data-lucide="megaphone"></i></div>
            <h3>Announcements</h3>
            <p>Instant updates and official notices at your fingertips.</p>
          </div>
        </div>
      </section>

      <section id="roles" class="bg-gray-50">
        <h2 class="text-center text-3xl mb-10">User Roles</h2>
        <div class="roles-grid">
          <div class="card text-center">
            <h3>Student</h3>
            <p>Access notes, track attendance, and apply for leaves.</p>
          </div>
          <div class="card text-center">
            <h3>Faculty</h3>
            <p>Manage attendance and review student requests.</p>
          </div>
          <div class="card text-center">
            <h3>HOD</h3>
            <p>Department-wide oversight and administrative approvals.</p>
          </div>
          <div class="card text-center">
            <h3>Admin</h3>
            <p>System configuration and user management.</p>
          </div>
        </div>
      </section>

      <footer class="py-10 text-center border-t border-gray-100">
        <p class="text-gray-500">SRIT College of Engineering - Department Digital Hub</p>
      </footer>
    </div>
  `;
  lucide.createIcons();
}

function renderLogin() {
  appRoot.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <img src="https://www.srit.ac.in/wp-content/uploads/2021/08/logo.png" alt="SRIT Logo" class="w-24 h-24 mx-auto mb-4 object-contain" onerror="this.src='https://picsum.photos/seed/srit/100/100';this.onerror=null;" referrerPolicy="no-referrer">
        <h2 class="text-2xl mb-2">Welcome Back</h2>
        <p class="text-gray-500 mb-6 text-sm">Login using institutional email ID (@srit.ac.in)</p>
        
        <form id="login-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="login-email" class="form-control" placeholder="name@srit.ac.in" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary w-full mt-4">Login to Dashboard</button>
        </form>
        
        <div class="mt-6">
          <a href="#" onclick="renderView('landing')" class="text-sm text-orange-600 hover:underline">Back to Home</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users"));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      logActivity(`${user.name} logged in`);
      renderView("dashboard");
    } else {
      alert("Invalid credentials. Please use your institutional ID.");
    }
  });
}

function renderDashboard() {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', roles: ['student', 'faculty', 'hod', 'admin'] },
    { id: 'attendance', label: 'Attendance', icon: 'calendar-check', roles: ['student', 'faculty', 'hod'] },
    { id: 'leave', label: 'Leave Management', icon: 'file-clock', roles: ['student', 'faculty', 'hod'] },
    { id: 'announcements', label: 'Announcements', icon: 'megaphone', roles: ['student', 'faculty', 'hod', 'admin'] },
    { id: 'messages', label: 'Messages', icon: 'message-square', roles: ['student', 'faculty', 'hod'] },
    { id: 'notes', label: 'Notes', icon: 'book-open', roles: ['student'] },
    { id: 'ai-doubt', label: 'AI Doubt', icon: 'sparkles', roles: ['student'] },
    { id: 'profile', label: 'Profile', icon: 'user', roles: ['student', 'faculty', 'hod', 'admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  appRoot.innerHTML = `
    <div class="app-container">
      <aside class="sidebar">
        <div class="sidebar-logo flex items-center gap-2">
          <img src="https://www.srit.ac.in/wp-content/uploads/2021/08/logo.png" alt="Logo" class="w-8 h-8 object-contain" onerror="this.style.display='none'" referrerPolicy="no-referrer">
          <span>DDH PORTAL</span>
        </div>
        <nav class="flex-1">
          ${filteredMenu.map(item => `
            <div class="nav-item ${item.id === 'dashboard' ? 'active' : ''}" onclick="switchTab('${item.id}', this)">
              <i data-lucide="${item.icon}"></i> ${item.label}
            </div>
          `).join('')}
        </nav>
        <div class="px-6 mt-auto">
          <button class="btn btn-outline w-full" onclick="logout()">
            <i data-lucide="log-out"></i> Logout
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="navbar">
          <h2 id="page-title">Dashboard</h2>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onclick="switchTab('profile')">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold leading-none">${currentUser.name}</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider">${currentUser.role}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                ${currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div id="tab-content" class="content-area">
          <!-- Content injected here -->
        </div>
      </main>
    </div>
  `;
  lucide.createIcons();
  switchTab('dashboard');
}

window.switchTab = function(tabName, element) {
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    // If element is provided, use it. Otherwise find by text or data attribute.
    // Since we don't have data attributes, we can check the onclick attribute or text.
    if (element) {
      if (item === element) item.classList.add('active');
    } else {
      if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(`'${tabName}'`)) {
        item.classList.add('active');
      }
    }
  });
  
  const title = document.getElementById("page-title");
  const content = document.getElementById("tab-content");
  
  title.innerText = tabName.charAt(0).toUpperCase() + tabName.slice(1).replace('-', ' ');
  
  switch(tabName) {
    case 'dashboard': renderDashboardTab(content); break;
    case 'attendance': renderAttendanceTab(content); break;
    case 'leave': renderLeaveTab(content); break;
    case 'announcements': renderAnnouncementsTab(content); break;
    case 'messages': renderMessagesTab(content); break;
    case 'notes': renderNotesTab(content); break;
    case 'ai-doubt': renderAIDoubtTab(content); break;
    case 'profile': renderProfileTab(content); break;
  }
  lucide.createIcons();
}

const switchTab = window.switchTab;

function renderDashboardTab(container) {
  const attendanceData = JSON.parse(localStorage.getItem("attendance"));
  const announcements = JSON.parse(localStorage.getItem("announcements"));
  const leaves = JSON.parse(localStorage.getItem("leaves"));
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  const users = JSON.parse(localStorage.getItem("users"));

  // Filter activities: Students see only their own, Staff see all
  const filteredActivities = currentUser.role === 'student' 
    ? activities.filter(a => a.email === currentUser.email || a.email === 'system')
    : activities;

  let stats = [];
  if (currentUser.role === 'student') {
    const myAttObj = attendanceData[currentUser.email] || {};
    const subCount = Object.keys(myAttObj).length;
    const avgAtt = subCount > 0 
      ? Math.round(Object.values(myAttObj).reduce((a, b) => a + parseInt(b), 0) / subCount) + "%"
      : "N/A";
    
    const myLeaves = leaves.filter(l => l.email === currentUser.email);
    stats = [
      { label: 'Avg Attendance', value: avgAtt, icon: 'user-check', color: 'text-orange-500' },
      { label: 'Total Leaves', value: myLeaves.length, icon: 'file-text', color: 'text-blue-500' },
      { label: 'Announcements', value: announcements.length, icon: 'megaphone', color: 'text-green-500' },
      { label: 'Status', value: 'Active', icon: 'activity', color: 'text-purple-500' }
    ];
  } else if (currentUser.role === 'faculty' || currentUser.role === 'hod') {
    const students = users.filter(u => u.role === 'student');
    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    stats = [
      { label: 'Total Students', value: students.length, icon: 'users', color: 'text-orange-500' },
      { label: 'Pending Leaves', value: pendingLeaves.length, icon: 'clock', color: 'text-blue-500' },
      { label: 'Announcements', value: announcements.length, icon: 'megaphone', color: 'text-green-500' },
      { label: 'Active Sessions', value: '4', icon: 'monitor', color: 'text-purple-500' }
    ];
  } else if (currentUser.role === 'admin') {
    stats = [
      { label: 'Total Users', value: users.length, icon: 'users', color: 'text-orange-500' },
      { label: 'Announcements', value: announcements.length, icon: 'megaphone', color: 'text-green-500' },
      { label: 'System Status', value: 'Healthy', icon: 'shield-check', color: 'text-blue-500' },
      { label: 'Active Admins', value: '1', icon: 'user-cog', color: 'text-purple-500' }
    ];
  }

  const quickActions = [];
  if (currentUser.role === 'student') {
    quickActions.push({ label: 'Apply Leave', tab: 'leave', style: 'btn-primary' });
    quickActions.push({ label: 'Chat', tab: 'messages', style: 'btn-outline' });
    quickActions.push({ label: 'Edit Profile', tab: 'profile', style: 'btn-outline' });
  } else if (currentUser.role === 'hod' || currentUser.role === 'admin') {
    quickActions.push({ label: 'Post Notice', tab: 'announcements', style: 'btn-primary' });
    if (currentUser.role === 'hod') quickActions.push({ label: 'Messages', tab: 'messages', style: 'btn-outline' });
  } else if (currentUser.role === 'faculty') {
    quickActions.push({ label: 'Review Leaves', tab: 'leave', style: 'btn-primary' });
    quickActions.push({ label: 'Messages', tab: 'messages', style: 'btn-outline' });
    quickActions.push({ label: 'Update Attendance', tab: 'attendance', style: 'btn-outline' });
  }

  container.innerHTML = `
    <h3 class="text-xl mb-6">Welcome, ${currentUser.name}</h3>
    
    <div class="stats-grid">
      ${stats.map(stat => `
        <div class="stat-card">
          <div class="${stat.color}"><i data-lucide="${stat.icon}"></i></div>
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `).join('')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h4 class="mb-4">Recent Activity</h4>
        <div class="space-y-4">
          ${filteredActivities.length === 0 ? '<p class="text-sm text-gray-400">No recent activity</p>' : filteredActivities.map(act => `
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><i data-lucide="clock" class="w-4"></i></div>
              <div>
                <p class="font-medium">${act.text}</p>
                <p class="text-xs text-gray-400">${act.time}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <h4 class="mb-4">Quick Actions</h4>
        <div class="flex flex-wrap gap-3">
          ${quickActions.map(action => `
            <button class="btn ${action.style} btn-sm" onclick="switchTab('${action.tab}')">${action.label}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAttendanceTab(container) {
  const attendanceData = JSON.parse(localStorage.getItem("attendance"));
  const users = JSON.parse(localStorage.getItem("users"));
  const subjects = ["Data Structures", "Operating Systems", "DBMS"];
  
  if (currentUser.role === 'student') {
    const myAtt = attendanceData[currentUser.email] || {};
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${subjects.map(sub => `
          <div class="card text-center">
            <div class="text-orange-500 mb-4"><i data-lucide="book" class="w-10 h-10 mx-auto"></i></div>
            <h4 class="text-lg font-bold mb-1">${sub}</h4>
            <div class="text-4xl font-extrabold text-orange-600 mb-2">${myAtt[sub] || "0%"}</div>
            <div class="w-full bg-gray-100 rounded-full h-2 mt-4">
              <div class="bg-orange-500 h-2 rounded-full" style="width: ${myAtt[sub] || "0%"}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card mt-6 text-center">
        <p class="text-gray-500">Keep your attendance above 75% in all subjects to stay eligible for exams.</p>
      </div>
    `;
  } else if (currentUser.role === 'faculty' || currentUser.role === 'hod') {
    container.innerHTML = `
      <div class="card mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="">Update Student Attendance</h3>
          <select id="subject-selector" class="form-control w-64" onchange="window.lastSelectedSubject=this.value; renderAttendanceTab(document.getElementById('tab-content'))">
            ${subjects.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
          </select>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Current %</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="attendance-table-body">
              ${users.filter(u => u.role === 'student').map(s => {
                const selectedSub = window.lastSelectedSubject || subjects[0];
                const currentVal = (attendanceData[s.email] && attendanceData[s.email][selectedSub]) || '0%';
                return `
                  <tr>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td><input type="text" class="form-control w-24" value="${currentVal}" id="att-${s.email.replace(/[@.]/g, '-')}"></td>
                    <td><button class="btn btn-primary btn-sm" onclick="updateAttendance('${s.email}', '${selectedSub}')">Update</button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    // Set the selector value if it was already set
    if (window.lastSelectedSubject) {
      document.getElementById('subject-selector').value = window.lastSelectedSubject;
    }
    lucide.createIcons();
  } else {
    container.innerHTML = `<div class="card text-center py-10 text-gray-400">You do not have permission to view this section.</div>`;
  }
}

window.updateAttendance = (email, subject) => {
  const inputId = `att-${email.replace(/[@.]/g, '-')}`;
  const newValue = document.getElementById(inputId).value;
  const attendance = JSON.parse(localStorage.getItem("attendance"));
  if (!attendance[email]) attendance[email] = {};
  attendance[email][subject] = newValue;
  localStorage.setItem("attendance", JSON.stringify(attendance));
  logActivity(`Attendance updated for ${email} in ${subject} to ${newValue}`);
  showToast(`Attendance updated for ${email}`);
  window.lastSelectedSubject = subject;
  renderAttendanceTab(document.getElementById('tab-content'));
};

function renderLeaveTab(container) {
  const leaves = JSON.parse(localStorage.getItem("leaves"));
  
  let formHtml = '';
  if (currentUser.role === 'student') {
    formHtml = `
      <div class="card mb-8">
        <h3 class="mb-4">Apply for Leave</h3>
        <form id="leave-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="leave-name" class="form-control" value="${currentUser.name}" readonly>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" id="leave-date" class="form-control" required>
          </div>
          <div class="form-group md:col-span-2">
            <label>Reason</label>
            <input type="text" id="leave-reason" class="form-control" placeholder="Medical, Personal, etc." required>
          </div>
          <div class="md:col-span-2">
            <button type="submit" class="btn btn-primary">Submit Application</button>
          </div>
        </form>
      </div>
    `;
  }

  const filteredLeaves = currentUser.role === 'student' 
    ? leaves.filter(l => l.email === currentUser.email)
    : (currentUser.role === 'faculty' || currentUser.role === 'hod' ? leaves : []);

  if (currentUser.role === 'admin') {
    container.innerHTML = `<div class="card text-center py-10 text-gray-400">You do not have permission to view this section.</div>`;
    return;
  }

  container.innerHTML = `
    ${formHtml}
    <div class="card">
      <h3 class="mb-4">Leave Requests</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              ${(currentUser.role === 'faculty' || currentUser.role === 'hod') ? '<th>Action</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${filteredLeaves.length === 0 ? '<tr><td colspan="5" class="text-center py-10 text-gray-400">No leave requests found</td></tr>' : ''}
            ${filteredLeaves.map((l, index) => `
              <tr>
                <td>${l.name}</td>
                <td>${l.date}</td>
                <td>${l.reason}</td>
                <td><span class="badge badge-${l.status.toLowerCase()}">${l.status}</span></td>
                ${(currentUser.role === 'faculty' || currentUser.role === 'hod') ? `
                  <td class="flex gap-2">
                    ${l.status === 'Pending' ? `
                      <button class="btn btn-primary btn-sm" onclick="updateLeaveStatus(${index}, 'Approved')">Approve</button>
                      <button class="btn btn-outline btn-sm" onclick="updateLeaveStatus(${index}, 'Rejected')">Reject</button>
                    ` : '-'}
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (currentUser.role === 'student') {
    document.getElementById("leave-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const newLeave = {
        email: currentUser.email,
        name: currentUser.name,
        date: document.getElementById("leave-date").value,
        reason: document.getElementById("leave-reason").value,
        status: "Pending"
      };
      const leaves = JSON.parse(localStorage.getItem("leaves"));
      leaves.push(newLeave);
      localStorage.setItem("leaves", JSON.stringify(leaves));
      logActivity(`${currentUser.name} applied for leave on ${newLeave.date}`);
      showToast("Leave application submitted!");
      renderLeaveTab(container);
    });
  }
}

window.updateLeaveStatus = (index, status) => {
  const leaves = JSON.parse(localStorage.getItem("leaves"));
  const leave = leaves[index];
  leave.status = status;
  localStorage.setItem("leaves", JSON.stringify(leaves));
  logActivity(`Leave for ${leave.name} on ${leave.date} was ${status}`);
  showToast(`Leave request ${status}`);
  switchTab('leave');
};

function renderAnnouncementsTab(container) {
  const announcements = JSON.parse(localStorage.getItem("announcements"));
  
  let adminHtml = '';
  if (currentUser.role === 'hod' || currentUser.role === 'admin') {
    adminHtml = `
      <div class="card mb-6">
        <h3 class="mb-4">Post New Announcement</h3>
        <form id="announcement-form" class="space-y-4">
          <div class="form-group">
            <label>Title</label>
            <input type="text" id="ann-title" class="form-control" placeholder="Announcement Title" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="ann-desc" class="form-control" placeholder="Details..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Post Announcement</button>
        </form>
      </div>
    `;
  }

  container.innerHTML = `
    ${adminHtml}
    <div class="grid grid-cols-1 gap-4">
      ${announcements.map(a => `
        <div class="card">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg">${a.title}</h3>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400">${a.date}</span>
              ${(currentUser.role === 'hod' || currentUser.role === 'admin') ? `
                <button class="text-red-500 hover:text-red-700" onclick="deleteAnnouncement(${a.id})">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              ` : ''}
            </div>
          </div>
          <p class="text-gray-600">${a.desc}</p>
        </div>
      `).reverse().join('')}
    </div>
  `;

  if (currentUser.role === 'hod' || currentUser.role === 'admin') {
    document.getElementById("announcement-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const newAnn = {
        id: Date.now(),
        title: document.getElementById("ann-title").value,
        desc: document.getElementById("ann-desc").value,
        date: new Date().toISOString().split('T')[0]
      };
      const annList = JSON.parse(localStorage.getItem("announcements"));
      annList.push(newAnn);
      localStorage.setItem("announcements", JSON.stringify(annList));
      logActivity(`New announcement posted: ${newAnn.title}`);
      showToast("Announcement posted successfully!");
      renderAnnouncementsTab(container);
    });
  }
  lucide.createIcons();
}

window.deleteAnnouncement = (id) => {
  if (!confirm("Are you sure you want to delete this announcement?")) return;
  let annList = JSON.parse(localStorage.getItem("announcements"));
  annList = annList.filter(a => a.id !== id);
  localStorage.setItem("announcements", JSON.stringify(annList));
  logActivity(`Announcement deleted`);
  showToast("Announcement deleted", "error");
  switchTab('announcements');
};

function renderNotesTab(container) {
  const notes = [
    { title: "Data Structures Unit 1", type: "PDF", size: "2.4 MB" },
    { title: "Algorithm Analysis", type: "PPT", size: "5.1 MB" },
    { title: "Operating Systems Notes", type: "DOCX", size: "1.2 MB" },
    { title: "Database Management Systems", type: "PDF", size: "3.8 MB" }
  ];
  
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${notes.map(n => `
        <div class="card text-center">
          <div class="text-orange-500 mb-3"><i data-lucide="file-text" class="w-10 h-10 mx-auto"></i></div>
          <h4 class="text-sm mb-1">${n.title}</h4>
          <p class="text-xs text-gray-400">${n.type} • ${n.size}</p>
          <button class="btn btn-outline btn-sm w-full mt-4" onclick="downloadNote('${n.title}')">Download</button>
        </div>
      `).join('')}
    </div>
  `;
}

window.downloadNote = (title) => {
  showToast(`Downloading: ${title}`);
  logActivity(`Downloaded notes: ${title}`);
};

function renderAIDoubtTab(container) {
  container.innerHTML = `
    <div class="chat-container">
      <div class="chat-messages" id="chat-messages">
        <div class="mb-4">
          <div class="bg-gray-100 p-3 rounded-lg inline-block max-w-xs text-sm">
            Hello! I'm your AI Academic Assistant. How can I help you with your doubts today?
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" id="chat-input-field" class="form-control" placeholder="Type your doubt here...">
        <button class="btn btn-primary" onclick="sendMessage()">Send</button>
      </div>
    </div>
  `;
}

function renderMessagesTab(container) {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const users = JSON.parse(localStorage.getItem("users"));
  
  // Recipient logic
  let recipients = [];
  if (currentUser.role === 'student') {
    recipients = users.filter(u => u.role === 'faculty' || u.role === 'hod');
  } else if (currentUser.role === 'faculty') {
    recipients = users.filter(u => u.role === 'student');
  } else if (currentUser.role === 'hod') {
    recipients = users.filter(u => u.role === 'student' || u.role === 'faculty');
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <div class="card flex flex-col p-0 overflow-hidden">
        <div class="p-4 border-bottom font-bold bg-gray-50">Contacts</div>
        <div class="flex-1 overflow-y-auto">
          ${recipients.map(r => `
            <div class="p-4 border-bottom cursor-pointer hover:bg-orange-50 transition-colors flex items-center gap-3 recipient-item" onclick="selectRecipient('${r.email}', '${r.name}')">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">${r.name.charAt(0)}</div>
              <div>
                <p class="font-medium text-sm">${r.name}</p>
                <p class="text-xs text-gray-400">${r.role.toUpperCase()}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="lg:col-span-2 card flex flex-col p-0 overflow-hidden">
        <div id="chat-header" class="p-4 border-bottom font-bold bg-gray-50 flex items-center gap-3">
          Select a contact to start chatting
        </div>
        <div id="chat-messages-box" class="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
          <div class="text-center text-gray-400 mt-20">No messages yet</div>
        </div>
        <div id="chat-input-box" class="p-4 border-top bg-white flex gap-3 hidden">
          <input type="text" id="msg-input" class="form-control" placeholder="Type a message...">
          <button class="btn btn-primary" onclick="sendChatMessage()">Send</button>
        </div>
      </div>
    </div>
  `;
}

window.selectRecipient = (email, name) => {
  window.currentRecipient = { email, name };
  document.getElementById('chat-header').innerHTML = `
    <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">${name.charAt(0)}</div>
    Chatting with ${name}
  `;
  document.getElementById('chat-input-box').classList.remove('hidden');
  renderChatMessages();
  
  // Highlight selected
  document.querySelectorAll('.recipient-item').forEach(item => {
    item.classList.remove('bg-orange-100');
    if (item.innerText.includes(name)) item.classList.add('bg-orange-100');
  });
};

function renderChatMessages() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const chatBox = document.getElementById('chat-messages-box');
  const filtered = messages.filter(m => 
    (m.from === currentUser.email && m.to === window.currentRecipient.email) ||
    (m.from === window.currentRecipient.email && m.to === currentUser.email)
  );

  if (filtered.length === 0) {
    chatBox.innerHTML = `<div class="text-center text-gray-400 mt-20">Start the conversation with ${window.currentRecipient.name}</div>`;
    return;
  }

  chatBox.innerHTML = filtered.map(m => `
    <div class="flex ${m.from === currentUser.email ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[70%] p-3 rounded-lg text-sm ${m.from === currentUser.email ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white border text-gray-700 rounded-tl-none'}">
        ${m.text}
        <p class="text-[10px] mt-1 opacity-70">${m.time}</p>
      </div>
    </div>
  `).join('');
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.sendChatMessage = () => {
  const input = document.getElementById('msg-input');
  if (!input.value.trim()) return;

  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push({
    from: currentUser.email,
    to: window.currentRecipient.email,
    text: input.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  localStorage.setItem("messages", JSON.stringify(messages));
  input.value = '';
  renderChatMessages();
};

function renderProfileTab(container) {
  container.innerHTML = `
    <div class="card max-w-md mx-auto">
      <h3 class="mb-6">Edit Profile</h3>
      <form id="profile-form" class="space-y-4">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="profile-name" class="form-control" value="${currentUser.name}" required>
        </div>
        <div class="form-group">
          <label>Email (Institutional)</label>
          <input type="email" class="form-control bg-gray-50" value="${currentUser.email}" readonly>
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="text" class="form-control bg-gray-50" value="${currentUser.role.toUpperCase()}" readonly>
        </div>
        <button type="submit" class="btn btn-primary w-full">Update Name</button>
      </form>
    </div>
  `;

  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('profile-name').value;
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem("users"));
    const userIdx = users.findIndex(u => u.email === currentUser.email);
    users[userIdx].name = newName;
    localStorage.setItem("users", JSON.stringify(users));
    
    // Update currentUser
    currentUser.name = newName;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    
    logActivity(`Updated name to ${newName}`);
    showToast("Profile updated successfully!");
    renderDashboard(); // Re-render to update navbar name
  });
}

window.sendMessage = () => {
  const input = document.getElementById("chat-input-field");
  const messages = document.getElementById("chat-messages");
  if (!input.value) return;

  const userMsg = document.createElement("div");
  userMsg.className = "mb-4 text-right";
  userMsg.innerHTML = `<div class="bg-orange-500 text-white p-3 rounded-lg inline-block max-w-xs text-sm">${input.value}</div>`;
  messages.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.className = "mb-4";
  aiMsg.innerHTML = `<div class="bg-gray-100 p-3 rounded-lg inline-block max-w-xs text-sm italic">Thinking...</div>`;
  messages.appendChild(aiMsg);

  setTimeout(() => {
    let response = "That's a great question! Based on the department curriculum, you should focus on the core concepts of that topic. Would you like some reference notes?";
    
    const lowerInput = input.value.toLowerCase();
    if (lowerInput.includes("exam")) {
      response = "Mid exams are scheduled for next week. You can check the timetable in the Announcements section.";
    } else if (lowerInput.includes("attendance")) {
      response = "You can view your real-time attendance percentage on the Attendance tab. Make sure it stays above 75%.";
    } else if (lowerInput.includes("leave")) {
      response = "To apply for leave, go to the Leave Management tab and fill out the form. Your faculty will review it shortly.";
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      response = "Hello! How can I assist you with your academic queries today?";
    }

    aiMsg.innerHTML = `<div class="bg-gray-100 p-3 rounded-lg inline-block max-w-xs text-sm">${response}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 1000);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;
};

window.logout = () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
  renderView("landing");
};

// Initial Render
renderView(currentUser ? "dashboard" : "landing");
