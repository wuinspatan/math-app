# Running MathApp Locally

To run the full stack, you need **two terminals** open because both the backend and frontend must stay running at the same time.

---

### **Step 1: The Backend (FastAPI)**
The backend handles all the math logic and must be started first.

1.  **Open Terminal 1.**
2.  **Enter the development shell:**
    ```bash
    nix develop
    ```
3.  **Run the backend script:**
    ```bash
    ./scripts/dev-backend.sh
    ```
    *   **Success:** You'll see `Uvicorn running on http://0.0.0.0:8000`.
    *   **Test:** Visit [http://localhost:8000/docs](http://localhost:8000/docs) to see the API docs.

---

### **Step 2: The Frontend (Next.js)**
The frontend is the website you see in your browser.

1.  **Open Terminal 2.**
2.  **Enter the development shell:**
    ```bash
    nix develop
    ```
3.  **Run the frontend script:**
    ```bash
    ./scripts/dev-frontend.sh
    ```
    *   **Success:** You'll see `Local: http://localhost:3000`.
    *   **Test:** Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### **How to Stop**
To stop the servers at any time, go to the terminal where they are running and press:
**`Ctrl + C`**

---

### **Common Troubleshooting**
*   **"Address already in use":** This means a server is already running on that port. Use `lsof -i :8000` to find the process and `kill -9 <PID>` to stop it.
*   **"Connection Refused" in Browser:** Make sure the **backend** (port 8000) is running before you try to use the features on the site.
