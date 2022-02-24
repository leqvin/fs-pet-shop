var fs = require('fs'); // add this to the top of your js file

// console.log("Usage: node pets.js [read | create | update | destroy]")

// console.log(process.argv)

const subcommand = process.argv[2];

dealWithFile();



async function readFileAsync(filename) {
    return new Promise((resolve, reject)=> {
      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data));
      });
    });
  }
 
   
async function dealWithFile() {
   const data = await readFileAsync('pets.json');
   
   console.log("Data received from file "+ data)
}
 


// if (subcommand === "read") {
//     const readIndex = Number(process.argv[3]);
//     readFile(readIndex);
//     console.log("reading");
//     console.log(readIndex);
// } else if (subcommand === "create") {
//     let age = process.argv[3];
//     let kind = process.argv[4];
//     let name = process.argv[5];
//     //createPet(age,kind,name);
//     //let pets2 = readFile()
//     //readFile()
//     //console.log("creating")
// } else if (subcommand === "update") {
//     console.log("updating")
// } else if (subcommand === "destroy") {
//     console.log("destroying")
// } else {
//     console.error("Usage: node pets.js [read | create | update | destroy]");
//     process.exit(1)
// }

function createPet(age, kind, name){
    let pets = readFile()
    console.log(pets)
}

//Usage: node pets.js create AGE KIND NAME

//var text = fs.readFileSync('pets.json','utf8')
//console.log (text)


// function readFile(readIndex){
//     fs.readFile("pets.json",'utf8',function(error, data){
//         if(error){
//             throw error;
//         } else {
//             let pets = JSON.parse(data)
            
//             if (readIndex < 0 || readIndex > pets.length-1){
//                 console.log("Out of Index, <Usage: node pets.js read INDEX>")
//             } else if (isNaN(readIndex)){
//                 //console.log(pets)
//                 console.log(data)
//             }
//             else {
//                 console.log(pets[readIndex]);
//             }
            
//         }
//     })
// }


