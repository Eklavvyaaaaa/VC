require('dotenv').config({path: '.env.local'});
fetch('http://localhost:3000/api/companies').then(r=>r.json()).then(console.log);
