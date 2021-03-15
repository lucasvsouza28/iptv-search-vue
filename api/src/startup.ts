import * as express from 'express';
import { SearchRouterInstance } from './routes/search.router';
import * as path from 'path';
import cors from 'cors';
const history = require('connect-history-api-fallback');

class StartUp {

    App: express.Application = express();

    constructor() {
        // carrega midlewares
        this.middlewares();

        // configura rotas
        this.configureRoutes();
    }

    middlewares(): void {
        this.App.use(express.json());
        this.App.use(express.urlencoded({ extended: true }));
        this.App.use(express.static(path.join(__dirname, "../")));
        this.App.use(cors());
    }

    configureRoutes(): void {
        this.App.use('/api/test', (req, res) => {
            res.send('Works');
        });

        this.App.use('/api/search', SearchRouterInstance.Router);
	
        this.App.get("*", (req, res) => {
	    res.sendFile(path.join(__dirname, "../index.html"));
	});
    }

}

export const StartUpInstance = new StartUp();
