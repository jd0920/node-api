import http from 'http';
import url from 'url';
const DMZ = {};

/**
 * Api mini framework manager interface
 * @param {object} routeHandlers all the routes for the api
 */
const Api = function Manager(routeHandlers) {
    if (typeof routeHandlers !== 'object') {
        throw new TypeError('routeHandlers must be an object');
    }
    const routes = routeHandlers || {};
    let server = http.createServer(incoming);

    /**
     * Prepares the response object to have some utility methods.
     * @param {IncomingMessage} _res Mutate's the response object to provide some utility methods to use to make things easier.
     */
    function prepareRes(_res) {
        let res = _res;
        res.jsonResponse = function(obj) {
            this.writeHead(this.statusCode, {
                'Content-Type': 'application/json'
            });
            this.write(JSON.stringify(obj));
            return this;
        }
        res.status = function(status) {
            this.statusCode = status;
            return this;
        }
        res.send = function(content) {
        }
        return res;
    }

    /**
     * Handles incoming requests to the server and directs the requests and response objects to the right handler in the routes.
     * @param {IncomingMessage} req Node's HTTP IncomingMessage
     * @param {IncomingMessage} res Node's HTTP IncomingMessage 
     */
    function incoming(req, res) {
        const parsedUrl = url.parse(req.url);
        if (Object.keys(routes).length === 0) {
            console.log('no route handlers');
            req.destroy();
        }
        res = prepareRes(res);
        if (routes[parsedUrl.pathname]) {
            if (req.method.toLowerCase() === 'post') {
                let data = '';
                req.on('data', chunk => {
                    data += chunk.toString();
                }).on('end', () => {
                    try {
                        data = JSON.parse(data);
                        req.body = data;
                    } catch (e) {
                        console.error(e);
                    }
                    routes[parsedUrl.pathname][req.method.toLowerCase()].apply(DMZ, [req, res]);
                });
            } else {
                routes[parsedUrl.pathname][req.method.toLowerCase()].apply(DMZ, [req, res])
            }
        } else {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write('404 Handler Not Found');
            res.end();
        }
    }

    /**
     * Starts the server on the specified port
     * @default 3000
     * @param {number} port the port the server will listen on
     */
    function start(port) {
        server.listen(process.env.PORT || port || 3000, () => {
            console.log(`listening on ${server.address().port }`)
        })
    }
    
    return {
        start
    }
}

export default Api
