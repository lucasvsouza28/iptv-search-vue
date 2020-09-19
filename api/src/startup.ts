import * as express from 'express';
import { SearchRouterInstance } from './routes/search.router';
import * as path from 'path';
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

        // habilita CORS
        this.App.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });
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
