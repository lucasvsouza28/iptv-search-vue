import { StartUpInstance } from './startup';

const port = process.env.PORT || 3000;
StartUpInstance.App.listen(port, () => {
    console.log('API listenig on port ' + port);
});