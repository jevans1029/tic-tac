# Sprint 2 Frontend: Authentication Integration Guide

In **Sprint 2**, we enhance our Vite + React frontend from Sprint 1 by connecting it to a real backend for user authentication. You’ll build login and registration pages, manage auth state, and secure your `/map` route.

---

## 🎯 What’s New in the Frontend

| Area                  | Sprint 1      | Sprint 2                                                  |
| --------------------- | ------------- | --------------------------------------------------------- |
| Pages                 | MapPage only  | Added `Login.jsx` and `Register.jsx`                      |
| Routing               | Single `/map` | New routes: `/login`, `/register`, plus `/map` protection |
| App.jsx               | No auth state | Tracks `authenticated` with `useState` & `useEffect`      |
| API Calls             | Stubbed fetch | Real `axios.post` to backend endpoints                    |
| Environment Variables | None          | Uses `VITE_API_URL` to point at backend                   |
| CORS & Cookies        | N/A           | Configured to send/receive HTTP-only cookies from backend |

---

## 📂 Frontend Folder Structure

```bash
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx       # New: login form and handler
│   │   ├── Register.jsx    # New: registration form and handler
│   │   └── MapPage.jsx     # Protected map view
│   ├── components/
│   │   ├── DateSelector.jsx
│   │   └── MapComponent.jsx
│   ├── App.jsx            # Updated routing & auth state logic
│   └── main.jsx           # Entry point
├── .env                   # New: contains VITE_API_URL
├── package.json
└── vite.config.js
```

---

## 🧩 Step-by-Step Setup

1. **Clone & Navigate**

   ```bash
   git clone https://github.com/tdevine1/xPostForecast.git
   cd xPostForecast/sprint2-login-backend/frontend
   ```

2. **Environment Variable**

   - Create a file named `.env` in the `frontend/` folder:
     ```env
     VITE_API_URL=http://localhost:3001
     ```
   - This points your frontend at the local backend server.

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run Dev Server**

   ```bash
   npm run dev
   ```

   - Open your browser at `http://localhost:5173`.

---

## 🆕 Key Code Changes

### 1. App.jsx

- **Auth State**:
  ```js
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, []);
  ```
- **Routes**:
  ```jsx
  <Route path="/login" element={authenticated ? <Navigate to="/map" replace /> : <Login setAuthenticated={setAuthenticated} />} />
  <Route path="/register" element={authenticated ? <Navigate to="/map" replace /> : <Register />} />
  <Route path="/map" element={authenticated ? <MapPage /> : <Navigate to="/login" replace />} />
  ```

### 2. Login.jsx & Register.jsx

- **Forms** send POST requests via `axios`:
  ```js
  const { data } = await axios.post(
    import.meta.env.VITE_API_URL + '/auth/login',
    { username, password },
    { withCredentials: true }
  );
  localStorage.setItem('token', data.token);
  setAuthenticated(true);
  ```
- **Error Handling** displays alerts on failure.

### 3. DateSelector & MapComponent

- **Unchanged** from Sprint 1: still render date dropdowns and map markers.

---

## 🧠 Mini‑Lessons & Resources

- **React Router Guards**: protect routes with `<Navigate />` — [Docs](https://reactrouter.com/docs/en/v6/getting-started/overview)
- **Environment Variables in Vite**: use `import.meta.env.VITE_*` — [Guide](https://vitejs.dev/guide/env-and-mode.html)
- **HTTP-only Cookies**: secure tokens against XSS — [MDN](https://developer.mozilla.org/docs/Web/HTTP/Cookies)
- **Axios with Credentials**: `axios.defaults.withCredentials = true` or pass `{ withCredentials: true }`
- **useEffect**: loads auth state on mount — [React Hooks](https://reactjs.org/docs/hooks-effect.html)

---

You’ve now integrated real authentication into your frontend! In **Sprint 3**, we’ll deploy this to Azure Static Web Apps and polish the user experience.

