const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


require('dotenv').config();




// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('request send ')
})


//1HzpQZYnChI6I66m
//sabeek_user1
// console.log(process.env.DB_USER)




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t6qkdhj.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hyiqifu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});





app.listen(port, () => {
    console.log('listening to port .')
})


async function run() {
    try {

        const routineCollection = client.db('medico').collection('routine');
        const messageCollection = client.db('medico').collection('message');



        app.get('/routine', async (req, res) => {
            console.log(req.params);
            const email = req.query.email;
            const day = req.query.day;
            const query = { email, day };
            const teachers = await routineCollection.find(query).toArray();

            teachers.sort((a, b) => {
                const timeA = getTimeValue(a.time);
                const timeB = getTimeValue(b.time);

                if (timeA < timeB) {
                    return -1;
                }
                if (timeA > timeB) {
                    return 1;
                }
                return 0;
            });

            res.send(teachers);
        });

        function getTimeValue(timeString) {
            const [time, period] = timeString.split(' ')[0].split('-');
            const [hours, minutes] = time.split(':');
            let numericValue = parseFloat(hours);

            if (period && period.toLowerCase() === 'pm' && numericValue !== 12) {
                numericValue += 12;
            }

            numericValue += parseFloat(minutes) / 60;

            return numericValue;
        }

        app.post('/routine', async (req, res) => {
            const teacher = req.body;
            const result = await routineCollection.insertOne(teacher);
            res.send(result);
        });
        app.get('/message', async (req, res) => {
            const query = {};
            const message = await messageCollection.find(query).toArray();
            console.log(message)
            res.send(message);
        });
        app.post('/message', async (req, res) => {
            const recent = req.body;
            const message = await messageCollection.insertOne(recent);
            res.send(message);
        });


        app.delete('/message/:id', async (req, res) => {
            console.log('hitting')
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await messageCollection.deleteOne(filter);
            res.send(result);
        })










    }
    finally {

    }
}
run().catch(console.log);