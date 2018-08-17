const mainRoutes = {
    'get': function (req, res) {
        res.status(200).jsonResponse({
            message: 'main route'
        }).end();
    },
    'post': (req, res) => {   
        res.status(200)
            .jsonResponse({
                message: 'main route post',
                payload_received: req.body
            }).end();
    }
}
export default mainRoutes;
