const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "zaktDB";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("students");

  // the following code examples can be pasted here...

  //adding one document to collection
  const insertResult = await collection.insertOne({
    name: "zaki",
    email: "zaki@gmail.com",
  });

  ////adding many document to collection
  //   const insertResult = await collection.insertMany([
  // { name: "supriadi", email: "supriadi@email.com" },
  //  { name: "bagas", email: "bagas@email.com" },
  //   ]);
  console.log("Inserted documents =>", insertResult);

  //return all document in a collection
  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);

  //   //return filtered document in a collection
  //   const filteredDocs = await collection.find({ name: "maulana" }).toArray();
  //   console.log(
  //     "Found documents filtered by { name: 'maulana' } =>",
  //     filteredDocs
  //   );

  //   //update document in a collection
  //   const updateResult = await collection.updateOne(
  //     { name: "suyadi" },
  //     { $set: { name: "trisna", email: "trisna@email.com" } }
  //   );
  //   console.log("Updated documents =>", updateResult);

  //   //remove a document in a collection
  //   const namesToDelete = ["trisna", "Akhsangg"];
  //   const deleteResult = await collection.deleteMany({
  //     name: { $in: namesToDelete },
  //   });
  //   console.log("Deleted documents =>", deleteResult.deletedCount);

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
