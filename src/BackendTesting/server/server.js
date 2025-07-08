const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const mockPath = path.join(__dirname, 'mock.json');

let data = [];
let index = 0;

// Load mock data once on server start
try {

    const raw = fs.readFileSync(mockPath);
    const parsed = JSON.parse(raw);
    data = parsed;


} catch(err) {
    console.error("Failed to load mock data:", err);
}

// Serve one entry at a time, cycling every 3 seconds
app.get('/data', (req, res) => {

    if (data.length === 0) return res.status(500).send({error: 'No data available'});

    const item = data[index];

    index = (index + 1) % data.length;  // loop
    res.json([item]);   // wrapped in array for compatibility

})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

