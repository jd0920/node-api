import mainRoutes from './main';
import userRoutes from './users';

export default {
    '/': mainRoutes,
    '/users': userRoutes
}
