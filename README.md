#Holidaze - Accommodation Booking Application

Holidaze is a modern front-end accommodation booking application built for the final exam project at Noroff. It allows users to browse and book unique venues, while providing venue managers with tools to list and manage their properties.

🌟 Features

The application is divided into two main user roles: Customers and Venue Managers.

## Customers

Browse Venues: View a list of available venues with a clean, responsive card layout.

Search & Filter: Search for venues by name or description. Filter results by specific regions (continents) or guest capacity.

View Details: See detailed information about a venue, including amenities (Wifi, Parking, etc.), location, and host details.

Book Stays: Select dates using an interactive calendar to book a venue.

Note: Calendar automatically disables past dates and dates already booked by others.

Manage Bookings: View upcoming bookings in the user profile and cancel them if necessary.

## Venue Managers

Register as Manager: Option to register a new account with "Venue Manager" status.

Manager Dashboard: A dedicated dashboard to oversee all managed venues.

Create Venues: Add new venues with details like price, max guests, description, location, and up to 5 images.

Edit/Delete Venues: Update venue details or delete listings directly from the dashboard.

View Bookings: See who has booked your venues and when.

## 🛠️ Tech Stack

Framework: React (via Vite)

Language: TypeScript

Styling: Tailwind CSS

Routing: React Router DOM

State/Data Fetching: Native React Hooks (useState, useEffect) + Custom Hooks

Icons: Lucide React

Animations: Framer Motion

Date Handling: React Day Picker

Notifications: React Hot Toast

## 🚀 Getting Started

Prerequisites

Node.js (v16 or higher)

npm or yarn

## Installation

1. **Clone the repo**

```bash
git clone [https://github.com/cgrotteland92/holidaze.git](https://github.com/cgrotteland92/holidaze.git)
cd holidaze
```

2.**Install dependencies**

```bash
  npm install
```

3.**Run app**

```bash
npm run build
```

Open http://localhost:5173 to view it in the browser.

🤝 API Reference

This project uses the Noroff Holidaze API v2.

Base URL: https://v2.api.noroff.dev

Documentation: Noroff API Docs

This project is for educational purposes.
