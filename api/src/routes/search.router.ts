import * as express from 'express';
import { SearchServiceInstance } from '../services';

class SearchRouter {

    Router: express.Router = express.Router();

    constructor() {
        this.configureRoutes();
    }

    configureRoutes(): void {
        this.Router.route('/')
            .post(async (req, res, next) => {

                try {
                    const { query, url } = req.body;
                    let groups = [];

                    if (query && url) groups = await SearchServiceInstance.Search(url, query);

                    res.json({ url, query, groups });

                } catch (error) {
                    next(error);
                }

            });
    }

}

export const SearchRouterInstance = new SearchRouter();