const userRoutes = {
    'get': (req, res) => {
        res.status(200)
            .jsonResponse({
                message: 'user resource'
            }).end();
    }
};
export default userRoutes;
