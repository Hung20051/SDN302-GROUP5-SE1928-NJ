const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getListings,
  getListing,
  createListing,
} = require("../controllers/listingController");

router.get("/", getListings);
router.get("/:id", getListing);
router.post("/", auth, createListing);

module.exports = router;
