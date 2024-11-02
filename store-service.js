/********************************************************************************* 

WEB322 – Assignment 02 
I declare that this assignment is my own work in accordance with Seneca
Academic Policy.  No part of this assignment has been copied manually or 
electronically from any other source (including 3rd party web sites) or 
distributed to other students. I acknoledge that violation of this policy
to any degree results in a ZERO for this assignment and possible failure of
the course. 

Name:   Mohdeep Singh
Student ID:   109600239
Date:  02 November 2024
Cyclic Web App URL:  
GitHub Repository URL:  

********************************************************************************/  
let items = []; // This will store your items in memory

function initialize() {
    return new Promise((resolve, reject) => {
        // Initialize with some sample data if needed
        resolve();
    });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        resolve(items.filter(item => item.published)); // Filter to get only published items
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        resolve(items); // Return all items
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        // Example categories, can be replaced with a database call
        resolve([
            { id: 1, name: "Home, Garden" },
            { id: 2, name: "Electronics, Computers, Video Games" },
            { id: 3, name: "Clothing" },
            { id: 4, name: "Sports & Outdoors" },
            { id: 5, name: "Pets" }
        ]);
    });
}

function addItem(itemData) {
    return new Promise((resolve, reject) => {
        itemData.published = itemData.published === undefined ? false : true;
        itemData.id = items.length + 1;
        items.push(itemData);
        resolve(itemData);
    });
}

// Step 1: Add the getItemsByCategory(category) Function
function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category == category);
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("No results returned");
        }
    });
}

// Step 2: Add the getItemsByMinDate(minDateStr) Function
function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => new Date(item.postDate) >= new Date(minDateStr));
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("No results returned");
        }
    });
}

// Step 3: Add the getItemById(id) Function
function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id === id);
        if (item) {
            resolve(item); // Return found item
        } else {
            reject("No result returned");
        }
    });
}

// Exporting the functions
module.exports = {
    initialize,
    getPublishedItems,
    getAllItems,
    getCategories,
    addItem,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById
};
