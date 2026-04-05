  const Record = require('../models/financialRecord');

const getAllRecords = async (req, res) => {

    try{
        const records = await Record.find({createdBy: req.user.id , isDeleted: false});
        return res.status(200).json({message: "Records retrieved successfully", data: records});
    } catch(err){
        console.error('Error fetching records:', err);
        return res.status(500).json({message: "Internal server error"});
    }

}

const getRecordById = async (req, res) => {
   try{
        const id = req.params.id;
        const record = await Record.findOne({_id: id, isDeleted: false});
        if(!record){
            return res.status(404).json({message: "Record not found"});
        }   
        return res.status(200).json({message: "Record retrieved successfully", data: record});
   }catch(err){
    console.error('Error fetching record:', err);
    return res.status(500).json({message: "Internal server error"});
   }
}

const createRecord = async (req, res) => {

    try{
 
    const record = await Record.create({
      ...req.body,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: "Record created successfully",
      data: record
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const updateRecord = async (req, res) => {
  try {

    const id = req.params.id;

    const record = await Record.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
       {returnDocument: 'after' , runValidators: true}
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({
      message: "Record updated successfully",
      data: record
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRecord = async (req, res) => {
    try {

        const id = req.params.id;

    const record = await Record.findByIdAndUpdate(
      id,
      { isDeleted: true },
     {returnDocument: 'after' , runValidators: true}
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({
      message: "Record deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord};
