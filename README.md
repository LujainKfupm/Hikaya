# Hikaya – Personalized Stories for Kids
**SWE363 - Web Engineering and Development** project.  
This phase focuses on building a fully interactive front-end.

---

## Description
Hikaya is a website that generates personalized children’s stories using AI.  
The user selects the hero’s name, age, gender, topics, moral lessons, and optional details.  
The story is generated and displayed in the interface.

---

##  Features
- Create personalized stories (name, age, gender, topics, morals, details)
- Display generated story  on the page
- Public Library with search, filters, and sorting
- "My Library" page for users
- Login and Signup using localStorage
- Admin Dashboard (users, categories, stories, messages)

---

##  Demo Accounts

### Admin
- **Email:** `admin@hikaya.com`
- **Password:** `admin123`

### User
- **Email:** `demo@example.com`
- **Password:** `demo123`

---

##  Project Structure
```
src/
  components/
    Header.jsx
    Footer.jsx
    AuthDialog.jsx
    StoryCard.jsx
  pages/
    HomePage.jsx
    StoryCreation.jsx
    StoryLibrary.jsx
    StoryView.jsx
    UserLibrary.jsx
    ContactPage.jsx
    AdminDashboard.jsx
  context/
    AuthContext.jsx
  mocks/
    mockApi.js
  styles/
    styles.css
  App.jsx
  main.jsx
```

---

##  Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/LujainKfupm/Hikaya.git
cd Hikaya
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the  server
```bash
npm run dev
```

---

## Team Members & Contributions
*Each task includes its related styling and mockApi integration*
- **Lujain** — Story Creation / Authentication 
- **Amira** — Story Library / Story View
- **Meznah** — Admin Dashboard / Contact & FAQs
- **Fajer** — Homepage / User Library



---

##  Notes
- The project uses  `mockApi.js` instead of a backend.
- All stories, categories, and users are stored in `mockApi.js`.

---
