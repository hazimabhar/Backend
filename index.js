const express = require('express') 
const app = express()
const {PrismaClient} = require ("@prisma/client")
const cors = require ('cors')
const bcrypt = require('bcrypt')
const { getMalaysiaDateTime } = require("./datetimeUtils");

const prisma = new PrismaClient()
const cron = require('node-cron');

let loginAttempt =0


app.use(cors({
  origin:'*'
}))

// app.use(cors({ origin: '*' }));


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
//   });

// const allowedOrigins = ['https://kedairuncit.onrender.com', 'https://sistemkedairuncit.onrender.com'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));




app.use(express.json())


 
//crud user
app.get("/", async (req, res)=>{

    const allUsers = await prisma.user.findMany({
      include :{
        Worker:true,
        Manager: true,
        // Sale:true,
      }
    })
    res.json(allUsers)
}) 
app.get("/nric", async (req,res)=>{
  const checkedNric = await prisma.user.findMany({
    select:
    {
      icNumber:true 
    }
  })
  res.json(checkedNric)
})
 
app.post("/", async (req, res)=>{
  const {icNumber,password,role}=req.body

  try{
    const hashedPassword = await bcrypt.hash(password,10) 
    const user={
      icNumber,
      password : hashedPassword,
      role
    }
    const newUser = await prisma.user.create({data: user})
    res.json(newUser)
  }
  catch(error){
    console.log(error)
    res.status(500).send("Error creating new subject")
  }
})


app.post("/login", async(req,res)=>{
  const {icNumber,password}=req.body
  const user = await prisma.user.findUnique({
    where:{
      icNumber
    }
  })
  if (!user)
  {
    return res.status(401).send("Invalid Identification Number")
  }
  const passwordMatch = await bcrypt.compare(password, user.password)

  if(!passwordMatch)
  {
    loginAttempt++
    if(loginAttempt>3)
    {
      return res.status(401).send("Invalid Password. Please reset your password")
    }
    return res.status(401).send("Invalid Password")
  }
  const userId = user.idAccount 
  loginAttempt=0

  res.send(userId)

})
  
app.put("/:id", async (req, res)=>{
  const id = req.params.id
  res.json(updateUser) 
}) 
 
app.delete("/:id", async (req, res)=>{
  const id = req.params.id
  const deleteUser = await prisma.user.delete({where: {idAccount: id }})
  res.json(deleteUser) 
})
  

//crud worker
app.get("/worker", async (req, res)=>{
  const allWorker = await prisma.worker.findMany({
    include:{
      User:true
    }
  })
  res.json(allWorker)
}) 
app.get("/emailworker", async (req, res)=>{
  const emailWorker = await prisma.worker.findMany({
    select:
    {
      email:true
    }
  }) 
  res.json(emailWorker)
}) 
app.post("/worker", async (req, res)=>{
  const newWorker = await prisma.worker.create({data: req.body})
  res.json(newWorker) 
})
 
app.put("/worker/:id", async (req, res)=>{
  const id = req.params.id
  const newName = req.body.name
  const newAddress = req.body.address  
  const newPhoneNumber = req.body.phoneNumber
  const newEmail = req.body.email 
  // const newPassword = req.body.password
  const newGender = req.body.gender
  const newRole = req.body.role
  const updateWorker = await prisma.worker.update({
    where: {idWorker: id }, 
    data: {
      name :newName,
      // password:newPassword,
      address : newAddress,
      phoneNumber : newPhoneNumber, 
      email:newEmail,
      gender:newGender,
      role:newRole
    }})
  res.json(updateWorker)
})

// app.delete("/worker/:id", async (req, res)=>{  
//   const idWorker = req.params.id
//   const deleteWorker = await prisma.worker.delete({where: {idWorker:idWorker}})
//   const deleteUser = await prisma.user.delete({where:{idAccount:deleteWorker.idAccount}})
//   res.json(deleteWorker)
// })

app.delete("/worker/:id", async (req, res) => {
  const idWorker = req.params.id;

  // Find the worker to be deleted
  const deleteWorker = await prisma.worker.delete({
    where: { idWorker: idWorker }
  });

  // Find the sales associated with the worker's user
  const userSales = await prisma.sale.findMany({
    where: { idAccount: deleteWorker.idAccount }
  });

  // Collect the IDs of the sales to be deleted
  const saleIds = userSales.map(sale => sale.idSale);

  // Delete the list item data associated with the sales
  const deleteListItems = await prisma.listitem.deleteMany({
    where: { idSale: { in: saleIds } }
  });

  // Delete the sale data associated with the user
  const deleteSales = await prisma.sale.deleteMany({
    where: { idAccount: deleteWorker.idAccount }
  });

  // Find the user associated with the worker
  const deleteUser = await prisma.user.delete({
    where: { idAccount: deleteWorker.idAccount }
  });

  res.json(deleteWorker);
});

app.get("/worker/:id", async (req,res)=>{
  const oneWorker = await prisma.worker.findUnique({
    where:{
      idWorker : req.params.id
    },
    include:{
      User:true
    }
  })
  res.json(oneWorker)
})


//crud manager 
app.get("/manager", async (req, res)=>{
  const allManager = await prisma.manager.findMany({
    include:
    {
      User:true
    }
  }) 
  res.json(allManager) 
}) 
app.get("/emailmanager", async (req, res)=>{
  const emailManager = await prisma.manager.findMany({
    select:
    {
      email:true
    }
  }) 
  res.json(emailManager)
}) 
app.post("/manager", async (req, res)=>{
  const newManager = await prisma.manager.create({data: req.body})
  res.json(newManager)
})
 
app.put("/manager/:id", async (req, res)=>{
  const id = req.params.id
  const newName = req.body.name
  const newAddress = req.body.address
  const newPhoneNumber = req.body.phoneNumber
  const newEmail = req.body.email  
  // const newPassword = req.body.password
  const newGender = req.body.gender
  const newRole = req.body.role
  const updateManager = await prisma.manager.update({
    where: {idManager: id }, 
    data: { 
      name :newName, 
      // password:newPassword,
      address : newAddress,
      phoneNumber : newPhoneNumber,
      email:newEmail,
      gender:newGender,
      role:newRole
    }}) 
  res.json(updateManager)
})
  
app.delete("/manager/:id",async (req,res)=>{
  const idManager =req.params.id
  const deleteManager = await prisma.manager.delete({where: {idManager:idManager}})
  const deleteUser = await prisma.user.delete({where:{idAccount:deleteManager.idAccount}})
  res.json(deleteManager)
})

app.get("/manager/:id",async(req,res)=>{
  const oneManager = await prisma.manager.findUnique(
    {
      where:
      {
        idManager: req.params.id
      },
      include:
      {
        User:true
      }
    }
  )  
  res.json(oneManager)
})
  
//crud item 


//getcashier
app.get("/item/cashier/:barcode", async (req,res)=>{
  const barcode = req.params.barcode
  const listitem = await prisma.item.findUnique(
    {
      where:
      {
        barcode : barcode
      }
    }
  )
  if (listitem === null || listitem === undefined || listitem === '') {
    res.status(404).json({ error: "Item not found" });
  } else {
    res.json(listitem);
  }  
}) 

//getitemsearch
app.get("/item/search/:input", async (req, res) => {
  const input = req.params.input;
  let listitem;
  if (isNaN(input)) {
    // Input is item name
    listitem = await prisma.item.findFirst({
      where: {
        name: input,
      },
    });
  } else {
    // Input is barcode
    listitem = await prisma.item.findUnique({
      where: {
        barcode: input,
      }, 
    });
  }

  if (listitem) {
    res.json(listitem);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});
app.get("/item/notification", async (req, res)=>{
  const lowItem = await prisma.item.findMany({  
    where:
    {
      quantity:{
        lt:6
      }
    },
    orderBy:{ 
      name:'asc'
    }
  })
  res.json(lowItem) 
}) 
//getcanned
app.get("/item/canned",async (req,res)=>{
  const canned = await prisma.item.findMany(
    {
      where:{ 
        category : "Tin"
      }, 
      orderBy:{ 
        name:'asc'
      }
    })
    res.json(canned)
})

//getdetergent
app.get("/item/detergent",async (req,res)=>{
  const detergent = await prisma.item.findMany(
    {
      where:{
        category : "Sabun"
      },
      orderBy:{
        name:'asc'
      }
    })
    res.json(detergent)
})

//getdrink
app.get("/item/drink",async (req,res)=>{
  const drink = await prisma.item.findMany(
    {
      where:{
        category : "Minuman"
      },
      orderBy:{
        name:'asc'
      }
    })
    res.json(drink)
})

//getspice 
app.get("/item/spice",async (req,res)=>{
  const spice = await prisma.item.findMany(
    {
      where:{
        category : "Rempah"
      },
      orderBy:{
        name:'asc'
      }
    }) 
    res.json(spice)
})

//getbread
app.get("/item/bread",async (req,res)=>{
  const bread = await prisma.item.findMany(
    {
      where:{
        category : "Roti"
      },
      orderBy:{
        name:'asc'
      }
    })
    res.json(bread)
})
  
//getsauce 
app.get("/item/sauce",async (req,res)=>{
  const sauce = await prisma.item.findMany(
    {
      where:{
        category : "Sos"
      },
      orderBy:{
        name:'asc'
      }
    })
    res.json(sauce)
})

//getfood
app.get("/item/food",async (req,res)=>{
  const food = await prisma.item.findMany(
    {
      where:{
        category : "Makanan"
      },
      orderBy:{ 
        name:'asc'
      }
    })
    res.json(food)
})

//gettools
app.get("/item/tool",async (req,res)=>{
  const tool = await prisma.item.findMany(
    {
      where:{
        category : "Alatan"
      },
      orderBy:{
        name:'asc'
      }
    })
    res.json(tool)
})

//getitembyid
app.get("/item/:id", async (req, res)=>{
  const oneItem = await prisma.item.findUnique({ 
    where:
    {
      idItem: req.params.id
    }
  })  
  res.json(oneItem)
})

//getitemcashier
app.get("/item/quantity/:idItem", async (req,res)=>{
  const {idItem} = req.params
  const idItems = idItem.split(",");

  const findItem = await Promise.all(
    idItems.map((itemId)=> prisma.item.findUnique({
      where:
      {
        idItem:itemId 
      }, 
      select: {
        idItem: true,  
        quantity: true, 
        price:true,
        name:true
      }, 
    })) 

  )
  res.json(findItem)
})
//getitemforreport
app.get("/item/report/:idItem", async (req, res) => {
  const { idItem } = req.params;
  const idItems = idItem.split(",");
  const foundItems = {}; // Cache for storing already found items

  const findItem = await Promise.all(
    idItems.map(async (itemId) => {
      if (foundItems[itemId]) {
        // If item is already found, return it from cache
        return foundItems[itemId];
      } else {  
        const item = await prisma.item.findUnique({
          where: {
            idItem: itemId,
          },
          select: {
            idItem: true,
            quantity: true,
            price: true,
            name: true,
          },
        });
        foundItems[itemId] = item; // Cache the found item
        return item;
      }
    })
  );

  res.json(findItem);
});

//getbarcodeonly
app.get('/barcode', async (req, res) => { 
  const { barcode } = req.query;
  const checkBarcode = await prisma.item.findMany({
    select: {
      barcode: true, 
    }, 
  })
      res.json(checkBarcode);
})

//getallitem
app.get("/item", async (req, res)=>{
  const allItem = await prisma.item.findMany({  
    orderBy:{ 
      name:'asc'
    }
  })
  res.json(allItem) 
})

//postitem
app.post("/item", async (req, res) => {
  const { weight, unit, ...rest } = req.body;

  const newItemData = {
    ...rest,
    weight: weight || null,
    unit: unit || null,
  };

  const newItem = await prisma.item.create({ data: newItemData });
  res.json(newItem);
});
//updateinfo
app.put("/item/:id", async (req, res)=>{
  const id = req.params.id
  const newName = req.body.name 
  const newCategory = req.body.category
  const newPrice = req.body.price
  const newBarcode = req.body.barcode
  const newWeight = req.body.weight 
  const newUnit = req.body.unit
  const newQuantity = req.body.quantity
  const newFilePath = req.body.image
  const updateItem = await prisma.item.update({
    where: {idItem: id }, 
    data: {
      name :newName,
      category : newCategory,
      price :newPrice, 
      barcode : newBarcode,
      weight : newWeight,
      unit: newUnit,
      quantity : newQuantity,
      image : newFilePath
    }})
  res.json(updateItem)
})
//updatestock
app.put("/item/updatestock/:id", async (req, res)=>{
  const id = req.params.id
  const newQuantity = req.body.newQuantity
  const updateStock = await prisma.item.update({ 
    where: {idItem: id }, 
    data: {
      quantity : newQuantity 
    }})
  res.json(updateStock)
})  
//updatequantity 
app.put("/item/cashier/updatequantity",async(req,res)=>{
  const newQuantity = req.body;
  for (const idItem in newQuantity) {
    const updatedQuantity = newQuantity[idItem];

    await prisma.item.update({
      where: { idItem },
      data: { quantity: updatedQuantity },
    });
  }

  res.send('Quantities updated successfully');
})
// deleteitem   
app.delete("/item/:id", async (req, res) => {
  const id = req.params.id;

  // Delete the corresponding ListItem records
  const deleteListItems = await prisma.listitem.deleteMany({
    where: { idItem: id },
  }); 

  // Delete the item
  const deleteItem = await prisma.item.delete({ where: { idItem: id } });

  res.status(200).json({ deleteItem, deleteListItems });
});
  
 
//crud sale
app.get("/sale", async (req, res)=>{
  const allSale = await prisma.sale.findMany({
    include :{
      user:true,
      listitem: true,
    }
  })
  res.json(allSale)
})  
//getsalebyid
app.get("/sale/:idSale", async (req,res)=>{
  const {idSale} = req.params
  const idSales = idSale.split(",");

  const findSale = await Promise.all(
    idSales.map((saleId)=> prisma.sale.findUnique({
      where:
      {
        idSale:saleId 
      }, 
      select: {
        listitem:{
          select:{
            idItem:true,
            quantity:true,
            totalPrice:true,
          }
        }
      }, 
    })) 

  )
  res.json(findSale)
})
app.post("/sale", async (req, res)=>{
  const newSale = await prisma.sale.create({data: req.body})
  res.json(newSale)
}) 
 
app.put("/sale/:id", async (req, res)=>{
  const id = req.params.id
  const newPrice = req.body.price
  const newPaymentMethod = req.body.paymentMethod
  const updateSale = await prisma.sale.update({
    where: {idSale: id }, 
    data: {
      price :newPrice,
      paymentMethod : newPaymentMethod
    }})
  res.json(updateSale) 
})  
 
app.delete("/sale/:id", async (req, res)=>{ 
  const id = req.params.id
  const deleteSale = await prisma.sale.delete({where: {idSale:id}})
  res.json(deleteSale) 
}) 
 
//crud report 
//getallreport 
app.get("/report/today", async (req, res) => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const todayReport = await prisma.report.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  console.log(today);
  console.log(startDate);
  console.log(endDate);
  console.log(todayReport);
  
  res.json(todayReport);
});

app.get("/report", async (req, res)=>{ 
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);


  const fullReport = await prisma.report.findMany(
    {
      where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      },
      include:
      {
        sale:{
          include:{
                listitem:{
                  include:{
                    Item:true,
                  }
                }
          }
        }
      }
    }
  )
  res.json(fullReport)
}) 
 
app.post('/report', async (req, res) => { 
  const {Sale, numberSale, saleRevenue} =req.body
  const newReport = await prisma.report.create({
  data:
  {
    Sale,
    numberSale,
    saleRevenue
  } 
  })
  res.json(newReport)   
}); 

//insertnumbersaleandsalerevenue
app.put("/report/:id", async (req, res)=>{
  const id = req.params.id
  const newNumberSale = req.body.numberSale
  const newSaleRevenue = req.body.saleRevenue
  const updateReport = await prisma.report.update({
    where: {idReport: id }, 
    data: {
      numberSale :newNumberSale,
      saleRevenue : newSaleRevenue,
    }})
  res.json(updateReport)
})
//insertreportpdf
app.put("/report/file/:id", async (req, res)=>{
  const id = req.params.id  
  const newFilePath = req.body.filePath
  const newFileName = req.body.fileName
  const updateReport = await prisma.report.update({
    where: {idReport: id }, 
    data: {
      filePath : newFilePath,
      fileName : newFileName
    }})
  res.json(updateReport)
})
app.delete("/report/:id", async (req, res)=>{ 
  const id = req.params.id
  const deleteReport = await prisma.report.delete({where: {idReport:id}})
  res.json(deleteReport) 
})
app.get("/allreport", async (req, res)=>{ 
  const fullReport = await prisma.report.findMany(); // Assuming you have a Prisma client instance named "prisma" configured properly
  res.json(fullReport);
}) 

//listitem
app.get("/listitem", async (req, res)=>{
  const allItemBuyList = await prisma.listitem.findMany()
  res.json(allItemBuyList)
})
 
app.post("/listitem", async (req, res)=>{
  const newItemBuyList = await prisma.listitem.create({data: req.body})
  res.json(newItemBuyList)
})
 
// app.put("/itembuylistuser/:id", async (req, res)=>{
//   const id = req.params.id
//   const newNumberSale = req.body.numberSale
//   const newSaleRevenue = req.body.saleRevenue
//   const updateReport = await prisma.itembuylistuser.update({
//     where: {idReport: id }, 
//     data: {
//       numberSale :newNumberSale,
//       saleRevenue : newSaleRevenue,
//     }})
//   res.json(updateReport)
// })
  
app.delete("/listitem/:id", async (req, res)=>{ 
  const id = req.params.id
  const deleteItemBuyList = await prisma.listitem.delete({where: {idBuyList:id}})
  res.json(deleteItemBuyList) 
})
 
app.post("/salebuylist",async (req,res)=>{
  const { saleData, itemData } =req.body

  const createSale = await prisma.sale.create({
    data:
    {
      price : saleData.price,
      paymentMethod: saleData.paymentMethod,
      idAccount : saleData.idWorker, 
      idReport: saleData.idReport
    } 
  })
  const createListItem = await Promise.all(
    itemData.idItem.map(async (id,index) => { 

      const quantity = itemData.quantity[index]
      const totalPrice = itemData.totalPrice[index]

      const ListItem = await prisma.listitem.create({
        data: {
          idItem: id,
          idSale: createSale.idSale,
          quantity: quantity,  
          totalPrice: totalPrice
        }, 
      }) 
      return ListItem;
    }) 
  )
res.json({
  createSale,
  createListItem
})
}) 
//getoneuser
app.get("/:id",async (req,res)=>{
  const oneUser = await prisma.user.findUnique(
    {
      where:{
        idAccount : req.params.id
      } 
  })
  res.json(oneUser)
}) 

//getuserresetpassword
app.get('/resetpassword/:nric', async (req, res) =>
 {
    const user = await prisma.user.findUnique({
      where: { icNumber : req.params.nric },
  
  })
  if (!user)
  {
    return res.status(401).send("Account Not Exist")
  }
    res.json(user);
}) 
//getworkerrestpassword
app.get("/resetworker/:id", async (req,res)=>{
  const oneWorker = await prisma.worker.findUnique({
    where:{
      idAccount : req.params.id
    }
  })
  res.json(oneWorker)
})
//getmanagerrestpassword
app.get("/resetmanager/:id", async (req,res)=>{
  const oneManager = await prisma.manager.findUnique({
    where:{
      idAccount : req.params.id
    }
  })
  res.json(oneManager)
})
//resetpassworduser
app.put("/resetpassword/user", async (req, res) => {
  const { idAccount, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: {
        idAccount: idAccount,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating password");
  }
});


//getusermanybyid
app.get("/report/user/:idAccount", async (req,res)=>{
  const {idAccount} = req.params 
  const idAccounts = idAccount.split(",");


  const findUser = await Promise.all(
    idAccounts.map((idAccount)=> prisma.worker.findUnique({
      where:
      {
        idAccount:idAccount 
      }, 
    })) 

  )
  res.json(findUser)
})

//generatereport
async function generateReport(){
  // const createdAt = getMalaysiaDateTime()
  const createdReport = await prisma.report.create({
    data: {
      numberSale: 0, // Set numberSale to 0
      saleRevenue: 0, // Set saleRevenue to 0
      fileName:'',  
      filePath:'',
      // createdAt: createdAt
    }
  })
  return createdReport
}

cron.schedule('10 3 * * *', async () => {
  try { 
    const report = await generateReport()
  } catch (error) {
    console.error('Error generating the report:', error)
  }
}) 

 
app.listen (3000, () => {
  console.log("Now listening on port 3000")  
})

process.on("beforeExit", () => {
  prisma.$disconnect();
});