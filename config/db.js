const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {

   try {
         await mongoose.connect(
           'mongodb+srv://amine:ham1234ma@cluster0.pm63z.mongodb.net/MERN?retryWrites=true&w=majority',
           {
             useNewUrlParser: true,
             useUnifiedTopology: true,
             useCreateIndex:true,
             useFindAndModify: false
           }
         );
         console.log('MongoDB connected')
   }catch(err){
        console.log(err)
   }
}

module.exports = connectDB
