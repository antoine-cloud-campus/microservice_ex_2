const gateway = require("fast-gateway");

const port = process.env.PORT || 9001;

const INVENTORY = process.env.INVENTORY_URL || "http://127.0.0.1:3000";
const ORDERS    = process.env.ORDERS_URL    || "http://127.0.0.1:3001";
const PAYMENTS  = process.env.PAYMENTS_URL  || "http://127.0.0.1:3002";

const server = gateway({
  routes: [
    { prefix: "/inventory", target: INVENTORY, hooks: {} },
    { prefix: "/orders",    target: ORDERS,    hooks: {} },
    { prefix: "/payments",  target: PAYMENTS,  hooks: {} },
  ],
});

server.start(port).then(() => {
  console.log("API Gateway running on port " + port);
});