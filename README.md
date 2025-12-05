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
- **Meznah** — Admin Dashboard / Contact & FAQs / Prototype update
- **Fajer** — Homepage / User Library



---

##  Tools & Technologies Used
- **React.js** — Main front-end framework
- **JavaScript** — All application logic
- **CSS (styles.css)** — Custom styling for all pages and components
- **Node.js & npm** — Required runtime for React
- **Git & GitHub** — Version control and team collaboration

---
##  Figma Design
We have provided a reference Figma design that includes the key screens and functionalities of our application.
The design is similar to our final front-end implementation but not an exact replica.
You can view the Figma file here: [Figma Link](https://www.figma.com/design/55rM4GH3BuQTeEGsF2BZhx/Hikaya?node-id=0-1&t=D99zkhWcxxq5n4eb-1)

---
##  Notes
- The project uses  `mockApi.js` instead of a backend.
- All stories, categories, and users are stored in `mockApi.js`.
- npm install react-feather is required.
- 
---
##  Back-End Implementation 
In this phase, we implemented the full backend for Hikaya using `Node.js`, `Express.js`, and `MongoDB`.
The backend now handles real authentication, story storage, and AI story generation, replacing the old mock API.
---

## Setup & Running the Backend(Using Terminal)
1) Go to the backend folder using the command `cd backend`
2) Install dependencies using the command `npm install`
3) Create a `.env` file 
4) Write to the file :```MONGO_URL=your-real-mongo-url-here
                         JWT_SECRET=your-secret-key-here
                         OPENAI_API_KEY=the-real-key
                         PORT=3000```
5) Start the server using the command `npm start`
6) The server will run at `http://localhost:3000`
---

## Backend Features
- User authentication (JWT)
- Create and save personalized stories 
- “My Stories” for logged-in users 
- Public stories library 
- View a single story 
- Delete story (admin only)
- AI story generation endpoint 
- MongoDB integration for users + stories
---

## Backend Structure
```
backend/
  src/
    config/
      db.js
    controllers/
      authController.js
      generateController.js
      storyController.js
    middleware/
      authMiddleware.js
      errorHandler.js
    models/
      Story.js
      User.js
    routes/
      authRoutes.js
      generateRoutes.js
      storyRoutes.js
    utils/
      adminAccount.js
      generateToken.js
  .env
  server.js
```
---
## API Documentation
- Authentication – Register:
    * HOW TO TEST /api/auth/register:
    - METHOD: POST
    - URL:    http://localhost:3000/api/auth/register
    - BODY (raw + JSON):
      {
      "name": "Student",
      "email": "student@example.com",
      "password": "mypassword123"
      }
    - EXPECT:
      • Missing fields:
        - STATUS: 400
        - BODY: { "message": "الرجاء تعبئة جميع الحقول" }

      • Email already used (existing user or duplicate key):
        - STATUS: 400
        - BODY: { "message": "البريد الإلكتروني مستخدم مسبقاً" }

      • Successful register:
        - STATUS: 201
        - BODY (example):
          {
          "_id": "...",
          "name": "Student",
          "email": "student@example.com",
          "role": "user",
          "token": "..."
          }

      • Unexpected server error:
        - STATUS: 500
        - BODY: { "message": "حدث خطأ غير متوقع" }

- Authentication – Login:
    * HOW TO TEST /api/auth/login:
    - METHOD: POST
    - URL:    http://localhost:3000/api/auth/login
    - BODY (raw + JSON):
      {
      "email": "student@example.com",
      "password": "mypassword123"
      }
    - EXPECT:
      • Missing email or password:
        - STATUS: 400
        - BODY: { "message": "الرجاء إدخال البريد و كلمة المرور" }

      • Wrong email or password:
        - STATUS: 400
        - BODY: { "message": "بيانات الدخول غير صحيحة" }

      • Successful login:
        - STATUS: 200
        - BODY (example):
          {
          "_id": "...",
          "name": "Student",
          "email": "student@example.com",
          "role": "user",
          "token": "..."
          }

      • Server error:
        - STATUS: 500
        - BODY: { "message": "حدث خطأ في الخادم" }

- Authentication – Get Logged-in User (Me):
    * HOW TO TEST /api/auth/me:
    - METHOD: GET
    - URL:    http://localhost:3000/api/auth/me
    - HEADERS:
      Authorization: Bearer <token>
    - EXPECT:
      • No token:
        - STATUS: 401
        - BODY: { "message": "Not authorized, no token" }

      • Invalid or expired token:
        - STATUS: 401
        - BODY: { "message": "Not authorized, token failed" }

      • User from token not found:
        - STATUS: 401
        - BODY: { "message": "Not authorized, user not found" }

      • Middleware passed but user missing:
        - STATUS: 401
        - BODY: { "message": "غير مصرح" }

      • User not found in DB:
        - STATUS: 404
        - BODY: { "message": "المستخدم غير موجود" }

      • Successful:
        - STATUS: 200
        - BODY: user object without password

- Stories – Create Story:
    * HOW TO TEST POST /api/stories/:
    - METHOD: POST
    - URL:    http://localhost:3000/api/stories/
    - HEADERS:
      Authorization: Bearer <token>
    - BODY (raw + JSON):
      {
      "heroName": "Lina",
      "age": 7,
      "gender": "girl",
      "topics": ["magic"],
      "morals": ["kindness"],
      "details": "She loves forests.",
      "content": "Once upon a time...",
      "isPublic": true
      }
    - EXPECT:
      • Missing heroName or age or gender or content:
        - STATUS: 400
        - BODY: { "message": "heroName, age, gender و content مطلوبة" }

      • No token / invalid token:
        - STATUS: 401
        - BODY: one of:
          { "message": "Not authorized, no token" }
          { "message": "Not authorized, token failed" }
          { "message": "Not authorized, user not found" }

      • Successful story creation:
        - STATUS: 201
        - BODY: full Story object saved in DB

- Stories – Get My Stories:
    * HOW TO TEST /api/stories/mine:
    - METHOD: GET
    - URL:    http://localhost:3000/api/stories/mine
    - HEADERS:
      Authorization: Bearer <token>
    - EXPECT:
      • No token / invalid token:
        - STATUS: 401
        - BODY: one of:
          { "message": "Not authorized, no token" }
          { "message": "Not authorized, token failed" }
          { "message": "Not authorized, user not found" }

      • Token valid but userId missing:
        - STATUS: 401
        - BODY: { "message": "يجب تسجيل الدخول لعرض قصصك" }

      • Successful:
        - STATUS: 200
        - BODY: array of Story objects

- Stories – Get Public Stories:
    * HOW TO TEST /api/stories/public:
    - METHOD: GET
    - URL:    http://localhost:3000/api/stories/public
    - EXPECT:
      • Always: 200, returns array of public stories

- Stories – Get Story By ID:
    * HOW TO TEST /api/stories/:id:
    - METHOD: GET
    - URL:    http://localhost:3000/api/stories/<storyId>
    - HEADERS:
      Authorization: Bearer <token>
    - EXPECT:
      • Story not found:
        - STATUS: 404
        - BODY: { "message": "القصة غير موجودة" }

      • Private story, wrong user:
        - STATUS: 403
        - BODY: { "message": "ليس لديك صلاحية لعرض هذه القصة" }

      • Public story:
        - STATUS: 200, returns story

      • Private story, owner:
        - STATUS: 200, returns story

- Stories – Delete Story:
    * HOW TO TEST DELETE /api/stories/:id:
    - METHOD: DELETE
    - URL:    http://localhost:3000/api/stories/<storyId>
    - HEADERS:
      Authorization: Bearer <token>
    - EXPECT:
      • No token / invalid token:
        - STATUS: 401
        - BODY: one of:
          { "message": "Not authorized, no token" }
          { "message": "Not authorized, token failed" }
          { "message": "Not authorized, user not found" }

      • Story not found:
        - STATUS: 404
        - BODY: { "message": "القصة غير موجودة" }

      • User not owner:
        - STATUS: 403
        - BODY: { "message": "ليس لديك صلاحية لحذف هذه القصة" }

      • Successful delete:
        - STATUS: 200
        - BODY: { "message": "تم حذف القصة بنجاح" }

- Generate – AI Story:
    * HOW TO TEST /api/generate/story:
    - METHOD: POST
    - URL:    http://localhost:3000/api/generate/story
    - BODY (raw + JSON):
      {
      "heroName": "Yousef",
      "age": 8,
      "gender": "boy",
      "topics": ["space"],
      "morals": ["bravery"],
      "details": "A boy who dreams of traveling to the moon",
      "isPublic": true
      }
    - EXPECT:
      • Missing heroName or age or gender:
        - STATUS: 400
        - BODY: { "message": "الحقول heroName و age و gender مطلوبة." }

      • Missing OpenAI Key:
        - STATUS: 500
        - BODY: { "message": "OpenAI API key is not configured on the server." }

      • OpenAI returned no text:
        - STATUS: 500
        - BODY: { "message": "حدث خطأ أثناء إنشاء القصة." }

      • Successful generation:
        - STATUS: 201
        - BODY:
          {
          "story": "...قصة...",
          "saved": true or false,
          "storyId": "..."   (only if saved)
          }
---
## Notes
- Backend fully replaces mockApi.js. 
- All data is stored in MongoDB. 
- Protected routes require a valid JWT. 
- Works directly with the deployed Hikaya front-end.