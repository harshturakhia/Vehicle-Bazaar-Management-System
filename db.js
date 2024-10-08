const mongoose = require('mongoose');

const connectDB = async () => {
    
    try {
        await mongoose.connect('mongodb+srv://harshturakhia2002:wFvvNgbDZby4b1ju@vms.lrmexcc.mongodb.net/?retryWrites=true&w=majority&appName=VMS');
        console.log('Database connected on Cloud Atlas ');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
