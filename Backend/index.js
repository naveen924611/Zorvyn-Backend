const app = require('./src/app');
const { connectDB } = require('./src/utils/mongodb');
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
