
import AdminUser from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Function to register a new admin user
export const registerAdmin = async (req, res) => {

  const { name, email, password } = req.body;



  console.log(name);

  try {

    if (name == null || email == null || password == null) {
      return res.status(400).json({ message: 'name email password is required' });
    }

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Dynamically import bcryptjs
    const bcryptModule = await import('bcryptjs');
    const bcrypt = bcryptModule.default || bcryptModule; // Access the default export if necessary

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);



    // Create new user
    const newUser = new AdminUser({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(200).json({ message: 'Admin user registered successfully' , token : token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', });
  }
};



// Function to login admin user
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email == null || password == null) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      // Dynamically import bcryptjs
      const bcryptModule = await import('bcryptjs');
      const bcrypt = bcryptModule.default || bcryptModule; // Access the default export if necessary

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (passwordMatch) {
        const token = generateToken(existingUser._id);

        res.status(200).json({ message: 'Login successful', token: token });
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      return res.status(400).json({ message: 'User does not exist' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
