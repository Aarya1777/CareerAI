// CareerAI - little single page app, no framework.
// I'm just swapping out the innerHTML of #app whenever something changes.
// Not the "proper" way to build a big app, but it's simple and it works
// for something this size.

// ---------------------------------------------------------
// fallback / demo data
// Used only if the API calls below fail (e.g. no backend running yet,
// or you are opening this file straight off disk). Once a real backend
// answers, none of this is touched - it just stops a blank screen from
// showing up during development.
// ---------------------------------------------------------

const fallbackUser = {
  name: "Tanvi Chougule",
  role: "Aspiring Backend Developer",
  initials: "TC",
  email: "tanvichougule@example.com",
  phone: "+91 98765 43210",
  education: "B.Tech, Computer Science — VIT Pune (2026)",
  skills: ["Python", "SQL", "Django", "REST APIs", "Git", "Data Structures"],
  profileCompletion: 82,
};

// logoClass just picks which colour box the company initials sit in,
// nothing fancier than that.
// applyUrl is the company's official site - when someone hits "Yes" on the
// apply popup we send them there. The backend will fill in the real links.
const fallbackJobs = [
  {
    id: "j1",
    title: "Python Developer",
    company: "Nimbus Cloudworks",
    logoClass: "logo-c1",
    location: "Pune, India",
    workType: "Hybrid",
    jobType: "Full-time",
    salary: "₹6L – ₹9L / yr",
    posted: "2 days ago",
    match: 85,
    skills: ["Python", "Django", "PostgreSQL", "REST APIs"],
    about: "You'll build and maintain backend services that power Nimbus's data pipelines, working closely with the platform team to ship reliable, well-tested APIs.",
    responsibilities: [
      "Design and maintain REST APIs used by internal and partner teams",
      "Write clean, tested Python code and review teammates' pull requests",
      "Optimize database queries and troubleshoot production issues",
      "Collaborate with product and design on new feature specs",
    ],
    requiredSkills: ["Python", "Django or Flask", "SQL", "Git"],
    niceToHave: [
      "Experience with Docker and container-based deployments",
      "Exposure to a cloud provider (AWS, GCP, or Azure)",
      "Familiarity with CI/CD pipelines",
    ],
    benefits: ["Health insurance", "Flexible hours", "Learning stipend", "Hybrid work"],
    company_size: "150–300 employees",
    company_industry: "Cloud infrastructure",
    company_founded: "2018",
    company_site: "nimbuscloudworks.example",
    applyUrl: "https://nimbuscloudworks.example",
    whyItFits: "Your Python and SQL skills line up closely with this role's core stack. Brushing up on Docker and cloud deployment would strengthen your application further.",
  },
  {
    id: "j2",
    title: "Backend Intern",
    company: "Fernway Labs",
    logoClass: "logo-c2",
    location: "Bengaluru, India",
    workType: "On-site",
    jobType: "Internship",
    salary: "₹25,000 / month",
    posted: "5 days ago",
    match: 78,
    skills: ["Python", "Flask", "MySQL", "Git"],
    about: "A 6-month internship building internal tooling for Fernway's logistics platform, with mentorship from senior engineers throughout.",
    responsibilities: [
      "Build small internal services and CLI tools",
      "Write unit tests for existing modules",
      "Pair with senior engineers on code reviews",
      "Document APIs as you build them",
    ],
    requiredSkills: ["Python", "Basic SQL", "Git"],
    niceToHave: ["Coursework in data structures & algorithms", "A personal or academic project on GitHub"],
    benefits: ["Mentorship program", "Certificate on completion", "Pre-placement offer track"],
    company_size: "40–100 employees",
    company_industry: "Logistics tech",
    company_founded: "2021",
    company_site: "fernwaylabs.example",
    applyUrl: "https://fernwaylabs.example",
    whyItFits: "Your project experience with Flask and MySQL covers most of what this internship needs. Sharing a GitHub link with your application would help you stand out.",
  },
  {
    id: "j3",
    title: "Data Analyst Intern",
    company: "Northline Retail",
    logoClass: "logo-c3",
    location: "Remote",
    workType: "Remote",
    jobType: "Internship",
    salary: "₹18,000 / month",
    posted: "1 week ago",
    match: 65,
    skills: ["SQL", "Excel", "Python", "Tableau"],
    about: "Support the analytics team with reporting and ad-hoc analysis on customer purchase data for Northline's e-commerce platform.",
    responsibilities: [
      "Build and maintain weekly sales dashboards",
      "Write SQL queries against the retail data warehouse",
      "Present findings to the merchandising team",
    ],
    requiredSkills: ["SQL", "Excel", "Basic statistics"],
    niceToHave: ["Experience with Tableau or Power BI", "Coursework in statistics"],
    benefits: ["Remote-first", "Flexible hours", "Certificate on completion"],
    company_size: "500+ employees",
    company_industry: "E-commerce",
    company_founded: "2015",
    company_site: "northlineretail.example",
    applyUrl: "https://northlineretail.example",
    whyItFits: "Your SQL background matches this role well. Adding a dashboarding tool like Tableau or Power BI to your skill set would close the remaining gap.",
  },
  {
    id: "j4",
    title: "Frontend Developer",
    company: "Pixelgrove Studio",
    logoClass: "logo-c4",
    location: "Hyderabad, India",
    workType: "Hybrid",
    jobType: "Full-time",
    salary: "₹7L – ₹10L / yr",
    posted: "3 days ago",
    match: 58,
    skills: ["React", "JavaScript", "Tailwind CSS"],
    about: "Join a small product team building customer-facing dashboards for independent design studios.",
    responsibilities: [
      "Build reusable React components from design specs",
      "Collaborate with designers on interaction details",
      "Improve page performance and accessibility",
    ],
    requiredSkills: ["React", "JavaScript (ES6+)", "CSS"],
    niceToHave: ["TypeScript experience", "A portfolio of shipped UI work"],
    benefits: ["Health insurance", "Hybrid work", "Annual learning budget"],
    company_size: "10–40 employees",
    company_industry: "Design & product studio",
    company_founded: "2022",
    company_site: "pixelgrove.example",
    applyUrl: "https://pixelgrove.example",
    whyItFits: "This role leans more heavily on frontend frameworks than your current skill set. A couple of React projects would meaningfully raise your match here.",
  },
  {
    id: "j5",
    title: "Machine Learning Intern",
    company: "Aetherlytics AI",
    logoClass: "logo-c5",
    location: "Remote",
    workType: "Remote",
    jobType: "Internship",
    salary: "₹22,000 / month",
    posted: "4 days ago",
    match: 71,
    skills: ["Python", "Pandas", "scikit-learn", "SQL"],
    about: "Work alongside data scientists building churn-prediction models for subscription businesses.",
    responsibilities: [
      "Clean and prepare datasets for model training",
      "Assist in building and evaluating baseline models",
      "Summarize experiment results for the team",
    ],
    requiredSkills: ["Python", "Pandas", "Basic ML concepts"],
    niceToHave: ["scikit-learn experience", "A Kaggle or coursework project"],
    benefits: ["Remote-first", "Mentorship", "Letter of recommendation"],
    company_size: "20–50 employees",
    company_industry: "Applied AI",
    company_founded: "2023",
    company_site: "aetherlytics.example",
    applyUrl: "https://aetherlytics.example",
    whyItFits: "Your Python and SQL foundation is a solid starting point. Working through one or two applied ML projects would help this match climb above 80%.",
  },
  {
    id: "j6",
    title: "DevOps Engineer",
    company: "Ridgeline Systems",
    logoClass: "logo-c6",
    location: "Gurugram, India",
    workType: "On-site",
    jobType: "Full-time",
    salary: "₹9L – ₹13L / yr",
    posted: "6 days ago",
    match: 48,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    about: "Own the infrastructure that keeps Ridgeline's trading platform running around the clock.",
    responsibilities: [
      "Maintain CI/CD pipelines across staging and production",
      "Monitor infrastructure health and respond to incidents",
      "Automate deployments with Terraform and Kubernetes",
    ],
    requiredSkills: ["AWS or GCP", "Docker", "Kubernetes"],
    niceToHave: ["Terraform experience", "On-call incident response experience"],
    benefits: ["Health insurance", "On-call allowance", "Relocation support"],
    company_size: "300–500 employees",
    company_industry: "Fintech",
    company_founded: "2016",
    company_site: "ridgelinesystems.example",
    applyUrl: "https://ridgelinesystems.example",
    whyItFits: "This role is infrastructure-heavy relative to your current profile. Learning Docker and a cloud platform would be the highest-leverage next step.",
  },
];

const fallbackApplications = [
  { id: "a1", jobTitle: "Software Engineering Intern", company: "Cobalt Systems", appliedDate: "12 Aug 2026", status: "Interview" },
  { id: "a2", jobTitle: "Junior QA Analyst", company: "Marlowe Tech", appliedDate: "3 Aug 2026", status: "Under Review" },
  { id: "a3", jobTitle: "Support Engineer", company: "Haven Software", appliedDate: "28 Jul 2026", status: "Rejected" },
  { id: "a4", jobTitle: "Data Entry & Analytics Intern", company: "Verona Retail Group", appliedDate: "15 Jul 2026", status: "Offer" },
];


// ===========================================================
// BACKEND INTEGRATION - everything the server needs to provide
//
// This is the only part of the file that talks to the network.
// Point API_BASE at your backend and implement the routes below;
// nothing else in this file needs to change. Every function here
// returns a Promise and throws on a non-2xx response, so callers
// can just try/catch around them.
//
// Expected routes (adjust paths/shapes to match your backend,
// just keep the function signatures the same):
//
//   GET    /api/jobs
//            -> [{ id, title, company, logoClass, location, workType,
//                  jobType, salary, posted, match, skills[],
//                  about, responsibilities[], requiredSkills[],
//                  niceToHave[], benefits[], company_size,
//                  company_industry, company_founded, company_site,
//                  applyUrl, status }]
//            "status" is optional ("interested" | "saved" | "none") -
//            include it if you track a user's job status server-side.
//
//   GET    /api/me
//            -> { name, role, initials, email, phone, education,
//                 skills[], profileCompletion }
//
//   GET    /api/applications
//            -> [{ id, jobTitle, company, appliedDate, status }]
//
//   GET    /api/resume
//            -> { name, role, education, skills, summary, experience,
//                 createdAt, updatedAt }   or 204/404 if none saved yet
//
//   GET    /api/settings
//            -> { notifications, emailAlerts }
//
//   PATCH  /api/jobs/:id/status      body: { status }
//            set a job to "interested" / "saved" / "none" for this user
//
//   POST   /api/resume               body: resume fields from the modal
//            -> saved resume, with createdAt/updatedAt filled in
//
//   PATCH  /api/settings             body: { key, value }
//
//   POST   /api/applications         body: { jobId }
//            called right when the user clicks "Yes" on the apply
//            popup, so the backend can log that this person applied.
//            -> the new application row (used to update "My Applications")
// ===========================================================

const API_BASE = "/api";

async function apiRequest(path, options) {
  const res = await fetch(API_BASE + path, Object.assign({
    headers: { "Content-Type": "application/json" },
  }, options));

  if (!res.ok) {
    throw new Error("API " + path + " failed with status " + res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  getJobs: function () { return apiRequest("/jobs"); },
  getCurrentUser: function () { return apiRequest("/me"); },
  getApplications: function () { return apiRequest("/applications"); },
  getResume: function () { return apiRequest("/resume").catch(function () { return null; }); },
  getSettings: function () { return apiRequest("/settings"); },

  setJobStatus: function (jobId, status) {
    return apiRequest("/jobs/" + jobId + "/status", {
      method: "PATCH",
      body: JSON.stringify({ status: status }),
    });
  },

  saveResume: function (resumeData) {
    return apiRequest("/resume", {
      method: "POST",
      body: JSON.stringify(resumeData),
    });
  },

  updateSetting: function (key, value) {
    return apiRequest("/settings", {
      method: "PATCH",
      body: JSON.stringify({ key: key, value: value }),
    });
  },

  recordApplication: function (jobId) {
    return apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify({ jobId: jobId }),
    });
  },
};

const statusSteps = ["Applied", "Under Review", "Interview", "Offer"];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "recommended", label: "Recommended Jobs", icon: "sparkles" },
  { id: "interested", label: "Interested Jobs", icon: "heart" },
  { id: "saved", label: "Saved for Later", icon: "bookmark" },
  { id: "applications", label: "My Applications", icon: "file-text" },
  { id: "profile", label: "Profile", icon: "user" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// ---------------------------------------------------------
// state - just one big object, nothing fancy
// ---------------------------------------------------------

// these three start empty and get filled in by boot() below, either
// from the API or from the fallback data if the API isn't reachable
let jobs = [];
let currentUser = fallbackUser;
let applications = [];

let currentSection = "dashboard";
let mobileNavOpen = false;
let jobStatus = {};       // { jobId: "interested" | "saved" }
let selectedJobId = null;
let applyConfirmJobId = null; // which job the "do you want to apply?" popup is open for
let openMenuId = null;
let cameFrom = "recommended"; // which list we opened the job profile from
let resume = null;         // set once the person saves one
let resumeModalMode = null; // "create" | "edit" | null
let settings = { notifications: true, emailAlerts: true };

// only matters while the resume popup is open
let resumeDraft = null;

// boot() sets these while the first load is happening
let appLoading = true;
let appLoadError = null;

// ---------------------------------------------------------
// small helpers
// ---------------------------------------------------------

function icon(name, size) {
  size = size || 18;
  return `<i data-lucide="${name}" width="${size}" height="${size}"></i>`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

function findJob(id) {
  return jobs.find(function (j) { return j.id === id; });
}

function statusOf(jobId) {
  return jobStatus[jobId] || "none";
}

function matchLevel(pct) {
  if (pct >= 80) return { colour: "var(--green)", label: "Strong match", badgeClass: "icon-green" };
  if (pct >= 60) return { colour: "var(--gold)", label: "Good match", badgeClass: "icon-gold" };
  return { colour: "var(--border-hover)", label: "Partial match", badgeClass: "" };
}

function matchRing(pct, size) {
  size = size || 56;
  const level = matchLevel(pct);
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return `
    <div class="match-ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke="var(--border)" stroke-width="${stroke}" fill="none" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke="${level.colour}" stroke-width="${stroke}" fill="none"
          stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" stroke-linecap="round" />
      </svg>
      <span>${pct}%</span>
    </div>`;
}

function statusBadge(status) {
  const classes = {
    Applied: "status-applied",
    "Under Review": "status-review",
    Interview: "status-interview",
    Offer: "status-offer",
    Rejected: "status-rejected",
  };
  return `<span class="status-badge ${classes[status]}">${status}</span>`;
}

// ---------------------------------------------------------
// navbar (no sidebar, everything lives up top)
// ---------------------------------------------------------

function renderNavbar(activeId, counts) {
  function navLink(item, mobile) {
    const active = activeId === item.id;
    const count = counts[item.id] || 0;
    return `
      <button class="nav-link ${active ? "active" : ""}" data-nav="${item.id}">
        ${icon(item.icon, mobile ? 18 : 16)}
        <span${mobile ? ' style="flex:1;text-align:left"' : ""}>${item.label}</span>
        ${count ? `<span class="nav-badge">${count}</span>` : ""}
      </button>`;
  }

  return `
    <header class="navbar">
      <div class="navbar-inner">
        <button class="icon-btn hamburger" data-toggle-mobile-nav>
          ${icon("menu", 22)}
        </button>

        <button class="logo" data-nav="dashboard" style="background:none;border:none;cursor:pointer">
          <span class="logo-mark">${icon("sparkles", 18)}</span>
          <span class="logo-text">CareerAI</span>
        </button>

        <nav class="nav-links">
          ${navItems.map(function (item) { return navLink(item, false); }).join("")}
        </nav>

        <div class="search-box">
          ${icon("search", 16)}
          <input type="text" placeholder="Search jobs, skills, companies…">
        </div>

        <div class="navbar-right">
          <div class="icon-btn bell-wrap">
            ${icon("bell", 18)}
            <span class="bell-dot"></span>
          </div>
          <div class="avatar">${currentUser.initials}</div>
        </div>
      </div>

      ${mobileNavOpen ? `
        <nav class="mobile-nav open">
          ${navItems.map(function (item) { return navLink(item, true); }).join("")}
        </nav>` : ""}
    </header>`;
}

// ---------------------------------------------------------
// job card - used on recommended / interested / saved pages
// ---------------------------------------------------------

function jobCardActions(job) {
  const status = statusOf(job.id);

  if (status === "interested") {
    return `
      <button class="btn btn-primary btn-small" data-apply="${job.id}">Apply Now</button>
      <button class="icon-btn" data-set-status="${job.id}" data-status-value="none">${icon("x", 16)}</button>`;
  }

  if (status === "saved") {
    return `
      <button class="btn btn-small" style="background:var(--rose-bg);color:var(--rose)" data-set-status="${job.id}" data-status-value="interested">Move to Interested</button>
      <button class="icon-btn" data-set-status="${job.id}" data-status-value="none">${icon("x", 16)}</button>`;
  }

  // default (still on the recommended list) - bookmark + the ... menu
  const menuOpen = openMenuId === job.id;
  return `
    <button class="icon-btn" data-set-status="${job.id}" data-status-value="saved">${icon("bookmark", 16)}</button>
    <div class="menu-wrap">
      <button class="icon-btn" data-toggle-menu="${job.id}">${icon("more-vertical", 16)}</button>
      ${menuOpen ? `
        <div class="menu" data-menu-box>
          <button class="menu-item" data-set-status="${job.id}" data-status-value="interested">${icon("heart", 14)} Mark Interested</button>
          <button class="menu-item" data-set-status="${job.id}" data-status-value="saved">${icon("bookmark", 14)} Save for Later</button>
          <button class="menu-item" data-set-status="${job.id}" data-status-value="none">${icon("x-circle", 14)} Not Interested</button>
        </div>` : ""}
    </div>`;
}

function jobCard(job) {
  const skillsToShow = job.skills.slice(0, 4);
  return `
    <div class="job-card" data-view-job="${job.id}">
      <div class="job-top">
        <div class="row-gap">
          <div class="job-logo ${job.logoClass}">${job.company.slice(0, 2).toUpperCase()}</div>
          <div>
            <p class="job-title truncate">${job.title}</p>
            <p class="job-company truncate">${job.company}</p>
          </div>
        </div>
        ${matchRing(job.match)}
      </div>

      <div class="job-meta">
        <span>${icon("map-pin", 13)} ${job.location}</span>
        <span>${icon("briefcase", 13)} ${job.workType} · ${job.jobType}</span>
        <span>${icon("wallet", 13)} ${job.salary}</span>
        <span>${icon("clock", 13)} ${job.posted}</span>
      </div>

      <div class="skill-row">
        ${skillsToShow.map(function (s) { return `<span class="skill-tag">${s}</span>`; }).join("")}
      </div>

      <div class="job-bottom">
        <button class="link-btn row-gap" data-view-job="${job.id}">
          View Job Profile ${icon("chevron-right", 14)}
        </button>
        <div class="card-actions">${jobCardActions(job)}</div>
      </div>
    </div>`;
}

// ---------------------------------------------------------
// pages
// ---------------------------------------------------------

function emptyState(iconName, title, text, buttonLabel, goTo) {
  return `
    <div class="empty">
      <div class="empty-icon">${icon(iconName, 28)}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <button class="btn btn-primary" data-nav="${goTo}">${buttonLabel}</button>
    </div>`;
}

function pageRecommended() {
  const list = jobs.filter(function (j) { return statusOf(j.id) === "none"; });

  const filterOptions = [
    ["All", "Full-time", "Internship", "Part-time"],
    ["All", "Remote", "Bengaluru", "Pune", "Hyderabad", "Gurugram"],
    ["All", "Entry-level", "Mid-level"],
    ["All", "Remote", "Hybrid", "On-site"],
  ];

  return `
    <div class="page">
      <h1 class="page-title">Recommended Jobs for You</h1>
      <p class="page-subtitle">Jobs matched based on your skills, experience, and career preferences.</p>

      <div class="banner">
        <div>
          <p class="banner-label">Profile strength</p>
          <p class="banner-title">Your profile is ${currentUser.profileCompletion}% complete</p>
        </div>
        <button class="btn btn-primary" data-nav="profile">Complete Profile</button>
      </div>

      <div class="filters">
        ${icon("sliders-horizontal", 14)} Filters:
        ${filterOptions.map(function (opts) {
          return `<select>${opts.map(function (o) { return `<option>${o}</option>`; }).join("")}</select>`;
        }).join("")}
        <select><option>Any salary</option><option>₹5L – ₹8L</option><option>₹8L – ₹12L</option><option>₹12L+</option></select>
      </div>

      <div class="job-grid">
        ${list.map(jobCard).join("")}
      </div>
    </div>`;
}

function pageInterested() {
  const list = jobs.filter(function (j) { return statusOf(j.id) === "interested"; });

  if (list.length === 0) {
    return `
      <div class="page">
        <h1 class="page-title">Interested Jobs</h1>
        <p class="page-subtitle">Roles you've marked as interested will show up here.</p>
        ${emptyState("heart", "No interested jobs yet", "Mark roles you like from your recommendations and they'll show up here for quick access.", "Explore Recommended Jobs", "recommended")}
      </div>`;
  }

  return `
    <div class="page">
      <h1 class="page-title">Interested Jobs</h1>
      <p class="page-subtitle">Roles you've shown interest in — pick up where you left off.</p>
      <div class="job-grid">${list.map(jobCard).join("")}</div>
    </div>`;
}

function pageSaved() {
  const list = jobs.filter(function (j) { return statusOf(j.id) === "saved"; });

  if (list.length === 0) {
    return `
      <div class="page">
        <h1 class="page-title">Saved for Later</h1>
        <p class="page-subtitle">Jobs you save will be parked here for future consideration.</p>
        ${emptyState("bookmark", "Nothing saved yet", "Save a job when you're not ready to decide, and it'll wait for you here.", "Explore Recommended Jobs", "recommended")}
      </div>`;
  }

  return `
    <div class="page">
      <h1 class="page-title">Saved for Later</h1>
      <p class="page-subtitle">These jobs are saved for future consideration — move them to Interested whenever you're ready.</p>
      <div class="job-grid">${list.map(jobCard).join("")}</div>
    </div>`;
}

function pageApplications() {
  const rows = applications.map(function (app) {
    const stepIndex = statusSteps.indexOf(app.status);
    const rejected = app.status === "Rejected";
    const pct = rejected ? 100 : ((stepIndex + 1) / statusSteps.length) * 100;

    return `
      <div class="app-row">
        <div class="app-row-info">
          <div class="app-icon">${icon("building-2", 18)}</div>
          <div>
            <p class="app-title truncate">${app.jobTitle}</p>
            <p class="app-sub truncate">${app.company} · Applied ${app.appliedDate}</p>
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress-track">
            <div class="progress-fill ${rejected ? "rejected" : ""}" style="width:${pct}%"></div>
          </div>
          ${statusBadge(app.status)}
        </div>
        <button class="link-btn" data-nav="recommended">View Job</button>
      </div>`;
  }).join("");

  return `
    <div class="page">
      <h1 class="page-title">My Applications</h1>
      <p class="page-subtitle">Track every role you've applied to, all in one place.</p>
      <div class="app-list">${rows}</div>
    </div>`;
}

function pageJobProfile() {
  const job = findJob(selectedJobId);
  if (!job) return pageDashboard();

  const status = statusOf(job.id);
  const level = matchLevel(job.match);
  const others = jobs.filter(function (j) { return j.id !== job.id; }).slice(0, 3);

  return `
    <div class="page">
      <button class="back-link" data-nav="${cameFrom}">${icon("arrow-left", 16)} Back</button>

      <div class="card detail-head">
        <div class="detail-top">
          <div class="row-gap" style="align-items:flex-start">
            <div class="detail-logo ${job.logoClass}">${job.company.slice(0, 2).toUpperCase()}</div>
            <div>
              <div class="detail-heading" style="display:block">
                <h2>${job.title}</h2>
                <p>${job.company}</p>
              </div>
              <div class="detail-meta">
                <span>${icon("map-pin", 13)} ${job.location}</span>
                <span>${icon("briefcase", 13)} ${job.workType} · ${job.jobType}</span>
                <span>${icon("wallet", 13)} ${job.salary}</span>
                <span>${icon("clock", 13)} Posted ${job.posted}</span>
              </div>
            </div>
          </div>
          <div class="match-box">
            ${matchRing(job.match, 72)}
            <span class="match-box-label ${level.badgeClass}">match score</span>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn btn-primary" data-apply="${job.id}">Apply Now</button>
          <button class="btn btn-outline ${status === "interested" ? "is-on-rose" : ""}" data-set-status="${job.id}" data-status-value="interested">Interested</button>
          <button class="btn btn-outline ${status === "saved" ? "is-on-maroon" : ""}" data-set-status="${job.id}" data-status-value="saved">Save for Later</button>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-main">
          <div class="card section-box">
            <h3>About the role</h3>
            <p>${job.about}</p>
          </div>

          <div class="card section-box">
            <h3>Responsibilities</h3>
            <ul class="bullets">
              ${job.responsibilities.map(function (r) { return `<li><span class="dot">${icon("circle-dot", 14)}</span>${r}</li>`; }).join("")}
            </ul>
          </div>

          <div class="card section-box">
            <h3>Required skills</h3>
            <div class="skill-row" style="margin-bottom:14px">
              ${job.requiredSkills.map(function (s) { return `<span class="skill-tag">${s}</span>`; }).join("")}
            </div>
            <h3>Preferred qualifications</h3>
            <ul class="bullets">
              ${job.niceToHave.map(function (q) { return `<li><span class="dot faint">${icon("circle-dot", 14)}</span>${q}</li>`; }).join("")}
            </ul>
          </div>

          <div class="card section-box">
            <h3>Benefits</h3>
            <div class="skill-row">
              ${job.benefits.map(function (b) { return `<span class="skill-tag">${b}</span>`; }).join("")}
            </div>
          </div>
        </div>

        <div class="detail-side">
          <div class="card insight-box">
            <h3>${icon("sparkles", 16)} Why this job matches you</h3>
            <p>${job.whyItFits}</p>
          </div>

          <div class="card section-box">
            <h3>${icon("building-2", 16)} Company</h3>
            <ul class="company-list">
              <li><dt>${icon("users", 13)} Size</dt><dd>${job.company_size}</dd></li>
              <li><dt>${icon("shield-check", 13)} Industry</dt><dd>${job.company_industry}</dd></li>
              <li><dt>${icon("graduation-cap", 13)} Founded</dt><dd>${job.company_founded}</dd></li>
              <li><dt>${icon("globe", 13)} Website</dt><dd style="color:var(--maroon-nav)">${job.company_site}</dd></li>
            </ul>
          </div>

          <button class="btn btn-primary" style="width:100%;padding:13px" data-apply="${job.id}">Apply Now</button>
        </div>
      </div>

      <div style="margin-top:32px">
        <h3 style="margin-bottom:6px">Similar jobs for you</h3>
        <div class="similar-grid">
          ${others.map(function (j) {
            return `
              <div class="similar-card" data-view-job="${j.id}">
                <div class="job-logo ${j.logoClass}" style="width:40px;height:40px;font-size:12px">${j.company.slice(0, 2).toUpperCase()}</div>
                <div style="flex:1;min-width:0">
                  <p class="job-title truncate">${j.title}</p>
                  <p class="job-company truncate">${j.company}</p>
                </div>
                <span style="font-size:13px;font-weight:600;color:${matchLevel(j.match).colour}">${j.match}%</span>
              </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------
// apply popup - "do you want to apply?" yes / no
// yes sends them to the company's official site, no just closes it
// ---------------------------------------------------------

function renderApplyConfirm() {
  const job = findJob(applyConfirmJobId);
  if (!job) return "";

  return `
    <div class="modal-bg">
      <div class="modal-box confirm-box">
        <div class="confirm-icon">${icon("external-link", 26)}</div>
        <h3>Do you want to apply?</h3>
        <p>${job.title} at ${job.company}.<br>Choosing yes will take you to their official website.</p>
        <div class="confirm-actions">
          <button class="btn btn-outline" data-apply-no>No</button>
          <button class="btn btn-primary" data-apply-yes>Yes</button>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------
// resume create / edit modal
// ---------------------------------------------------------

function openResumeModal(mode) {
  resumeModalMode = mode;
  if (mode === "edit" && resume) {
    resumeDraft = Object.assign({}, resume);
  } else {
    resumeDraft = {
      name: currentUser.name,
      role: currentUser.role,
      education: currentUser.education,
      skills: currentUser.skills.join(", "),
      summary: "",
      experience: "",
    };
  }
}

function renderResumeModal() {
  const editing = resumeModalMode === "edit";
  const d = resumeDraft;

  return `
    <div class="modal-bg">
      <div class="modal-box">
        <div class="modal-head">
          <div>
            <h3>${editing ? "Modify Resume" : "Create Resume"}</h3>
            <p>${editing ? "Update the details on your existing resume." : "Fill this in to generate your first resume."}</p>
          </div>
          <button class="icon-btn" data-close-modal>${icon("x", 18)}</button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
            <div class="field"><label>Full name</label><input data-resume-field="name" value="${escapeHtml(d.name)}"></div>
            <div class="field"><label>Target role</label><input data-resume-field="role" value="${escapeHtml(d.role)}" placeholder="e.g. Backend Developer"></div>
            <div class="field full"><label>Education</label><input data-resume-field="education" value="${escapeHtml(d.education)}"></div>
            <div class="field full"><label>Skills (comma separated)</label><input data-resume-field="skills" value="${escapeHtml(d.skills)}"></div>
          </div>
          <div class="field">
            <label>Professional summary</label>
            <textarea rows="3" data-resume-field="summary" placeholder="A couple of sentences about who you are and what you're looking for.">${escapeHtml(d.summary)}</textarea>
          </div>
          <div class="field">
            <label>Experience / projects</label>
            <textarea rows="4" data-resume-field="experience" placeholder="List internships, projects, or relevant coursework.">${escapeHtml(d.experience)}</textarea>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-outline" data-close-modal>Cancel</button>
          <button class="btn btn-primary" data-save-resume>${editing ? "Save Changes" : "Save Resume"}</button>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------
// dashboard / profile / settings
// ---------------------------------------------------------

function pageDashboard(counts) {
  counts = counts || countJobs();

  const stats = [
    { label: "Recommended jobs", value: counts.recommended, icon: "sparkles", cls: "icon-maroon" },
    { label: "Interested", value: counts.interested, icon: "heart", cls: "icon-rose" },
    { label: "Saved for later", value: counts.saved, icon: "bookmark", cls: "icon-plum" },
    { label: "Applications", value: applications.length, icon: "file-text", cls: "icon-green" },
  ];

  const tools = [
    {
      title: "Resume Creation", icon: "file-plus", cls: "icon-maroon",
      desc: resume ? "You already have a resume on file — create a new one from scratch anytime." : "Build your first resume from your profile details in a few minutes.",
      status: resume ? `Last created ${resume.createdAt}` : "Not created yet",
      attr: `data-open-resume="create"`, label: "Create Resume", disabled: false,
    },
    {
      title: "Resume Modification", icon: "edit-3", cls: "icon-plum",
      desc: resume ? "Update your skills, summary, or experience on your existing resume." : "Create a resume first, then come back here to edit it.",
      status: resume ? `Last updated ${resume.updatedAt}` : "No resume yet",
      attr: resume ? `data-open-resume="edit"` : "", label: "Modify Resume", disabled: !resume,
    },
    {
      title: "Job Matching", icon: "target", cls: "icon-green",
      desc: "See fresh jobs matched to your skills, experience, and preferences.",
      status: `${counts.recommended} new matches`,
      attr: `data-nav="recommended"`, label: "View Matches", disabled: false,
    },
    {
      title: "Application Tracker", icon: "list-checks", cls: "icon-gold",
      desc: "Track the status of every role you've applied to, in one place.",
      status: `${applications.length} applications`,
      attr: `data-nav="applications"`, label: "Track Applications", disabled: false,
    },
  ];

  return `
    <div class="page">
      <h1 class="page-title">Welcome back, ${currentUser.name.split(" ")[0]}</h1>
      <p class="page-subtitle">Here's a quick look at your job search progress.</p>

      <div class="stats-grid">
        ${stats.map(function (s) {
          return `
            <div class="card stat-box">
              <div class="stat-icon ${s.cls}">${icon(s.icon, 16)}</div>
              <p class="stat-num">${s.value}</p>
              <p class="stat-label">${s.label}</p>
            </div>`;
        }).join("")}
      </div>

      <h4 class="section-heading">Tools for your job search</h4>
      <div class="tools-grid">
        ${tools.map(function (t) {
          return `
            <div class="card tool-box">
              <div class="tool-top">
                <div class="stat-icon ${t.cls}">${icon(t.icon, 18)}</div>
                <span class="tool-status">${t.status}</span>
              </div>
              <h4>${t.title}</h4>
              <p>${t.desc}</p>
              <button class="btn ${t.disabled ? "btn-disabled" : "btn-primary"}" ${t.disabled ? "disabled" : t.attr}>${t.label}</button>
            </div>`;
        }).join("")}
      </div>

      <div class="card cta-box">
        <div>
          <h4>Keep your recommendations fresh</h4>
          <p>Explore today's top matches picked for your skills and interests.</p>
        </div>
        <button class="btn btn-primary" data-nav="recommended">View Recommended Jobs</button>
      </div>
    </div>`;
}

function pageProfile() {
  return `
    <div class="page narrow">
      <h1 class="page-title" style="margin-bottom:20px">Profile</h1>
      <div class="card profile-card">
        <div class="profile-top">
          <div class="profile-avatar-big">${currentUser.initials}</div>
          <div>
            <h3>${currentUser.name}</h3>
            <p>${currentUser.role}</p>
          </div>
        </div>

        <div class="completion-row">
          <div class="completion-labels">
            <span>Profile completion</span>
            <span style="font-weight:600">${currentUser.profileCompletion}%</span>
          </div>
          <div class="completion-bar"><div class="completion-fill" style="width:${currentUser.profileCompletion}%"></div></div>
        </div>

        <ul class="info-list">
          <li><dt>Email</dt><dd>${currentUser.email}</dd></li>
          <li><dt>Phone</dt><dd>${currentUser.phone}</dd></li>
          <li><dt>Education</dt><dd>${currentUser.education}</dd></li>
        </ul>

        <p style="font-size:14px;color:var(--muted);margin-bottom:8px">Skills</p>
        <div class="skill-row">
          ${currentUser.skills.map(function (s) { return `<span class="skill-tag">${s}</span>`; }).join("")}
        </div>
      </div>
    </div>`;
}

function pageSettings() {
  const rows = [
    { key: "notifications", label: "Push notifications", desc: "Get notified about new matching jobs" },
    { key: "emailAlerts", label: "Email alerts", desc: "Receive weekly digest of top matches" },
  ];

  return `
    <div class="page narrow">
      <h1 class="page-title" style="margin-bottom:20px">Settings</h1>
      <div class="card settings-card">
        ${rows.map(function (r) {
          const on = settings[r.key];
          return `
            <div class="settings-row">
              <div>
                <h4>${r.label}</h4>
                <p>${r.desc}</p>
              </div>
              <button class="toggle ${on ? "on" : ""}" data-toggle-setting="${r.key}">
                <span class="toggle-dot"></span>
              </button>
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

// ---------------------------------------------------------
// top level render
// ---------------------------------------------------------

function countJobs() {
  return {
    recommended: jobs.filter(function (j) { return statusOf(j.id) === "none"; }).length,
    interested: jobs.filter(function (j) { return statusOf(j.id) === "interested"; }).length,
    saved: jobs.filter(function (j) { return statusOf(j.id) === "saved"; }).length,
  };
}

function renderLoading() {
  document.getElementById("app").innerHTML = `
    <div class="boot-screen">
      <div class="boot-mark">${icon("sparkles", 20)}</div>
      <p>Loading CareerAI…</p>
    </div>`;
  if (window.lucide) lucide.createIcons();
}

// small strip shown instead of a blocking error screen - we already have
// fallback data to show, so there's no need to stop the person from using
// the app, just let them (and whoever's wiring up the backend) know
function offlineBanner() {
  if (!appLoadError) return "";
  return `
    <div class="offline-banner">
      ${icon("wifi-off", 14)}
      <span>Couldn't reach the server, showing demo data.</span>
      <button class="link-btn" data-retry-boot>Retry</button>
    </div>`;
}

function render() {
  if (appLoading) { renderLoading(); return; }

  const counts = countJobs();
  const navCounts = {
    recommended: counts.recommended,
    interested: counts.interested,
    saved: counts.saved,
    applications: applications.length,
  };

  const activeNavId = currentSection === "job-profile" ? cameFrom : currentSection;

  let pageHtml = "";
  switch (currentSection) {
    case "dashboard": pageHtml = pageDashboard(counts); break;
    case "recommended": pageHtml = pageRecommended(); break;
    case "interested": pageHtml = pageInterested(); break;
    case "saved": pageHtml = pageSaved(); break;
    case "applications": pageHtml = pageApplications(); break;
    case "profile": pageHtml = pageProfile(); break;
    case "settings": pageHtml = pageSettings(); break;
    case "job-profile": pageHtml = pageJobProfile(); break;
    default: pageHtml = pageDashboard(counts);
  }

  document.getElementById("app").innerHTML =
    renderNavbar(activeNavId, navCounts) +
    offlineBanner() +
    `<main>${pageHtml}</main>` +
    (resumeModalMode ? renderResumeModal() : "") +
    (applyConfirmJobId ? renderApplyConfirm() : "");

  if (window.lucide) lucide.createIcons();
}

// ---------------------------------------------------------
// events - one delegated click handler for basically everything
// ---------------------------------------------------------

document.addEventListener("click", async function (e) {
  // if a job card's "..." menu is open and we clicked outside of it, close it first
  const clickedMenuToggle = e.target.closest("[data-toggle-menu]");
  const clickedInsideMenu = e.target.closest("[data-menu-box]");
  if (openMenuId && !clickedMenuToggle && !clickedInsideMenu) {
    openMenuId = null;
  }

  const navBtn = e.target.closest("[data-nav]");
  if (navBtn) {
    currentSection = navBtn.getAttribute("data-nav");
    mobileNavOpen = false;
    render();
    return;
  }

  if (e.target.closest("[data-toggle-mobile-nav]")) {
    mobileNavOpen = !mobileNavOpen;
    render();
    return;
  }

  const menuToggleBtn = e.target.closest("[data-toggle-menu]");
  if (menuToggleBtn) {
    const id = menuToggleBtn.getAttribute("data-toggle-menu");
    openMenuId = (openMenuId === id) ? null : id;
    render();
    return;
  }

  const statusBtn = e.target.closest("[data-set-status]");
  if (statusBtn) {
    const id = statusBtn.getAttribute("data-set-status");
    const value = statusBtn.getAttribute("data-status-value");
    const previous = jobStatus[id]; // so we can put it back if the save fails

    if (value === "none") delete jobStatus[id];
    else jobStatus[id] = value;
    openMenuId = null;
    render();

    try {
      await api.setJobStatus(id, value);
    } catch (err) {
      console.warn("CareerAI: couldn't save job status, reverting.", err);
      if (previous) jobStatus[id] = previous; else delete jobStatus[id];
      render();
    }
    return;
  }

  // any "Apply" button just opens the yes/no popup
  const applyBtn = e.target.closest("[data-apply]");
  if (applyBtn) {
    applyConfirmJobId = applyBtn.getAttribute("data-apply");
    render();
    return;
  }

  // yes -> off to the company's official website (new tab so they don't lose their place here)
  if (e.target.closest("[data-apply-yes]")) {
    const job = findJob(applyConfirmJobId);
    if (job) window.open(job.applyUrl, "_blank", "noopener");
    applyConfirmJobId = null;
    render();

    // tell the backend this person applied, so "My Applications" picks it up.
    // this happens after they've already left for the company site, so we
    // don't make them wait on it - if it fails we just log it.
    if (job) {
      try {
        const newApplication = await api.recordApplication(job.id);
        applications = [newApplication].concat(applications);
        render();
      } catch (err) {
        console.warn("CareerAI: couldn't record the application.", err);
      }
    }
    return;
  }

  // no -> just close the popup
  if (e.target.closest("[data-apply-no]")) {
    applyConfirmJobId = null;
    render();
    return;
  }

  const openResumeBtn = e.target.closest("[data-open-resume]");
  if (openResumeBtn) {
    openResumeModal(openResumeBtn.getAttribute("data-open-resume"));
    render();
    return;
  }

  // clicking the dark area behind a popup counts as closing it
  // (for the apply popup that's the same as pressing "No")
  if (e.target.classList.contains("modal-bg") || e.target.closest("[data-close-modal]")) {
    resumeModalMode = null;
    applyConfirmJobId = null;
    render();
    return;
  }

  if (e.target.closest("[data-save-resume]")) {
    const previousResume = resume;
    const now = "just now";
    resumeDraft.createdAt = (resume && resume.createdAt) || now;
    resumeDraft.updatedAt = now;
    resume = resumeDraft;
    resumeModalMode = null;
    render();

    try {
      resume = await api.saveResume(resumeDraft);
      render();
    } catch (err) {
      console.warn("CareerAI: couldn't save the resume, reverting.", err);
      resume = previousResume;
      render();
      alert("Couldn't save your resume - please check your connection and try again.");
    }
    return;
  }

  const toggleBtn = e.target.closest("[data-toggle-setting]");
  if (toggleBtn) {
    const key = toggleBtn.getAttribute("data-toggle-setting");
    settings[key] = !settings[key];
    render();

    try {
      await api.updateSetting(key, settings[key]);
    } catch (err) {
      console.warn("CareerAI: couldn't save setting, reverting.", err);
      settings[key] = !settings[key];
      render();
    }
    return;
  }

  // this one goes last on purpose - the whole job card is clickable, so the
  // buttons inside it (bookmark, menu, apply...) need to be checked before it
  const viewJobBtn = e.target.closest("[data-view-job]");
  if (viewJobBtn) {
    selectedJobId = viewJobBtn.getAttribute("data-view-job");
    cameFrom = (currentSection === "job-profile") ? cameFrom : currentSection;
    currentSection = "job-profile";
    render();
    return;
  }
});

// resume text inputs - update the in-memory draft as you type, but don't
// re-render on every keystroke (that would kill focus)
document.addEventListener("input", function (e) {
  const resumeField = e.target.getAttribute("data-resume-field");
  if (resumeField && resumeDraft) resumeDraft[resumeField] = e.target.value;
});

document.addEventListener("click", function (e) {
  if (e.target.closest("[data-retry-boot]")) boot();
});

// ---------------------------------------------------------
// boot - loads everything the app needs before the first render.
// Falls back to the mock data above if the API isn't reachable yet,
// so the frontend still works stand-alone while the backend is
// being built.
// ---------------------------------------------------------

async function boot() {
  appLoading = true;
  appLoadError = null;
  render();

  try {
    const [apiJobs, apiUser, apiApplications, apiResume, apiSettings] = await Promise.all([
      api.getJobs(),
      api.getCurrentUser(),
      api.getApplications(),
      api.getResume(),
      api.getSettings(),
    ]);

    jobs = apiJobs;
    currentUser = apiUser;
    applications = apiApplications;
    resume = apiResume || null;
    settings = apiSettings;

    // if the backend tells us a job's status for this user, carry it over
    jobStatus = {};
    jobs.forEach(function (j) {
      if (j.status === "interested" || j.status === "saved") jobStatus[j.id] = j.status;
    });
  } catch (err) {
    console.warn("CareerAI: couldn't load from the API, using fallback data.", err);
    appLoadError = err;
    jobs = fallbackJobs;
    currentUser = fallbackUser;
    applications = fallbackApplications;
  }

  appLoading = false;
  render();
}

boot();
