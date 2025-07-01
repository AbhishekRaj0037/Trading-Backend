import express from "express";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser({}));

interface Balances {
    [key: string]: number;
}

interface User {
    id: string;
    balances: Balances;
};

interface Order {
    userId: String;
    price: Number;
    quantity: Number;
}

const users: User[] = [{
    id: "1",
    balances: {
        "GOOGLE": 10,
        "USD": 50000
    }
}, {
    id: "2",
    balances: {
        "GOOGLE": 10,
        "USD": 50000
    }
}];

const bids: Order[] = [];
const asks: Order[] = [];

export const Ticker = "GOOGLE";

app.post('/order', (req: any, res: any) => {
    const side: string = req.body.side;
    const price: Number = req.body.price;
    const quantity: Number = req.body.quantity;
    const userId: String = req.body.userId;

    const remainingQty = fillOrders(side, price, quantity, userId);
    if (remainingQty == 0) {
        res.json({ filledQuantity: quantity });
        return;
    }
    if (side == "bid") {
        bids.push({
            userId: userId,
            price: price,
            quantity: quantity
        });
        bids.sort((a, b) => a.price < b.price ? -1 : 1);
    }
    else {
        asks.push({
            userId: userId,
            price: price,
            quantity: quantity
        });
        asks.sort((a, b) => a.price > b.price ? 1 : -1);
    }
    res.json({
        filledQuantity: quantity - remainingQty,
    })
})


app.get('/balance/:userId', (req, res) => {
    let userId = req.params.userId;
    let user = users.find((x) => x.id == userId);
    if (!user) {
        return;
    }
    res.json({ balances: user.balances });
})

function flipBalance(userId1: string, userId2: string, quantity: number, price: number) {
    let user1 = users.find(x => x.id == userId1);
    let user2 = users.find(x => x.id == userId2);
    if (user1 || user2) {
        return;
    }
    user1.balances[Ticker] = user1.balances[Ticker] - quantity;
    user2.balances[Ticker] = user2.balances[Ticker] + quantity;
    user1.balances["USD"] = user1.balances["USD"] + (quantity * price);
    user2.balances["USD"] = user2.balances["USD"] - (quantity * price);
}

function fillOrders(side: string, price: Number, quantity: Number, userId: String) number{
    let remainingQty = quantity;
    if (side == "bid") {
        for (let i = asks.length - 1; i >= 0; i--) {
            if (asks[i].price > price) {
                continue;
            }
            else if (asks[i].quantity > remainingQty) {
                asks[i].quantity = asks[i].quantity - remainingQty;
                flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
                return;
            }
            else {
                remainingQty -= asks[i].quantity;
                flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
                asks.splice(i, 1);
            }
        }
    }
    else {
        if (bids[i].price < price) {
            continue;
        }
        else if (bids[i].quantity > remainingQty) {
            bids[i].quantity -= remainingQty;
            flipBalance(userId, bids[i].userId, remainingQty, price);
            return 0;
        }
        else {
            remainingQty -= bids[i].quantity;
            flipBalance(userId, bids[i].userId, bids[i].quantity, price);
            bids.splice(i, 1);
        }

    }
    return remainingQty;
}
