const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Booking = require('./models/Booking');
// const userRoutes = require('./routes/users')
const User = require('./models/User'); // Adjust the path accordingly
const app = express();

app.use(express.json())
app.use(cors());
const PORT = 5000;

mongoose.connect('mongodb+srv://rakeshreddy:qwertyuiop@cluster0.qv06xju.mongodb.net/?retryWrites=true&w=majority')
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

app.post("/api/users/register" , async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash and salt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
});
app.post( "/api/users/login" , async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User Not Found');
    }
    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid Password');
    }
    const token = jwt.sign({id: user._id}, "SECRET",{expiresIn:"1d"},);
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    // console.log(process.env.JWT_SECRET);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
});

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


// app.get('/api/bookings', (req, res) => {
//   // Sort doctors based on total earnings in descending order
//   const sortedDoctors = Booking.sort((a, b) => {
//     const totalEarningsA = a.bookedServicesData.reduce((sum, service) => sum + service.amount, 0);
//     const totalEarningsB = b.bookedServicesData.reduce((sum, service) => sum + service.amount, 0);
//     return totalEarningsB - totalEarningsA;
//   });

//   // Get the top 10 doctors
//   const top10Doctors = sortedDoctors.slice(0, 10);
  
//   res.json(top10Doctors);
// });


// app.get('/api/bookings/top', (req, res) => {
//   // Sort doctors based on amount in descending order
//   const sortedDoctors = Booking.sort((a, b) => b.bookedServicesData.amount - a.bookedServicesData.amount);

//   // Get the top 10 doctors
//   const top10Doctors = sortedDoctors.slice(0, 10);

//   res.json(top10Doctors);
// });


// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ userId: user._id }, 'secret-key', {
//       expiresIn: '1h',
//     });

//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
  
