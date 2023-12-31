const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Booking = require('./models/Booking');
const User = require('./models/User'); // Adjust the path accordingly
const app = express();

app.use(express.json())
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://rakesh:rakeshreddy@doctorbooking.j4y7psz.mongodb.net/?retryWrites=true&w=majority')
   .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
   })
   .catch((error) => {
    console.log(error)
   })

app.use((req , res , next) => {
  console.log(req.path , req.method)
  next()
})

 
app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await Booking.find(); // You might want to add filters and sorting based on your requirements
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/bookings', async (req, res) => {
  try {
    // Assuming the request body contains the data according to your schema
    const newBooking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
