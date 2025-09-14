const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require('qs'); // for turning js object into url encoded string format
const { OAuth2Client } = require('google-auth-library');

//local signup controller
exports.localSignup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "both username and password are required " });
    }
    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ message: "username already taken" });
    }
    const newUser = new User({
      username: username,
      password: password,
    });
    await newUser.save();
    return res.status(201).json({ message: "User created succefully" /*, newUser (for testing)*/});
  } catch (err) {
    next(err);
  }
};

//local login controller
exports.localLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "both username and password are required " });
    }
    const theuser = await User.findOne({ username }).select('+password'); //to include password field (because i made it hidden in the model)
    if (!theuser) {
      return res.status(404).json({ message: "User not found" });
    }
    const samePassword = await theuser.comparePassword(password);
    if (!samePassword) {
      return res.status(404).json({ message: "wrong username or password" });
    }
    const token = jwt.sign({ userId: theuser._id, username: theuser.username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
      user: {
        _id: theuser._id,
        username: theuser.username,
        email: theuser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};


//Google OAuth2 controller
exports.google = async (req,res,next) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Missing authorization code' });

  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  
  const headers = { //url encoded format body
  'Content-Type': 'application/x-www-form-urlencoded' };

  const tokenRequestBody = {
  code: code,
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  grant_type: 'authorization_code'
  };
  
  try {
    
    const response = await axios.post(tokenEndpoint , qs.stringify(tokenRequestBody), {headers})
    const { id_token,access_token  } = response.data;

    //verifying the id_token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const tokenPayload = ticket.getPayload();
    //search for the user in the db with email or username
    const theuser = await User.findOne({ googleId: tokenPayload.sub }).lean();
    
    if (!theuser) { //creating a new user

      //generate a unique username based on the name
      const base = tokenPayload.name?.replace(/\s+/g, '').toLowerCase() || 'user';
      let username = base;
      let counter = 0;

      while (await User.findOne({ username })) {
        counter++;
        username = `${base}${counter}`;
      }

      const newUser = new User({
          googleId: tokenPayload.sub,
          name: tokenPayload.name,
          username: username,
          email: tokenPayload.email,
          avatar: tokenPayload.picture,
          provider: 'google'})

        await newUser.save();
        //jwt token generation
        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
        expiresIn: "24h",
        });

        return res.status(200).json({
        token,
        message: 'Login successful',
        user:{         
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email       
        },
        
        });
      }

      //if user exists we log them in
      const token = jwt.sign({ userId: theuser._id, username: theuser.username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
      });

      return res.status(200).json({
        token,
        message: 'Login successful',
        user: {         
          _id: theuser._id,
          username: theuser.username,
          email: theuser.email       
        },      
      });

  } catch(err) {
    console.error('_________________________Google token error:', err.response?.data || err.message);

    next(err);
  }

}






//exports.googleRedirect;
//exports.googleCallback;
