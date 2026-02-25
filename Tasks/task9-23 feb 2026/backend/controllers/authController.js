import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

// Login an admin
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      // For demo purposes, if no admin exists, create one using default credentials 'admin'/'admin123'
      if (username === 'admin' && password === 'admin123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const newAdmin = new Admin({ username: 'admin', password: hashedPassword });
        await newAdmin.save();
        
        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, username: newAdmin.username });
      }
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};
