// const mongoose = require('../utils/mongodb');

// const financialRecordSchema = new mongoose.Schema(
//   {
//     amount: {
//       type: Number,
//       required: true,
//     },

//     type: {
//       type: String,
//       enum: ["income", "expense"],
//       required: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       index: true,
//       trim: true,
//     },

//     date: {
//       type: Date,
//       required: true,
//       index: true,
//     },

//     notes: {
//       type: String,
//       trim: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
      
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
      
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


// const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

// module.exports = FinancialRecord;

const {mongoose} = require('../utils/mongodb');

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//compound index
financialRecordSchema.index({
  createdBy: 1,
  isDeleted: 1,
  date: -1
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

module.exports = FinancialRecord;