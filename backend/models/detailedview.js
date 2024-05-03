module.exports = (sequelize, DataTypes) => {
  const Detailedview = sequelize.define("detailed_view", {
    user: {
      type: DataTypes.STRING,
      allownull: false,
    },
    status: {
      type: DataTypes.STRING,
      allownull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });
  // sequelize.sync({ force: true })
  return Detailedview;
};
