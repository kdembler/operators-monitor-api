"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class operators_metrics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  operators_metrics.init(
    {
      dataObjectId: DataTypes.STRING,
      distributionBucketId: DataTypes.STRING,
      workerId: DataTypes.INTEGER,
      nodeEndpoint: DataTypes.STRING,
      url: DataTypes.STRING,
      status: DataTypes.STRING,
      responseTime: DataTypes.FLOAT,
      statusCode: DataTypes.INTEGER,
      time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "operators_metrics",
      // indexes: [
      //   {
      //     unique: true,
      //     fields: ["dataObjectId", "distributionBucketId", "workerId", "time"],
      //   },
      //   {
      //     fields: ["status", "dataObjectId", "distributionBucketId"],
      //     using: "HASH",
      //   },
      // ],
    }
  );
  return operators_metrics;
};
