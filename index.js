const express = require('express') 
const app = express()
const {PrismaClient} = require ("@prisma/client")
const cors = require ('cors')
const bcrypt = require('bcrypt')
  
const prisma = new PrismaClient()


app.use(cors({
  origin:'*'
}))
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
    return res.status(401).send("Invalid Password")
  }
  const userId = user.idAccount 

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

app.delete("/worker/:id", async (req, res)=>{  
  const idWorker = req.params.id
  const deleteWorker = await prisma.worker.delete({where: {idWorker:idWorker}})
  const deleteUser = await prisma.user.delete({where:{idAccount:deleteWorker.idAccount}})
  res.json(deleteWorker)
})

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
  const listItem = await prisma.item.findUnique(
    {
      where:
      {
        barcode : barcode
      }
    }
  )
  res.json(listItem)
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
app.post("/item", async (req, res)=>{
  const newItem = await prisma.item.create({data: req.body})
  res.json(newItem) 
}) 
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
  const updateItem = await prisma.item.update({
    where: {idItem: id }, 
    data: {
      name :newName,
      category : newCategory,
      price :newPrice, 
      barcode : newBarcode,
      weight : newWeight,
      unit: newUnit,
      quantity : newQuantity
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
// deleteitem   
app.delete("/item/:id", async (req, res)=>{ 
  const id = req.params.id
  const deleteItem = await prisma.item.delete({where: {idItem:id}})
  res.json(deleteItem) 
})

 
//crud sale
app.get("/sale", async (req, res)=>{
  const allSale = await prisma.sale.findMany({
    include :{
      User:true,
      ListItem: true,
    }
  })
  res.json(allSale)
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
app.get("/report", async (req, res)=>{ 
  const allReport = await prisma.report.findMany(
    {
      include:
      {
        Sale:{
          include:{
                ListItem:{
                  include:{
                    Item:true,
                  }
                }
          }
        }
      }
    }
  )
  res.json(allReport)
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

app.delete("/report/:id", async (req, res)=>{ 
  const id = req.params.id
  const deleteReport = await prisma.report.delete({where: {idReport:id}})
  res.json(deleteReport) 
})

//listitem
app.get("/listitem", async (req, res)=>{
  const allItemBuyList = await prisma.listItem.findMany()
  res.json(allItemBuyList)
})
 
app.post("/listitem", async (req, res)=>{
  const newItemBuyList = await prisma.listItem.create({data: req.body})
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
  const deleteItemBuyList = await prisma.listItem.delete({where: {idBuyList:id}})
  res.json(deleteItemBuyList) 
})

app.post("/salebuylist",async (req,res)=>{
  const { saleData, itemData } =req.body
  console.log(saleData)  
  console.log(itemData)

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
    itemData.idItem.map(async (id) => { 
      const ListItem = await prisma.list.create({
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

app.listen (3000, () => {
  console.log("Now listening on port 3000")  
})