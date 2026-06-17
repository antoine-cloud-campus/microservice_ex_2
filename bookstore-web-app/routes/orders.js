const { Router } = require("express");
const router = Router();

// URL configurable (on la fera pointer vers la gateway en Partie 3)
const ORDER_API = process.env.ORDER_API || "http://127.0.0.1:3001/orders";

// LISTE
router.get("/", function (req, res, next) {
  fetch(ORDER_API)
    .then((r) => r.json())
    .then((orders) =>
      res.render("orders", {
        orders: Array.isArray(orders) ? orders : [],
        message: req.query.message || null,
      })
    )
    .catch(next);
});

// AJOUT
router.post("/add", function (req, res, next) {
  console.log("Body reçu :", req.body);          // ← regarde le terminal du front
  const body = { ...req.body };
  if (body.totalAmount) body.totalAmount = Number(body.totalAmount); // string → number

  fetch(ORDER_API, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(r.status + " : " + JSON.stringify(data));
      res.redirect("/orders?message=Commande creee");
    })
    .catch(next);
});

// DÉTAIL / ÉDITION
router.get("/:id", function (req, res, next) {
  fetch(`${ORDER_API}/${req.params.id}`)
    .then((r) => r.json())
    .then((order) => res.render("order", { order }))
    .catch(next);
});

// MODIFICATION
router.post("/:id/edit", function (req, res, next) {
  const body = { ...req.body };
  if (body.totalAmount) body.totalAmount = Number(body.totalAmount);

  fetch(`${ORDER_API}/${req.params.id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (r) => {
      if (!r.ok) { const d = await r.json(); throw new Error(r.status + " : " + JSON.stringify(d)); }
      res.redirect("/orders?message=Commande modifiee");
    })
    .catch(next);
});

// SUPPRESSION
router.post("/:id/delete", function (req, res, next) {
  fetch(`${ORDER_API}/${req.params.id}`, { method: "DELETE" })
    .then(() => res.redirect("/orders?message=Commande supprimee"))
    .catch(next);
});

module.exports = router;