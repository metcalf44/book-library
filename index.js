
const app = require('./src/app.js');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});