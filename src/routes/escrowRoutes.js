const express = require("express")
const router = express.Router();
const escrowController= require("../controllers/escrowController")

router.post("/liberarEncomenda/:id", escrowController.liberarEncomenda)


module.exports=router;