const { Router } = require("express");
const router = Router();

const PAYMENT_API = process.env.PAYMENT_API || "http://127.0.0.1:3002/payments";

// LISTE
router.get("/", function (req, res, next) {
  fetch(PAYMENT_API)
    .then((r) => r.json())
    .then((payments) =>
      res.render("payments", {
        payments: Array.isArray(payments) ? payments : [],
        message: req.query.message || null,
      })
    )
    .catch(next);
});

// AJOUT
router.post("/add", function (req, res, next) {
  const body = { ...req.body };
  if (body.amount) body.amount = Number(body.amount);
  fetch(PAYMENT_API, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(r.status + " : " + JSON.stringify(data));
      res.redirect("/payments?message=Paiement cree");
    })
    .catch(next);
});

// DÉTAIL / ÉDITION
router.get("/:id", function (req, res, next) {
  fetch(`${PAYMENT_API}/${req.params.id}`)
    .then((r) => r.json())
    .then((payment) => res.render("payment", { payment }))
    .catch(next);
});

// MODIFICATION
router.post("/:id/edit", function (req, res, next) {
  const body = { ...req.body };
  if (body.amount) body.amount = Number(body.amount);
  fetch(`${PAYMENT_API}/${req.params.id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (r) => {
      if (!r.ok) { const d = await r.json(); throw new Error(r.status + " : " + JSON.stringify(d)); }
      res.redirect("/payments?message=Paiement modifie");
    })
    .catch(next);
});

// SUPPRESSION
router.post("/:id/delete", function (req, res, next) {
  fetch(`${PAYMENT_API}/${req.params.id}`, { method: "DELETE" })
    .then(() => res.redirect("/payments?message=Paiement supprime"))
    .catch(next);
});

module.exports = router;