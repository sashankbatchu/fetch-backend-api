const express = require('express');
const app = express();
const PriorityQueue = require('js-priority-queue');
app.use(express.json());
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`The API is running on port ${PORT}`);
})

const transactions = new PriorityQueue({
    comparator: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
});
let payerTotals = {};

app.post('/add', (req, res) => {
    const {payer, points, timestamp} = req.body;
    
    if (payerTotals[payer] + points < 0) {
        return res.status(400).send("Payer cannot have negative points.");
    }

    transactions.queue({payer, points, timestamp});
    if (!payerTotals[payer]) {
        payerTotals[payer] = points;
    } else {
        payerTotals[payer] += points;
    }

    res.status(200).send(); 
});

app.post('/spend', (req, res) => {
    let pointsToSpend = req.body.points;
    let currUserPoints = Object.values(payerTotals).reduce((acc, curr) => acc + curr, 0);
    if (currUserPoints < pointsToSpend) {
        res.status(400).send("User does not have enough points!");
    }

    let payerDeductions = [];

    while (pointsToSpend > 0 && transactions.length > 0) {
        let oldestTransaction = transactions.dequeue();
        const {payer, points, timestamp} = oldestTransaction;

        if (payerTotals[payer] > 0) {
            const pointsToDeduct = Math.min(pointsToSpend, points);
            pointsToSpend -= pointsToDeduct;
            payerTotals[payer] -= pointsToDeduct;

            payerDeductions.push({payer: payer, points: -pointsToDeduct});

            const remainingTransPoints = points - pointsToDeduct;
            if (remainingTransPoints > 0) {
                transactions.queue({payer: payer, points: remainingTransPoints, timestamp: timestamp});
            }
        }
    }

    res.status(200).json(payerDeductions); 
});

app.get("/balance", (req, res) => {
    res.status(200).json(payerTotals);
})