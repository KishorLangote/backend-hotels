const express = require("express")
const app = express()
require("dotenv").config()

const cors = require("cors")
const corsOptions = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

const { initializeDatabase } = require("./db/db.connect")
const Hotel = require("./models/hotel.models")


app.use(cors(corsOptions)) // cors middleware
app.use(express.json()) // middleware

initializeDatabase() // this means calling the database

// const newHotel = {
//   name: "EasyStay Inn",
//   category: "Budget",
//   location: "789 Oak Street, Midtown",
//   rating: 3.5,
//   reviews: [],
//   website: "https://easystay-inn.com",
//   phoneNumber: "+1122334455",
//   checkInTime: "1:00 PM",
//   checkOutTime: "10:00 AM",
//   amenities: ["Free Breakfast", "Self Parking", "24/7 Front Desk"],
//   priceRange: "$ (10-30)",
//   reservationsNeeded: false,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: false,
//   isSpaAvailable: false,
//   isRestaurantAvailable: false,
//   photos: ["https://example.com/easystay-photo1.jpg", "https://example.com/easystay-photo2.jpg"],
// };


// 1. Create an API with route "/hotels" to create a new hotel data in the Database. Test your API with Postman.

async function createHotel(newHotel){
  try {
    const hotel = new Hotel(newHotel)
    const saveHotel = await hotel.save()
    return saveHotel
  } catch (error) {
   throw error
  }
}

// Express.js POST Route to Create a new hotel

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body)
    res.status(201).json({message: "Hotel added successfully.",hotel: savedHotel})
  } catch (error) {
    res.status(500).json({error: "Failed to add hotel."})
  }
})

  // read all hotels from the database..

  async function readAllHotels(){
    try{
      const hotels = await Hotel.find()
      return hotels
    }catch(error){
      throw error
    }
  }

  // 1. Create an API with route "/hotels" to read all hotels from the Database. Test your API with Postman.

  app.get("/hotels", async (req, res) => {
    try {
        const hotels = await readAllHotels()
        if(hotels.length != 0){
          res.json(hotels)
        } else {
          res.status(404).json({error: "No hotel found."})
        }
    } catch (error) {
      res.status(500).json({error: "Failed to fetch hotel."})
    }
  })


  // read hotel by name: 

  async function readHotelByName(hotelName){
    try{
      const hotel = await Hotel.find({name: hotelName})
      return hotel
    }catch(error){
      throw error
    }
  }
  
  // 2. Create an API with route "/hotels/:hotelName" to read a hotel by its name. Test your API with Postman.

  app.get("/hotels/:hotelName", async (req, res) => {
    try {
      const hotels = await readHotelByName(req.params.hotelName)
      if(hotels.length != 0){
        res.json(hotels)
      } else {
        res.status(404).json({error: "No found hotel."})
      }
    } catch (error) {
      res.status(500).json({error: "failed to fetch hotel data."})
    }
  })

  // read all hotels offer parking space :

  async function readAllHotelsByParkingSpace(parkingSpace){
    try{
      const hotel = await Hotel.find({isParkingAvailable: parkingSpace})
      console.log(hotel)
    }catch(error){
      throw error
    }
  }
  // readAllHotelsByParkingSpace(true)

  // read all hotels by restaurant available: 

  async function readAllHotelsByRestaurantAvailable(hotelAvailable){
    try{
      const hotel = await Hotel.find({isRestaurantAvailable: hotelAvailable})
      console.log(hotel)
    }catch(error){
      throw error
    }
  }
  // readAllHotelsByRestaurantAvailable(true)

  // read all hotels by category ("Mid-Range")

  async function readAllHotelsByCategory(hotelCategory){
    try{
      const hotelByCategory = await Hotel.find({category: hotelCategory})
      return hotelByCategory
    }catch(error){
      throw error
    }
  }
  
  //5. Create an API with route "/hotels/category/:hotelCategory" to read all hotels by category. Test your API with Postman.

  app.get("/hotels/category/:hotelCategory", async (req, res) => {
    try {
      const hotels = await readAllHotelsByCategory(req.params.hotelCategory)
      if(hotels.length != 0){
        res.json(hotels)
      } else {
        res.status(404).json({error: "No found hotel."})
      }
    } catch (error) {
      res.status(500).json({error: "Failed to fetch hotel data."})
    }
  })

  // read all hotels by price range ("$$$$ 61+"): 

  async function readAllHotelsByPriceRange(range){
    try{
      const hotel = await Hotel.find({priceRange: range})
      console.log(hotel)
    }catch(error){
      throw error
    }
  }
  // readAllHotelsByPriceRange("$$$$ (61+)")

  // read all hotels with rating

  async function readAllHotelsByRating(hotelRating){
    try{
      const hotelByRating = await Hotel.find({rating: hotelRating})
      return hotelByRating
    }catch(error){
      throw error
    }
  }
  

  // 4. Create an API with route "/hotels/rating/:hotelRating" to read all hotels by rating. Test your API with Postman.

  app.get("/hotels/rating/:hotelRating", async (req, res) => {
    try {
      const hotels = await readAllHotelsByRating(req.params.hotelRating)
      if(hotels.length != 0){
        res.json(hotels)
      } else {
        res.status(404).json({error: "No found hotel."})
      }
    } catch (error) { 
      res.status(500).json({error: "Failed to fetch hotel."})
    }
  })

  // read hotel by phone number  ("+1299655890")

  async function readHotelByPhoneNumber(phoneNum){
    try{
      const hotelByPhone = await Hotel.find({phoneNumber: phoneNum})
      return hotelByPhone 
    }catch(error){
      throw error
    }
  }

  // 3. Create an API with route "/hotels/directory/:phoneNumber" to read a hotel by phone number. Test your API with Postman.

  app.get("/hotels/directory/:phoneNumber", async (req, res) => {
    try {
      const hotels = await readHotelByPhoneNumber(req.params.phoneNumber)
      if(hotels.length != 0){
        res.json(hotels)
      } else {
        res.status(404).json({error: "No found hotel."})
      }
    } catch (error) {
      res.status(500).json({error: "Failed to fetch hotel."})
    }
  })

  // to update hotel data by id: 

  async function updateHotel(hotelId, dataToUpdate){
    try{
      const updatedHotels = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, { new: true })
      return updatedHotels
      // return updatedHotels // If the hotel isn't found, the findByIdAndUpdate function will return null, and you should handle that case.
    } catch(error){
      console.log("Error to updating hotel data.", error)
    }
  }

  // updateHotel("6720c1464a1448fc072726da", { checkOutTime: "12:00 AM" })
  // BE4.4_HW2
  // 1. Create an API to update a hotel data by their ID in the Database. Update the rating of an existing hotel. Test your API with Postman.


// API Route to update hotel data by ID

  app.post("/hotels/:hotelId", async (req, res) => {
    try {
      const updatedHotel = await updateHotel(req.params.hotelId, req.body)
      if(updatedHotel){
        res.status(201).json({message: "Hotel updated succuessfully.", hotel: updatedHotel})
      } else {
        res.status(404).json({error: "Hotel not found."})
      }
    } catch (error) {
      res.status(500).json({error: "Failed to upated hotel."})
    }
  })


  // update hotels data with name: 

  async function updateHotelDetails(hotelName, dataToUpdate){
    try{
      const updatedHotel = await Hotel.findOneAndUpdate({name: hotelName}, dataToUpdate, { new: true })
      console.log(updatedHotel)
    }catch(error){
      console.log("Error to updating database.")
    }
  }

  // updateHotelDetails("Sunset Resort", { rating: 4.2 })

  // update hotel data with phone number : 

  async function updateHotelData(hotelPhone, dataToUpdate){
    try{
      const updatedHotel = await Hotel.findOneAndUpdate({phoneNumber: hotelPhone}, dataToUpdate, { new: true })
      console.log(updatedHotel)
    }catch(error){
      console.log("Error to updating hotel database...")
    }
  }

  // updateHotelData("+1299655890", { phoneNumber: "+1997687392" })


  // async function deleteHotelById(hotelId){
  //   try {
  //     const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
  //     console.log(deletedHotel)
  //   } catch (error){
  //     console.log("Error to deleting hotel data.", error)
  //   }
  // }

  // deleteHotelById("6719f13958080c750900f317")

  async function deleteHotelByPhoneNumber(hotelPhone){
    try {
      const deltedHotel = await Hotel.findOneAndDelete({phoneNumber: hotelPhone})
      console.log(deltedHotel)
    } catch (error){
      console.log("Error to deleting hotel data.")
    }
  }

  // deleteHotelByPhoneNumber("+1234567890")

  // 1. Create an API with route "/hotels/:hotelId" to delete a hotel data by their ID in the Database. Test your API with Postman.

  async function deletedHotels(hotelId){
    try {
      const deleteHotel = await Hotel.findOneAndDelete(hotelId)
      return deleteHotel
    } catch (error) {
      throw error
    }
  }


  app.delete("/hotels/:hotelId", async (req, res) => {
    try {
      const deletedHotel = await deletedHotels(req.params.hotelId)
      if(deletedHotel){
        res.status(200).json({message: "Hotel deleted successfully."})
      } else {
        res.status(404).json({error: "Hotel not found."})
      }
    
    } catch (error) {
      res.status(500).json({error: "Failed to delete hotel."})
    }
  })

  // this is express environment required to connect with your database..

  const PORT = 3000
  app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
  })