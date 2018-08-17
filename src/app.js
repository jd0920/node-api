import routes from './routes';
import Api from './api';
const server = Api(routes);

server.start(3000);