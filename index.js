const { app } = require('./app.js');
const port = process.env.PORT;
require('dotenv').config();

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
