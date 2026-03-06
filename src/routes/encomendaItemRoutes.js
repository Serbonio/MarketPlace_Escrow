const express = require("express")
const router = express.Router();
const encomendaItemController = require("../controllers/encomendaItemController")


router.get("/:id/items", encomendaItemController.getDetalhes)

module.exports= router;