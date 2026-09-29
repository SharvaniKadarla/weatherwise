# WeatherWise — Real-Time Weather & Travel Intelligence

> **AI Engineer Intern Technical Assessment — Tech Assessment #1 + #2**

WeatherWise is a full-stack weather and travel intelligence web application built with **Next.js, React, TypeScript, external APIs, YouTube API integration, and Supabase/PostgreSQL**.

The application allows users to search for weather information for a destination, use their current location, select travel dates, view current conditions and forecasts, receive travel-oriented weather insights, discover destination videos, save searches, update and delete saved searches, and export weather data.

This project was developed to demonstrate both **Frontend Engineering** and **Backend Engineering** capabilities described in the AI Engineer Intern Technical Assessment.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Assessment Coverage](#-assessment-coverage)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Application Architecture](#-application-architecture)
- [Application Workflow](#-application-workflow)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [How to Use WeatherWise](#-how-to-use-weatherwise)
- [Location Handling](#-location-handling)
- [Weather Data](#-weather-data)
- [Date-Range Forecast](#-date-range-forecast)
- [Travel Insights](#-travel-insights)
- [YouTube Integration](#-youtube-integration)
- [Saved Searches and CRUD](#-saved-searches-and-crud)
- [Data Export](#-data-export)
- [API Architecture](#-api-architecture)
- [Database](#-database)
- [Validation and Error Handling](#-validation-and-error-handling)
- [Responsive Design](#-responsive-design)
- [Security and Environment Variables](#-security-and-environment-variables)
- [Testing](#-testing)
- [Assessment Requirement Mapping](#-assessment-requirement-mapping)
- [Full-Stack Capabilities Demonstrated](#-full-stack-capabilities-demonstrated)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Project Information](#-project-information)
- [About PM Accelerator](#-about-pm-accelerator)
- [Author](#-author)
- [License](#-license)

---

# 🌦️ Project Overview

WeatherWise is a responsive weather and travel intelligence application that combines real-time weather information, multi-day forecasting, travel-oriented insights, location services, destination videos, persistent search history, CRUD functionality, and downloadable weather reports.

The application provides a complete full-stack workflow:

```text
User enters a destination
        ↓
User selects a travel date range
        ↓
Location is validated and resolved
        ↓
Weather API data is retrieved
        ↓
Current weather is displayed
        ↓
Five-day forecast is displayed
        ↓
Selected date-range forecast is displayed
        ↓
Travel/weather insights are generated
        ↓
Destination videos are retrieved
        ↓
Search information is persisted in Supabase
        ↓
Saved searches can be READ, UPDATED, and DELETED
        ↓
Weather information can be exported as CSV or JSON
```

---

## 🌐 Live Demo

**WeatherWise:** https://weatherwise-delta.vercel.app/

The live application is deployed on Vercel and can be accessed directly using the link above.

---

## 📋 Assessment Coverage

WeatherWise addresses both major parts of the technical assessment.

### Tech Assessment #1 — Frontend Weather App
The frontend demonstrates:
- ✅ Reactive JavaScript framework (Next.js, React, TypeScript)
- ✅ Responsive web interface (Desktop, Tablet, Smartphone support)
- ✅ User location input (City/town search, ZIP/postal code input, Landmark/location input, GPS coordinate input, Browser geolocation)
- ✅ Current weather, Weather details, Weather icons
- ✅ Five-day forecast & Travel date-range forecast
- ✅ Input validation & Error handling
- ✅ External API integration & Travel-oriented weather insights

### Tech Assessment #2 — Backend Weather App
The backend demonstrates:
- ✅ Server-side API routes & REST-style API communication
- ✅ External weather API integration
- ✅ Location resolution, validation, and matching logic
- ✅ Date-range validation
- ✅ Supabase/PostgreSQL database integration
- ✅ Persistent weather search storage with full CRUD functionality (CREATE, READ, UPDATE, DELETE)
- ✅ YouTube API integration
- ✅ CSV & JSON export
- ✅ Robust error handling

### Full-Stack Implementation
WeatherWise connects the frontend, backend, external services, and database into one complete application.

---

## ✨ Key Features

### 1. 📍 Flexible Location Search
Users can search for destinations using:
- City names
- Town names
- ZIP codes
- Postal codes
- Landmarks
- Geographic coordinates (Latitude/longitude)
- Browser GPS location

**Example:**
```text
New York
Jersey City
10001
40.7128, -74.0060
```

### 2. 📡 Current Location Detection
Users can select **📍 Use My Location**. WeatherWise uses the browser's Geolocation API to retrieve the user's latitude and longitude. The coordinates are then passed through location-resolution logic so the application can display a human-readable location when available. If location permission is denied or unavailable, the application provides a clear error message and allows the user to enter a location manually.

### 3. 🌡️ Current Weather
WeatherWise displays current weather information including:
- Current temperature & Feels-like temperature
- Weather condition & Weather icon
- Humidity, Wind speed, and Precipitation

### 4. 📅 Five-Day Forecast
The application provides a five-day weather forecast containing:
- Forecast date & Weather condition
- Weather icon
- Maximum & Minimum temperature
- Precipitation probability & Maximum wind speed

### 5. 🗓️ Travel Date-Range Forecast
Users can specify a **Start Date** and **End Date**. WeatherWise retrieves and displays weather information for the selected travel period. The date range is validated before the request is processed, preventing invalid ranges where `End Date < Start Date`.

### 6. 🧭 Travel Weather Insights
WeatherWise analyzes available weather information to provide travel-oriented insights regarding temperature, rain probability, wind conditions, general travel considerations, and weather patterns during the selected period.

### 7. 🎥 Destination YouTube Videos
WeatherWise integrates with the YouTube Data API to retrieve destination-related videos based on the resolved destination, providing an additional source of travel information beyond weather data.

### 8. 💾 Saved Searches
Weather searches are persisted using Supabase/PostgreSQL. Users can access previously saved searches through the Saved Searches section, which includes the searched destination and associated weather information.

### 9. 🔄 CRUD Operations
WeatherWise implements complete CRUD functionality:
- **CREATE**: New weather searches are stored in the database.
- **READ**: Previously saved searches are retrieved and displayed.
- **UPDATE**: Users can edit an existing saved search and save the updated information.
- **DELETE**: Users can remove previously saved searches.

### 10. 📤 Data Export
Weather reports can be exported in **CSV** or **JSON**. The exported data contains weather information associated with the selected search and travel dates.

### 11. 📱 Responsive Design
The interface is designed and adapted for Desktop, Laptop, Tablet, and Smartphone screens while maintaining usability and readability.

### 12. ⚠️ Error Handling
WeatherWise provides user-friendly error handling for empty locations, missing dates, invalid date ranges, unresolved locations, browser geolocation failures, API failures, export failures, and database/API errors.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript, HTML, CSS, Responsive CSS
- **Backend**: Next.js API Routes, TypeScript, REST-style API endpoints
- **Database**: Supabase, PostgreSQL
- **External APIs and Services**: Open-Meteo Weather API, Open-Meteo Geocoding API, Nominatim / OpenStreetMap (reverse geocoding), YouTube Data API
- **Development Tools**: Git, GitHub, npm, VS Code, Postman, Browser Developer Tools

---

## 🏗️ Application Architecture

WeatherWise follows a full-stack architecture:

```text
                    ┌──────────────────────┐
                    │      User / UI       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js / React    │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
                     HTTP/API Requests
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Next.js API       │
                    │       Routes         │
                    └───────┬──────┬───────┘
                            │      │
             ┌──────────────┘      └──────────────┐
             ▼                                     ▼
   ┌────────────────────┐              ┌────────────────────┐
   │ External APIs      │              │ Supabase/PostgreSQL│
   │                    │              │                    │
   │ Open-Meteo         │              │ Saved Searches     │
   │ Nominatim          │              │ CRUD Operations    │
   │ YouTube            │              │ Persistent Data    │
   └────────────────────┘              └────────────────────┘
```

---

## 🔄 Application Workflow

1. User enters a destination
2. User selects start and end dates
3. Frontend validates the input
4. Request is sent to the backend
5. Backend validates the location
6. Location is resolved to coordinates
7. Weather information is retrieved
8. Search information is persisted
9. Weather response is returned to frontend
10. Current weather is displayed
11. Five-day forecast is displayed
12. Date-range forecast is displayed
13. Travel insights are displayed
14. Destination videos are retrieved
15. User can export the weather report
16. User can manage saved searches

---

## 📁 Project Structure

```text
weatherwise/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── export/
│   │   │   │   ├── route.ts
│   │   │   ├── geocode/
│   │   │   │   ├── route.ts
│   │   │   ├── weather/
│   │   │   │   ├── [id]
│   │   │   │   |   ├── route.ts
│   │   │   │   ├── route.ts
│   │   │   └── youtube/
│   │   │   │   ├── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── CurrentWeather.tsx
│   │   ├── DateRangeForecast.tsx
│   │   ├── Forecast.tsx
│   │   ├── SavedSearches.tsx
│   │   ├── WeatherInsights.tsx
│   │   └── YouTubeVideos.tsx
│   │
│   └── lib/
│       ├── export.ts
│       ├── supabase.ts
│       ├── validation.ts
│       ├── weather.ts
│       └── weatherCode.ts
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 💻 Prerequisites

Before running WeatherWise locally, ensure you have:
- Node.js (Version 20+ recommended)
- npm
- Git
- A modern web browser
- A Supabase account
- A YouTube Data API key

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SharvaniKadarla/weatherwise.git
cd weatherwise
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env.local` and add the required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
YOUTUBE_API_KEY=your_youtube_api_key
```

---

## 🔐 Environment Variables

WeatherWise uses environment variables for service configuration.

| Variable Name | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of the Supabase project. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The Supabase publishable key used by the application. |
| `YOUTUBE_API_KEY` | The API key used to access the YouTube Data API. |

### Environment Variable Template
Copy `.env.example` into `.env.local` and replace the placeholder values. Do not commit `.env.local` to GitHub.

---

## ▶️ Running the Application

Start the development server:
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 How to Use WeatherWise

1. **Enter a Destination**: Input a city, ZIP code, landmark, or GPS coordinates (e.g., `40.7128, -74.0060`).
2. **Select Travel Dates**: Select a Start Date and End Date.
3. **Get the Weather**: Click **Get Weather Forecast** to process the request.
4. **Review Weather Information**: View the current conditions, 5-day forecast, travel date-range forecast, travel insights, and videos.
5. **Export the Report**: Download weather reports as CSV or JSON.
6. **Manage Saved Searches**: View, edit, or delete previous search entries in the Saved Searches section.

---

## 📍 Location Handling

WeatherWise supports multiple forms of location input:
- **City or Town**: `New York`
- **ZIP / Postal Code**: `10001`
- **Landmark**: Recognized locations via geocoding
- **GPS Coordinates**: `40.7128, -74.0060`
- **Browser GPS**: Click **📍 Use My Location** to pull current device location via browser Geolocation API.

---

## 🌤️ Weather Data

WeatherWise retrieves weather information using Open-Meteo services. Data fields include:
- Current & Feels-Like Temperature
- Humidity, Wind Speed, Precipitation, Weather Condition & Code
- Daily Max/Min Temperature
- Precipitation Probability & Max Wind Speed

---

## 📅 Date-Range Forecast

Supports travel planning across user-selected periods (e.g., `Start Date: 2026-10-01` to `End Date: 2026-10-05`). The date-range forecast is presented independently from the standard five-day forecast.

---

## 🧭 Travel Insights

Provides automated contextual analysis based on weather trends during the selected travel period, helping users prepare for conditions like rain risk, severe winds, or temperature drops.

---

## 🎥 YouTube Integration

Queries the YouTube Data API for destination videos (e.g., travel guides, tourism highlights) corresponding to the resolved search query.

---

## 💾 Saved Searches and CRUD

Powered by Supabase/PostgreSQL:
- **CREATE**: Search details saved upon successful query execution.
- **READ**: History retrieved on load.
- **UPDATE**: Users can modify search params in place.
- **DELETE**: Remove entries dynamically from UI and database.

---

## 📤 Data Export

Export options available for generated weather reports:
- **CSV**: Best for spreadsheets and reporting.
- **JSON**: Best for developer workflows and programmatic access.

Output format example: `weatherwise-New York.csv` / `weatherwise-New York.json`

---

## 🔌 API Architecture

- `POST /api/weather`: Validates location, resolves coordinates, queries weather data, saves history.
- `POST /api/export`: Generates CSV/JSON payload for download.
- `/api/geocode`: Location resolution and reverse-geocoding.
- `/api/youtube`: Fetches travel videos.

---

## 🗄️ Database

Uses Supabase-hosted PostgreSQL to support persistent search history, saved locations, date-range metadata, and full CRUD workflows.

---

## 🔒 Validation and Error Handling

- **Location Validation**: Ensures non-empty input and valid geocoding responses.
- **Date Validation**: Ensures both dates are present and `End Date >= Start Date`.
- **API/Geolocation Error Handling**: Handles permission denials, timeouts, or API outages gracefully with visual error messages.

---

## 📱 Responsive Design

Fully responsive styling adapted for desktop, tablet, and mobile screens. Includes mobile-friendly forms, fluid typography, flexible grids, and accessible UI element scaling.

---

## ♿ Accessibility Considerations

- Semantic HTML structure
- Form labels and accessible inputs
- Explicit button states & visual focus rings
- Screen-reader friendly error messages (`role="alert"`)
- Reduced-motion query support

---

## 🔐 Security and Environment Variables

Credentials are managed via process environment variables and excluded from source control using `.gitignore` rules:
```text
.env*
!.env.example
```

---

## 🧪 Testing

### Functional Testing Verification
- ✅ Development server startup
- ✅ Location search (City, ZIP, GPS, Landmark)
- ✅ Current weather & 5-day forecast display
- ✅ Date-range weather & travel insights
- ✅ YouTube video retrieval
- ✅ Complete CRUD persistence lifecycle
- ✅ CSV / JSON exports
- ✅ Mobile layout responsiveness

### TypeScript Validation
```bash
npx tsc --noEmit
```

### Production Build Verification
```bash
npm run build
```

---

## 📊 Assessment Requirement Mapping

| Assessment Requirement | WeatherWise Implementation |
| --- | --- |
| JavaScript reactive framework | Next.js + React |
| Web-first application | Responsive web application |
| Current location | Browser Geolocation API |
| ZIP/postal code | Supported through location resolution |
| GPS coordinates | Supported |
| Landmarks | Supported through geocoding |
| Town/city | Supported |
| Current weather | Open-Meteo |
| Weather details | Temperature, humidity, wind, precipitation, etc. |
| Weather icons | Weather condition icons |
| Five-day forecast | Implemented |
| Date-range weather | Implemented |
| Input validation | Implemented |
| Date validation | Implemented |
| Location validation | Implemented |
| Location matching/resolution | Implemented |
| Graceful errors | Implemented |
| Responsive design | Desktop, tablet, mobile |
| Backend | Next.js API routes |
| External APIs | Open-Meteo, Nominatim, YouTube |
| Database | Supabase/PostgreSQL |
| Persistence | Implemented |
| CREATE | Implemented |
| READ | Implemented |
| UPDATE | Implemented |
| DELETE | Implemented |
| Additional API | YouTube Data API |
| CSV export | Implemented |
| JSON export | Implemented |
| API error handling | Implemented |
| Frontend/backend integration | Implemented |
| Project documentation | README included |
| Candidate identification | Sharvani Kadarla |
| PM Accelerator information | Included |

---

## 💡 Full-Stack Capabilities Demonstrated

- **Frontend Engineering**: Next.js, React, TypeScript, responsive layout design, state management, form validation, accessible components.
- **Backend Engineering**: API route handlers, request validation, external service orchestration, data transformation, export generation.
- **Database Engineering**: PostgreSQL via Supabase, schema design, CRUD workflows, persistent data storage.
- **System Integration**: Open-Meteo, Nominatim, YouTube Data API.

---

## 🌐 Repository

The source code is available on GitHub:
[https://github.com/SharvaniKadarla/weatherwise](https://github.com/SharvaniKadarla/weatherwise)

---

## 🚀 Deployment

WeatherWise is deployed on Vercel.

### Production Deployment

**Live Application:** https://weatherwise-delta.vercel.app/

Deployment configuration:

1. GitHub repository connected to Vercel.
2. Next.js framework detected automatically.
3. Production environment variables configured in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `YOUTUBE_API_KEY`
4. Application deployed as a production Next.js application.

---

## 🔮 Future Improvements

- Interactive weather maps
- Hourly forecast breakdowns
- PDF report exports
- Extreme weather alerts
- AI-assisted personalized itinerary suggestions

---

## 👩‍💻 Project Information

- **Project Name**: WeatherWise
- **Application Description**: Real-Time Weather & Travel Intelligence
- **Developer**: Sharvani Kadarla
- **Project Type**: Full-Stack Web Application
- **Purpose**: Technical assessment demonstrating frontend and backend engineering capabilities.
- **Technologies**: Next.js, React, TypeScript, Supabase, PostgreSQL, Open-Meteo, Nominatim / OpenStreetMap, YouTube Data API, Git, GitHub.

---

## 🏢 About PM Accelerator

PM Accelerator is a global product management career development community and training program that helps aspiring and current product managers build product skills, portfolios, interview readiness, and career opportunities through training, coaching, mentorship, and networking.

WeatherWise was developed as part of a hands-on technical project experience associated with PM Accelerator.

Learn more: [https://www.pmaccelerator.io/](https://www.pmaccelerator.io/)

---

## 👤 Author

**Sharvani Kadarla**  
MS Computer Science  
Pace University — Seidenberg School of Computer Science and Information Systems  

---

## 📄 License

This project is intended for educational and technical assessment purposes. If this project is reused or extended, please provide appropriate attribution to the original author.

---

### ⭐ WeatherWise — Real-Time Weather & Travel Intelligence
Plan smarter trips with weather data, forecasts, travel insights, destination videos, persistent search history, and downloadable reports — all in one responsive full-stack application.
