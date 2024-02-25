const Section= require('../models/Section');
const Course= require('../models/Course');

exports.createSection = async(req, res) =>{
    try{
        const{sectionName, courseId} = req.body;
        if(!sectionName || !courseId ){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const newSection = await Section.create({sectionName});

        // update Course with section objectid
        const updatedCourseDetails= await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new: true},
        );
    // hw: use populate to replace sections/sub-sections both in the updatedCourseDetails
        return res.status(200).json({
            message:"Section created successfully",
            updatedCourseDetails
        })
 
    }
    catch(error){
       return res.status(500).json({
          message:"Unable to create section",
          error: error.message
       })
    }
}

exports.updateSection = async(req,res) =>{
    try{
        const{sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId ){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        // update section
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName}, {new:true})

        return res.status(200).json({
            message:"Section updated successfully"
        })

    }
    catch(error){
        return res.status(500).json({
           message:"Unable to update section",
           error: error.message
        })
     }
}

exports.deleteSection= async(req, res) =>{
    try{
        //assuming that we are sending sectionId in params
        const {sectionId} = req.params;
        await Section.findByIdAndDelete(sectionId);
        // todo: do we need to delete the entry from the course schema
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Unable to delete section",
            error: error.message
         })
    }
}
