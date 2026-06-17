const { Router } = require("express");
const router = Router();

const API_URL = process.env.API_URL || "http://127.0.0.1:3000/books";

router.get("/", function (req, res, next) {
    fetch(API_URL)
        .then((response) => response.json())
        .then((books) =>
            res.render("inventory", {
                books: Array.isArray(books) ? books : [],
                message: req.query.message || null,
            })
        )
        .catch(next);
});

router.post("/add", function (req, res, next) {
    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
    })
        .then(() => res.redirect("/inventory?message=Livre ajoute avec succes"))
        .catch(next);
});

router.get("/:id", function (req, res, next) {
    fetch(`${API_URL}/${req.params.id}`)
        .then((response) => response.json())
        .then((book) => res.render("book", { book }))
        .catch(next);
});

router.post("/:id/edit", function (req, res, next) {
    fetch(`${API_URL}/${req.params.id}`, {
        method: "PATCH",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
    })
        .then(() => res.redirect("/inventory?message=Livre modifie avec succes"))
        .catch(next);
});

router.post("/:id/delete", function (req, res, next) {
    fetch(`${API_URL}/${req.params.id}`, { method: "DELETE" })
        .then(() => res.redirect("/inventory?message=Livre supprime avec succes"))
        .catch(next);
});

module.exports = router;