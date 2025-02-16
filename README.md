# Trip Planner Application

## Overview
This project is a **Trip Planner Application** that allows users to plan trips, optimize routes, and visualize them on an interactive map. The app supports both **users** and **admins** with different functionalities. Users can create and manage their trips, while admins can manage cities, places, and view all trips.

## Features
- **User Features:**
  - Create a trip and select places (hotels, restaurants, attractions)
  - Select starting point for the route
  - Optimize the route to get an efficient travel plan
  - View the optimized route on an interactive map with markers and polyline
  - View detailed information for each day of the trip
  
- **Admin Features:**
  - Manage cities and places (add, edit, delete)
  

## Tech Stack
- **Frontend**: React, TailwindCSS, TomTom Web SDK
- **Backend**: Java Spring Boot
- **Database**: MySQL (JPA for ORM)
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Frontend
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/trip-planner.git
    cd trip-planner
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root of the frontend project and add the following environment variables:
    ```env
    REACT_APP_TOMTOM_API_KEY=your_tomtom_api_key
    ```
    Replace `your_tomtom_api_key` with your actual API key from TomTom.

4. Start the frontend application:
    ```bash
    npm start
    ```

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/trip-planner-backend.git
    cd trip-planner-backend
    ```
2. Install dependencies (ensure you have Java and Maven installed):
    ```bash
    mvn install
    ```
3. Configure the `application.properties` or `application.yml` for database credentials and other configurations.
4. Run the backend:
    ```bash
    mvn spring-boot:run
    ```

### Database Setup
1. Ensure you have MySQL installed and running.
2. Create a new database for the application:
    ```sql
    CREATE DATABASE trip_planner;
    ```
3. You can populate the database with required tables using the JPA repository or by running the migrations.

## Usage

### For Users:
- Sign in with your credentials (you can register as a new user).
- Create a new trip, select places from a list, and then optimize the route for your trip.
- View the optimized route on the map.
- Navigate between days of your trip.

### For Admins:
- Sign in with your admin credentials.
- Manage cities and places (add, edit, or delete them).
- View all users' trips, their details, and see if they have optimized routes.

## Algorithm Details

### Genetic Algorithm (GA) for Route Optimization
The **Genetic Algorithm** is used to find the most optimal route for the trip by simulating natural selection. The algorithm starts by generating an initial population of random routes. It then uses crossover and mutation techniques to evolve the population over multiple generations, improving the routes and selecting the best-performing ones.

#### Key Components:
- **Population Initialization**: Randomly generated initial routes while keeping the starting city fixed.
- **Selection**: Tournament selection is used to pick parents based on their fitness (shorter routes are preferred).
- **Crossover**: The Order Crossover (OX) method is used to combine parent routes to produce offspring.
- **Mutation**: A swap mutation technique is applied with a set mutation rate to introduce diversity in the population.
- **Fitness Evaluation**: Fitness is determined based on the total route distance (lower distance is better).

#### How it Works:
1. **Initialize**: Generate a population of random routes, ensuring the starting city is fixed.
2. **Evaluate Fitness**: Calculate the distance for each route in the population.
3. **Selection and Crossover**: Select parents using tournament selection and apply crossover to create offspring.
4. **Mutation**: Apply mutation to introduce small changes in the offspring's route.
5. **Iterate**: Repeat the process for a predefined number of generations, improving the population's fitness over time.
6. **Final Solution**: After running the algorithm for several generations, the best route is selected as the optimal solution.

### Simulated Annealing (SA) for Route Refinement
**Simulated Annealing** is used as a refinement technique after the initial route is generated using the Genetic Algorithm. It mimics the process of annealing in metallurgy, where a material is heated and slowly cooled to find its optimal state. In the context of route optimization, it explores the solution space by accepting worse solutions with a certain probability to escape local minima, gradually converging to an optimal solution.

#### Key Components:
- **Initial Solution**: The initial solution is typically the result of the Genetic Algorithm.
- **Temperature**: The temperature controls the probability of accepting worse solutions. It starts high and decreases over time.
- **Cooling Rate**: The rate at which the temperature decreases during the optimization process.
- **Neighboring Solutions**: A neighboring solution is generated by swapping two cities in the route.
- **Acceptance Probability**: The probability of accepting a worse solution is determined by the difference in distance and the current temperature.

#### How it Works:
1. **Start with Initial Solution**: The starting point is the solution generated by the Genetic Algorithm.
2. **Generate Neighboring Solution**: Randomly swap two cities in the route.
3. **Calculate Distance Difference**: Calculate the difference in route length between the current and neighboring solutions.
4. **Acceptance Criteria**: Accept the new solution if it is better or based on a probability function if it is worse.
5. **Temperature Update**: Gradually reduce the temperature over time.
6. **Iterate**: Continue the process until the temperature is sufficiently low or the algorithm has converged.

The **Simulated Annealing** algorithm helps to further refine the route generated by **Genetic Algorithm**, minimizing the total distance and improving efficiency.

## API Endpoints
Here are the important backend API endpoints:

- **User APIs:**
  - `GET /api/mytrips`: Get trips created by the currently logged-in user.
  - `POST /api/trip/{tripId}/day/{dayNumber}/optimize`: Optimize the route for a particular day in the user's trip.

- **Admin APIs:**
  - `GET /api/admin/trips`: Get all trips created by all users (admin view).
  - `GET /api/admin/cities`: Get all cities.
  - `GET /api/admin/places`: Get all places categorized by hotel, restaurant, or attraction.

### Auth:
- **JWT Authentication** is used for securing API endpoints. When logged in, the JWT token is returned and needs to be included in the `Authorization` header for subsequent API calls.

### Map Styling:
- The application uses **TomTom Web SDK** to show maps with customized styles.
- Markers, polyline, and labels are shown based on the route selected and optimized.

## Development

### Running Locally
1. Make sure both the backend and frontend servers are running locally.
2. Frontend will be available on `http://localhost:3000/`
3. Backend API will be available on `http://localhost:8081/`

### Customization:
- You can adjust the **map style** and **route optimization** features based on your project requirements.
- The **admin dashboard** is separate from the user-side and provides functionality to manage cities and places.


## Enjoy Trip Planner 🔥
