# 🍳 Recipe Sharing App

A beautiful and modern full-stack web application for sharing and discovering recipes. Built with FastAPI, React, MongoDB, and Tailwind CSS.

## ✨ Features

- 📝 **Add New Recipes** - Create recipes with ingredients, instructions, cooking time, and difficulty
- 🔍 **Search Recipes** - Real-time search across recipe titles, descriptions, and ingredients
- ✏️ **Edit Recipes** - Modify existing recipes with an intuitive modal form
- 🗑️ **Delete Recipes** - Remove recipes with confirmation dialog
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🖼️ **Beautiful Images** - High-quality food photography integrated
- 🎯 **Difficulty Levels** - Easy, Medium, Hard difficulty badges
- ⏱️ **Cooking Time** - Display estimated cooking time for each recipe

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Emoji-based icons

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **MongoDB** - [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Git** - [Download Git](https://git-scm.com/downloads)

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd recipe-sharing-app
```

### Step 2: Set Up the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=recipe_sharing_db
   ```

### Step 3: Set Up the Frontend

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory with:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

### Step 4: Start MongoDB

1. **Start MongoDB service:**
   - On Windows: Start MongoDB service from Services panel
   - On macOS: `brew services start mongodb/brew/mongodb-community`
   - On Linux: `sudo systemctl start mongod`

2. **Verify MongoDB is running:**
   Open a new terminal and run:
   ```bash
   mongosh
   ```
   If MongoDB is running, you'll see a connection message.

### Step 5: Run the Application

1. **Start the Backend Server:**
   In the backend directory (with virtual environment activated):
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

2. **Start the Frontend Server:**
   In a new terminal, navigate to the frontend directory:
   ```bash
   npm start
   ```
   or with yarn:
   ```bash
   yarn start
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

## 📁 Project Structure

```
recipe-sharing-app/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Tailwind styles
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── .env                  # Frontend environment variables
├── tests/                    # Test files
├── scripts/                  # Utility scripts
└── README.md                 # This file
```

## 🔌 API Endpoints

### Recipe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Health check |
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes?search=term` | Search recipes |
| POST | `/api/recipes` | Create new recipe |
| GET | `/api/recipes/{id}` | Get recipe by ID |
| PUT | `/api/recipes/{id}` | Update recipe |
| DELETE | `/api/recipes/{id}` | Delete recipe |

### Example Recipe Object

```json
{
  "id": "uuid-string",
  "title": "Classic Chocolate Chip Cookies",
  "description": "Soft and chewy homemade cookies",
  "ingredients": [
    "2 cups all-purpose flour",
    "1 tsp baking soda",
    "1 cup butter, softened"
  ],
  "instructions": [
    "Preheat oven to 375°F",
    "Mix flour and baking soda",
    "Cream butter and sugars"
  ],
  "cooking_time": "25 minutes",
  "difficulty": "Easy",
  "image_url": "https://example.com/image.jpg",
  "created_at": "2024-01-01T00:00:00"
}
```

## 🧪 Testing the Application

### Test Backend API

1. **Health Check:**
   ```bash
   curl http://localhost:8001/api/
   ```

2. **Create a Recipe:**
   ```bash
   curl -X POST http://localhost:8001/api/recipes \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Recipe",
       "description": "A test recipe",
       "ingredients": ["ingredient 1", "ingredient 2"],
       "instructions": ["step 1", "step 2"],
       "cooking_time": "30 minutes",
       "difficulty": "Easy"
     }'
   ```

3. **Get All Recipes:**
   ```bash
   curl http://localhost:8001/api/recipes
   ```

### Test Frontend

1. Open http://localhost:3000 in your browser
2. Try adding a new recipe using the "Add New Recipe" button
3. Test the search functionality
4. Try editing and deleting recipes

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. MongoDB Connection Error**
```
pymongo.errors.ServerSelectionTimeoutError
```
**Solution:** Make sure MongoDB is running and accessible on the configured port.

**2. Port Already in Use**
```
OSError: [Errno 48] Address already in use
```
**Solution:** Kill the process using the port or use a different port:
```bash
# Kill process on port 8001
sudo lsof -t -i:8001 | xargs kill -9

# Or run on different port
uvicorn server:app --port 8002
```

**3. Frontend Won't Start**
```
Error: Cannot find module 'react-scripts'
```
**Solution:** Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

**4. API Calls Failing**
**Solution:** Check if REACT_APP_BACKEND_URL in frontend/.env matches your backend URL.

**5. Missing Dependencies**
**Solution:** Install missing packages:
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=recipe_sharing_db
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🔒 Security Notes

- This is a demo application - add authentication for production use
- Validate and sanitize all user inputs
- Use HTTPS in production
- Set up proper CORS policies
- Use environment variables for sensitive configuration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with love using modern web technologies
- Images provided by Unsplash
- Icons and emojis for better user experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation at http://localhost:8001/docs
3. Open an issue on GitHub
4. Contact the development team

---

**Happy Cooking! 🍳✨**

Made with ❤️ by [Your Name]
#   M E R N - P R O J E C T 1  
 #   M E R N - P R O J E C T 1  
 #   M E R N - P R O J E C T 1  
 