const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

const app = express();
const port = 8080;

const games = [
    {id: 1, name: "Dota 2", price: "life"},
    {id: 2, name: "Witcher 3", price: 59.99},
    {id: 3, name: "Cyberpunk 2077", price: 59.99},
    {id: 3, name: "CS2", price: 0},
    {id: 3, name: "Minecraft", price: 26.99},
    {id: 3, name: "Forza Horizon 5", price: 59.99},
    {id: 3, name: "Defense of the Ancients: Allstars", price: 0}
]

app.get('/games', (req, res) => {
    res.send(games)
})

app.get('/games/:id', (req, res) => {
    if (typeof games[req.params.id - 1] === 'undefined'){
        return res.status(404).send({error: "Game not found"})
    }
    res.send(games[req.params.id - 1])
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http//localhost:${port}`)
})