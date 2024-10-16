import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import partnersRoutes from "./routes/partnersRoute.js"

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', partnersRoutes);

app.listen(port, () => {
    console.log(`IDI NA http://localhost:${port}`)
})