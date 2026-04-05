
const record = require('../models/financialRecord');

const getSummary = async (req, res) => {
   const records = await record.find({ isDeleted: false});
   // Process records to calculate summary
   const income_summary = records.filter(r => r.type === "income").reduce((sum, r) => sum + r.amount, 0);
   const expense_summary = records.filter(r => r.type === "expense").reduce((sum, r) => sum + r.amount, 0);
   const net_summary = income_summary - expense_summary;
    return res.status(200).json({income: income_summary,expense: expense_summary,net: net_summary});


}

// const getRecent = async (req, res) => {
//   const recodrs = await record.find({ isDeleted: false}).sort({ date: -1 });
//   return res.status(200).json({
//     data: recodrs
//   });

// }
const getRecent = async (req, res) => {
  try {
    const { lastId, limit = 10 } = req.query;

    const safeLimit = Math.min(parseInt(limit), 50);

    const query = {
      isDeleted: false,
      ...(lastId && { _id: { $lt: lastId } })
    };

    const records = await record
      .find(query)
      .sort({ _id: -1 })
      .limit(safeLimit);

    return res.status(200).json({
      data: records,
      nextCursor: records.length ? records[records.length - 1]._id : null,
      hasMore: records.length === safeLimit
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
const getTrends = async (req, res) => {
  try {
    
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); 

    const trends = await record.aggregate([
      {
        $match: {
          isDeleted: false,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1
        }
      }
    ]);

    return res.status(200).json({
      data: trends
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
const getCategoryBreakdown = async (req, res) => {
    try{

    const result = await record.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: "$category",

          total: { $sum: "$amount" },

          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },

          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
          income: 1,
          expense: 1
        }
      }
    ]);

    return res.status(200).json({
      data: result
    });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {getSummary, getRecent, getTrends, getCategoryBreakdown};