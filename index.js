const express = require('express');
const req = require('express/lib/request');
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

const app = express();
app.use(express.json()); 
const port = 8080;

const games = [
    {id: 1, name: "Dota 2", price: "life"},
    {id: 2, name: "Witcher 3", price: 59.99},
    {id: 3, name: "Cyberpunk 2077", price: 59.99},
    {id: 4, name: "CS2", price: 0},
    {id: 5, name: "Minecraft", price: 26.99},
    {id: 6, name: "Forza Horizon 5", price: 59.99},
    {id: 7, name: "Defense of the Ancients: Allstars", price: 0}
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

app.post('/games', (req, res) => {
    if (!req.body.name || !req.body.price){
        return res.status(400).send({ error: 'One or all params are missing'})
    }
    let game = {
        id: games.length + 1,
        price: req.body.price,
        name: req.body.name
    }

    games.push(game)

    res.status(201).location(`${getBaseUrl(req)}/games/${games.length}`)
    .send(game)
})

app.delete('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id, 10); 

    const gameIndex = games.findIndex(game => game.id === gameId);

    if (gameIndex === -1) {
        return res.status(404).send({ error: "Game not found" });
    }

    games.splice(gameIndex, 1);

    res.status(204).send(); 
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http//localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted 
    ? 'https' : 'http' + `://${req.headers.host}` 
}