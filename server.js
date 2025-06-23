const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./server/routes/auth-routes/index");
const mediaRoutes = require("./server/routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./server/routes/instructor-routes/course-routes");
const instructorStudentProgressRoutes = require("./server/routes/instructor-routes/student-progress-routes");
const instructorActivityRoutes = require("./server/routes/instructor-routes/activity-routes");
const studentViewCourseRoutes = require("./server/routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./server/routes/student-routes/order-routes");
const studentCoursesRoutes = require("./server/routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./server/routes/student-routes/course-progress-routes");
const studentRatingRoutes = require("./server/routes/student-routes/rating-routes");
const studentCartRoutes = require("./server/routes/student-routes/cart-routes");
const studentCertificateRoutes = require("./server/routes/student-routes/certificate-routes");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection with connection pooling for serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const MONGO_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000",
      "https://localhost:5173",
      "https://localhost:3000"
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve static files from server/public
app.use('/server-assets', express.static(path.join(__dirname, 'server/public')));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/instructor/course", instructorCourseRoutes);
app.use("/api/instructor/student-progress", instructorStudentProgressRoutes);
app.use("/api/instructor/activity", instructorActivityRoutes);
app.use("/api/student/course", studentViewCourseRoutes);
app.use("/api/student/order", studentViewOrderRoutes);
app.use("/api/student/courses-bought", studentCoursesRoutes);
app.use("/api/student/course-progress", studentCourseProgressRoutes);
app.use("/api/student/rating", studentRatingRoutes);
app.use("/api/student/cart", studentCartRoutes);
app.use("/api/student/certificate", studentCertificateRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve React App (Static Files)
app.use(express.static(path.join(__dirname, 'client/dist')));

// Handle React Router - send all non-API requests to React app
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  }
  
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
  };
} else {
  // For local development
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  });
}
