var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const {
  listUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  getCatalogs,
} = require("./users");
const {
  createPatio,
  readPatio,
  updatePatio,
  deletePatio,
  listPatios,
  // getCatalogs,
} = require("./patios");

var cors = require("cors");

const PORT = process.env.SERVER_PORT || 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

/*
app.use(cors({
  origin: 'http://localhost:3000'
}));
*/

var allowlist = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://18.222.201.4:8080",
  "http://3.16.91.101:8080",
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { credentials: true, origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

var router = express.Router();

router.get("/", function (req, res) {
  res.send("Dylk!");
});

/**
 *
 * Users
 * ---------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------
 */
app.options("/users", cors(corsOptionsDelegate));

router.get("/users/catalogs", cors(corsOptionsDelegate), function (req, res) {
  getCatalogs()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

// enable pre-flight request for DELETE request
app.options("/users/:id", cors(corsOptionsDelegate));

router.get("/users", cors(corsOptionsDelegate), function (req, res) {
  listUsers(req.query)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.post("/users", cors(corsOptionsDelegate), function (req, res) {
  createUser(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.get("/users/:id", cors(corsOptionsDelegate), function (req, res) {
  readUser(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.put("/users/:id", cors(corsOptionsDelegate), function (req, res) {
  updateUser(req.params.id, req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.delete("/users/:id", cors(corsOptionsDelegate), function (req, res) {
  deleteUser(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

/**
 *
 * Patios
 * ---------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------
 */
app.options("/patios", cors(corsOptionsDelegate));

router.get("/patios/catalogs", cors(corsOptionsDelegate), function (req, res) {
  getCatalogs()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

// enable pre-flight request for DELETE request
app.options("/patios/:id", cors(corsOptionsDelegate));

router.get("/patios", cors(corsOptionsDelegate), function (req, res) {
  listPatios(req.query)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.post("/patios", cors(corsOptionsDelegate), function (req, res) {
  createPatio(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.get("/patios/:id", cors(corsOptionsDelegate), function (req, res) {
  readPatio(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.put("/patios/:id", cors(corsOptionsDelegate), function (req, res) {
  updatePatio(req.params.id, req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.delete("/patios/:id", cors(corsOptionsDelegate), function (req, res) {
  deletePatio(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

app.use(router);

app.listen(PORT, function () {
  console.log(`Node server running on http://localhost:${PORT}`);
});
