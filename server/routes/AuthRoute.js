import express from 'express';
import { loginUser, registerUser } from '../controllers/AuthController.js';

const router = express.Router();

// Add middleware to verify request format
router.use(express.json());

// Enhanced route with error handling
router.post('/register', async (req, res, next) => {
  try {
    // Log incoming request for debugging
    console.log('Registration request body:', req.body);
    
    // Manual validation example
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, password, username' 
      });
    }

    // Proceed to controller
    await registerUser(req, res, next);
    
  } catch (error) {
    console.error('Registration route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', loginUser);

export default router;