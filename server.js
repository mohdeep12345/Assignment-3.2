/********************************************************************************* 

WEB322 – Assignment 03 

I declare that this assignment is my own work in accordance with Seneca
Academic Policy. No part of this assignment has been copied manually or 
electronically from any other source (including 3rd party web sites) or 
distributed to other students. I acknoledge that violation of this policy
to any degree results in a ZERO for this assignment and possible failure of
the course. 

Name:   Mohdeep Singh
Student ID:   109600239
Date:  03 November 2024
Cyclic Web App URL:  https://assignment-3-2-6dht.onrender.com
GitHub Repository URL:  https://github.com/mohdeep12345/Assignment-3.2.git

********************************************************************************/  
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const express = require('express');
const storeService = require("./store-service");
const path = require("path");
const app = express();
const upload = multer(); // No storage specified, we will use Cloudinary directly

const HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
    cloud_name: 'MOHDEEP',  // Replace with your Cloud Name
    api_key: '319446695579865',        // Replace with your API Key
    api_secret: 'qtnAGrUvzR8WL5ydJCQpF4qBz9I',  // Replace with your API Secret
    secure: true
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // To handle form submissions

app.get('/', (req, res) => {
    res.redirect("/about");
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Route to render the add item form
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addItem.html"));
});

// POST route for adding items
app.post('/items/add', upload.single('featureImage'), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        }).catch((err) => {
            console.log("Error uploading image:", err);
            res.redirect('/items/add'); // Redirect in case of error
        });
    } else {
        processItem(""); // No file uploaded
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        storeService.addItem(req.body).then(() => {
            res.redirect("/items");
        }).catch((err) => {
            console.log("Error adding item:", err);
            res.redirect('/items/add'); // Redirect on error
        });
    }
});

// Updated /items route to support filtering by category and minDate
app.get('/items', (req, res) => {
    const category = req.query.category;
    const minDate = req.query.minDate;

    if (category) {
        storeService.getItemsByCategory(category).then((data) => {
            res.json(data);
        }).catch(err => {
            res.json({ message: err });
        });
    } else if (minDate) {
        storeService.getItemsByMinDate(minDate).then((data) => {
            res.json(data);
        }).catch(err => {
            res.json({ message: err });
        });
    } else {
        storeService.getAllItems().then((data) => {
            res.json(data);
        }).catch(err => {
            res.json({ message: err });
        });
    }
});

// New route to get a single item by ID
app.get('/item/:id', (req, res) => {
    const id = parseInt(req.params.id);
    storeService.getItemById(id).then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    }).catch(err => {
        res.json({ message: err });
    });
});

app.get('/categories', (req, res) => {
    storeService.getCategories().then((data) => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});

app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

storeService.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log('Server listening on: ' + HTTP_PORT);
    });
}).catch((err) => {
    console.log(err);
});
