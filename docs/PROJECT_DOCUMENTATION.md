# F1 Intelligence System - Project Documentation

## 1. Project Overview

The **F1 Intelligence System** is a cutting-edge web application designed to bring advanced data analytics, race strategy simulation, and predictive modeling to Formula 1 enthusiasts and professionals. By leveraging historical data and machine learning, the platform provides deep insights into race dynamics, driver performance, and strategic decision-making.

The project aims to be the ultimate companion for understanding the "why" behind race results, moving beyond simple statistics to offer predictive intelligence and simulation capabilities.

## 2. Technology Stack

### Frontend
*   **Framework:** React 19 (via Vite) used for building a high-performance, interactive user interface.
*   **Language:** TypeScript for type-safe, maintainable code.
*   **Styling:** 
    *   **Tailwind CSS 4:** For utility-first, responsive design.
    *   **Framer Motion & GSAP:** For complex, high-fidelity animations and transitions.
*   **State Management:** Zustand for efficient, scalable global state management.
*   **Visualization:**
    *   **Recharts:** For standard data visualization (telemetry, lap times).
    *   **D3.js:** For complex, custom visualizations (track maps, telemetry overlays).
*   **Routing:** React Router DOM (v7) for client-side navigation.
*   **UI Components:** 
    *   Aceternity UI for premium, modern components.
    *   Lucide React for consistent iconography.
    *   React Grid Layout for the customizable dashboard.

### Backend
*   **Framework:** FastAPI (Python) for high-performance API endpoints.
*   **Machine Learning:**
    *   **Scikit-learn & LightGBM:** For predictive modeling (race strategy, tyre degradation).
    *   **Pandas & NumPy:** For data manipulation and analysis.
*   **Data Processing:** Python scripts for processing historical F1 data.

### Database & Auth
*   **Supabase:**
    *   **PostgreSQL:** Relational database for storing user data, race results, and telemetry.
    *   **Authentication:** Secure user management (Sign Up, Login, Social Auth).
    *   **Row Level Security (RLS):** Ensuring data privacy and security.

## 3. Core Features (Implemented)

### 3.1. Landing Page
A high-impact, visually stunning entry point featuring:
*   **Hero Section:** Immersive improved visuals with "Enter the Paddock" CTA.
*   **Features Breakdown:** Detailed grid showcasing intelligence capabilities.
*   **How It Works:** Step-by-step guide to the platform's workflow.
*   **Season 2026 Preview:** Dedicated section analyzing upcoming regulations.

### 3.2. Authentication System
*   **Secure Access:** User registration and login flow powered by Supabase.
*   **F1-Themed UI:** Custom-designed auth pages that maintain immersion.

### 3.3. Interactive Dashboard
The command center for the user, featuring:
*   **Customizable Layout:** Grid-based system allowing users to arrange widgets.
*   **Widgets:**
    *   **Race Calendar:** Upcoming and past race details.
    *   **Driver Standings:** Current championship points.
    *   **Constructor Standings:** Team performance metrics.
*   **Sidebar Navigation:** Quick access to all platform modules.

### 3.4. Simulation & Strategy (Beta)
*   **Track Visualization:** Interactive SVG/D3 maps of circuits.
*   **Telemetry Analysis:** Graphs displaying speed, throttle, and brake inputs.
*   **Strategy Prediction:** Visual representation of predicted pit stop strategies.

## 4. How It Works

1.  **Data Ingestion:** The system ingests historical and (future) real-time F1 data.
2.  **Processing & ML:** Python-based ML models (`backend/train.py`) analyze this data to generate predictions (e.g., tyre degradation, lap times).
3.  **API Layer:** FastAPI serves these predictions to the frontend.
4.  **Frontend Visualization:** React components fetch this data and render it into interactive charts and maps using Recharts and D3.
5.  **User Interaction:** Users can customize their view, run different simulation scenarios, and explore historical data through the dashboard.

## 5. Future Roadmap (To Be Implemented)

### 5.1. Real-Time Telemetry
*   Integration with live timing data sources.
*   WebSocket connections for sub-second data updates during live races.
*   "Live Pit Wall" mode for real-time strategy tracking.

### 5.2. Advanced Machine Learning Integration
*   **Race Outcome Prediction:** Pre-race win probability based on practice/qualifying.
*   **Overtake Probability:** ML model analyzing corner types and car performance differences.
*   **Tyre Degradation Model:** Enhanced physics-based model for accurate stint planning.

### 5.3. 3D Experiences
*   **3D Car Configurator/Viewer:** Using Three.js to explore car technical updates.
*   **3D Track Walk:** Immersive 3D visualization of circuit elevations and corners.

### 5.4. Social & Community
*   **Leagues:** User-created prediction leagues.
*   **Shared Telemetry:** Ability to compare user-generated lap times (sim racing integration potential).

### 5.5. Admin & Management
*   **Admin Panel:** For managing datasets, retraining models, and user administration.
*   **User Profiles:** Enhanced settings for favorite teams, drivers, and notification preferences.

## 6. Project Structure

*   **/frontend**: React application source code.
    *   **/src/components**: Reusable UI components (Dashboard, Landing, etc.).
    *   **/src/pages**: Application routes (Dashboard, Simulate, Login).
    *   **/src/store**: Zustand state management stores.
    *   **/src/lib & /utils**: Helper functions and configurations.
*   **/backend**: Python backend server.
    *   **/app**: FastAPI application code.
    *   **/scripts**: Data processing and model training scripts.
    *   `train.py`: Main model training entry point.
*   **/docs**: Project documentation.

---
*Generated by F1 Intelligence Team*
