# Git Initialization Guide

This guide provides step-by-step instructions for initializing and setting up a Git repository for our project.


## Basic Git Setup

1. Check if Git is installed:

```bash
git --version
```

2. Configure your Git identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Setup Instructions

1. **Clone the repository**

   ```
   git clone https://github.com/CodeSpace-Academy/ASE_2024_GROUP_A.git
   ```

2. **Navigate to the project directory**

   ```
   cd CodeSpace-Academy/ASE_2024_GROUP_A
   ```

3. **Install dependencies**

   ```
   npm install
   ```

4. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your Firebase configuration:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```
   npm run dev
   ```
   The application should now be running on `http://localhost:3000`.



## Connecting to Remote Repository

1. Create a new repository on GitHub
2. Link your local repository to the remote:

```bash
git remote add origin <repository-url>
```

3. Push your code to the remote repository:

```bash
git push -u origin main
```

## Best Practices

- Write clear, descriptive commit messages
- Use `.gitignore` to exclude unnecessary files
- Commit frequently with logical changes
- Keep your repository clean and organized
- Always pull before pushing when working with others

## Common Issues and Solutions

If you encounter any issues during initialization:

1. **Git not recognized**

   - Ensure Git is properly installed
   - Add Git to your system's PATH

2. **Permission denied**

   - Check your SSH keys
   - Verify repository access rights

3. **Remote rejection**
   - Ensure you have the correct repository URL
   - Confirm you have proper permissions
