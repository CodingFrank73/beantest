const express = require('express');
const cors = require('cors');

const dotenv = require("dotenv").config();

const { userRouter } = require('./routes/user-router');

const app = express();
const PORT = process.env.PORT || 9000;


// Body-Parser -> *** WICHTIG ***
app.use(express.json())



app.use(cors({ origin: true, credentials: true }))

app.get('/', (req, res) => {
    res.send('Herzlich willkommen auf meinem Server!!!')
})

app.use("/api/users", userRouter)

app.listen(PORT, () => {
    console.log(`Server listen on Port: ${PORT}`);
})