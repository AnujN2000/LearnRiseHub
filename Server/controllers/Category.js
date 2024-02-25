const Category = require("../models/Category");

// create Catagory

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //creating entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    return res.status(200).json({
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// getAllcategory handler function 

exports.showAllCatagory = async(res, res)=>{
    try{
       const allCategories= await Category.find({},{name:true, description:true});
       res.status(200).json({
         message:"All categories returned successfully",
         allCategories,
       })
    }
    catch(error){
        return res.status(500).json({  
            message:error.message,
        })
    }
}