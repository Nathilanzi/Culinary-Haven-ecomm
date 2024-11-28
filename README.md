🍴 Recipe App
A culinary companion for all your recipe needs!

✨ Project Overview
The Recipe App is a cutting-edge platform designed to revolutionize how users discover, manage, and utilize recipes. Whether you're a home cook, a professional chef, or someone seeking inspiration, our app offers features to simplify and elevate your cooking experience.

🌟 Key Feature
🔍 Search Recipes Find recipes using keywords, cuisine, or ingredients.
📥 Offline Access: Download recipes for viewing when you’re offline.
🔔 Push Notifications: Receive updates on new recipes, personalized suggestions, and more.
🤝 User-Centric Design: Navigate an intuitive and sleek interface, making cooking easy and fun.
🔑 User Authentication: Sign up and log in to save favorites, create shopping lists, and more.
💻 Technologies Used
🌐 Frontend: React, Next.js, Bootstrap, and CSS for responsive design.
🔧 Backend: Node.js, Express, and Next.js API routes for dynamic content handling.
🛢️ Database: MongoDB for storing user data, recipes, favorites, and shopping lists.
🔌 APIs: Integrated with Spoonacular API for fetching recipe data.
⚡ Authentication: NextAuth.js for managing user authentication with Google and Credentials providers.
📩 Contact Us
Have questions or need support? Reach out to the team:

Email: asegroupa@gmail.com
GitHub Issues: Report an Issue
Community: Join us on Discord.
We’re here to help!

📚 API Documentation
Our app is powered by robust APIs designed to integrate seamlessly with modern applications. Below are some example endpoints:

1. Search Recipes
   GET /api/recipes/search
   Description: Fetch recipes based on search queries.
   Request Example:

json
{
"query": "pasta",
"cuisine": "Italian"
}
Response Example:

json
[
{
"id": 101,
"name": "Spaghetti Carbonara",
"ingredients": ["spaghetti", "eggs", "parmesan"],
"steps": ["Step 1", "Step 2"]
}
] 2. Download Recipe
POST /api/recipes/download
Description: Save recipes for offline access.
Request Example:

json
{
"recipeId": 101
}
Response Example:

json
{
"status": "success",
"message": "Recipe downloaded successfully"
} 3. User Authentication
POST /api/auth/signup & POST /api/auth/login
Description: Handles user registration and login.
Request Example:

json
{
"email": "user@example.com",
"password": "password123"
}
⚙️ Setting Up Environment Variables
To ensure the app runs smoothly, configure the environment variables by creating a .env file in the root directory:

DB_CONNECTION=mongodb://localhost:27017/recipe-app
API_KEY=your_recipe_api_key
NEXTAUTH_URL=http://localhost:3000
PORT=3000
Replace your_recipe_api_key with the key provided by the recipe API service.

📥 Installation Instructions
Getting started is quick and easy!

Step 1: Clone the Repository
git clone https://github.com/zacharyschroder/ASE-GROUPA.git
cd ASE-GROUPA
Step 2: Install Dependencies
npm install
Step 3: Set Up Environment Variables
Create a .env file as shown in the Environment Variables section.

Step 4: Start the Application
npm run dev
Step 5: Access the App
Visit http://localhost:3000 in your browser.

🚀 Git Initialization Guide
This guide provides step-by-step instructions for initializing and setting up a Git repository for our project.

🔧 Basic Git Setup
Check if Git is installed
git --version
Configure your Git identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
📂 Setup Instructions
Clone the repository
git clone https://github.com/CodeSpace-Academy/ASE_2024_GROUP_A.git
Navigate to the project directory
cd CodeSpace-Academy/ASE_2024_GROUP_A
Install dependencies
npm install
Set up environment variables
Create a .env.local file in the root directory and add your Firebase configuration:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
Run the development server
npm run dev
The application should now be running on http://localhost:3000.

🔗 Connecting to Remote Repository
Create a new repository on GitHub.
Link your local repository to the remote
git remote add origin <repository-url>
Push your code to the remote repository
git push -u origin main
💡 Best Practices
Write clear, descriptive commit messages.
Use .gitignore to exclude unnecessary files.
Commit frequently with logical changes.
Keep your repository clean and organized.
Always pull before pushing when working with others.
❗ Common Issues and Solutions
Git not recognized: Ensure Git is properly installed and added to your system’s PATH.
Permission denied: Check your SSH keys and repository access rights.
Remote rejection: Verify the repository URL and permissions.
Thank you for making the Recipe App better! 🍳
