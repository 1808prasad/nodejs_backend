/*Dependencies*/
const express = require('express')
const app = express()
const port = 4001
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
var fs = require('fs');


const UserInfo = require('./userModel');

const cors = require('cors')
const multer = require('multer')

app.use(cors())

app.use(bodyParser.json());

app.use('/images', express.static('images'));

// Mongodb connction
(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/users ');

    console.log('MongoDB connected');
  } catch (err) {
    console.log('error: ' + err);
  }
})();

// Store image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

// Get all user list
app.get('/', async(req, res) => {
	console.log('Getting all user list');

    const user = await UserInfo.find().then();
	res.status(200).json({
    status: 'success',
    message: 'Get all User',
    user,
    });
})

// Add new user
app.post('/', async(req, res) => {
   console.log('Creating user Record');
    const { body } = req;
    console.log('Frontend Body', body);
  
   // parse through models
    const doc = new UserInfo(body);
    console.log('doc after validation', doc);
   
    // final validation
    await doc.validate();
  
    console.log(`After Validation: ${doc}`);
  
    const user = await UserInfo.create(doc).then();
  
    res.status(200).json({
      status: 'success',
      message: 'Created user',
      user,
    });
})


// Add new user image
app.post('/upload',upload.single('photo'), async(req, res) => {
  
    res.status(200).json({
      status: 'success',
      message: 'Upload image',
    });
})


// Get single user details
app.get('/:id', async(req, res) => {
	const { id } = req.params;
    console.log(`Getting user for Id ${id}`);

    const user = await UserInfo.findById(id).then();
	res.status(200).json({
    status: 'success',
    message: `Got user Id=${id}`,
    user,
    });
})

// Update user details
app.patch('/:id',async(req, res) => {
	 const { id } = req.params;
    const { body } = req;
    console.log(`Updating user Id ${id}`);
	
	// parse through models
    const userToUpdate = new UserInfo(body);
    console.log(body);
    const doc = userToUpdate.toObject();
    delete doc._id;
	
	const userdata = await UserInfo.findById(id).then();
	
	// Remove image
	if(userdata.image_url){
		const filePath = './images/'+userdata.image_url; 
		fs.unlinkSync(filePath);
	}

    const user = await UserInfo.findByIdAndUpdate(id, doc, {
        new: true,
    }).then();

    res.status(201).json({
        status: 'success',
        message: `Updated user Id=${id}`,
        user ,
    });
})


// Update user image
app.patch('/upload/:id', upload.single('photo'),async(req, res) => {
	

    res.status(201).json({
        status: 'success',
        message: 'Updated user image ',
    });
})

// Delete user details
app.delete('/:id', async(req, res) => {
	const { id } = req.params;
    console.log(`Deleting user Id ${id}`);

    const user = await UserInfo.findByIdAndDelete(id).then();
	
	
	// Remove image
	if(user.image_url){
		const filePath = './images/'+user.image_url; 
		fs.unlinkSync(filePath);
	}

    res.status(200).json({
        status: 'success',
        message: `Deleted user Id=${id}`,
        data: { user },
    });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})