const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imageUploader')
exports.createSubSection = async(req, res) => {
    try{
       const {sectionId, title, timeDuration, description} = req.body;

       const video = req.files.videoFile;

       if(!sectionId || !title || !timeDuration || !description){
          return res.status(400).json({
            success:true,
            message:'All fields are requried'
          });
       }

       //upload video to cloudinary
       const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

       const subSectionDetails = await SubSection.create({
        title:title,
        timeDuration:timeDuration,
        description:description,
        videoUrl:uploadDetails.secure_url
       })

       const updatedSection = await Section.findByIdAndUpdate({sectionId},
        {$push:{
            subSection:subSectionDetails._id,
        }},
        {new:true});

        // log updated section here, after adding populated query

        return res.status(200).json({
            success:true,
            message:'Sub section created successfully',
            updatedSection
        })
    }
    catch(error){
         return res.status(500).json({
            message:'Unable to create subSection'
         })
    }
}

// update ss

// delete ss

