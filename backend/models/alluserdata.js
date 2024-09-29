module.exports = (sequelize, DataTypes) => {
  const UserData = sequelize.define("all_user_data", {
    name: {
      type: DataTypes.STRING,
      allownull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    queries: {
      type: DataTypes.STRING,
      allownull: false,
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allownull: false,
    },
    source: {
      type: DataTypes.STRING,
      allownull: false,
    },
    country: {
      type: DataTypes.STRING,
      allownull: false,
    },
    state: {
      type: DataTypes.STRING,
      allownull: false,
    },
    city: {
      type: DataTypes.STRING,
      allownull: false,
    },

    followup_date: {
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
    assignedDate: {
      type: DataTypes.DATETIME,
    },
    user: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });
  UserData.associate = function (models) {
    UserData.hasMany(models.all_user_data_histories, {
      foreignKey: "leadId",
      as: "all_user_data_histories",
    });
  };

  // UserData.sync({force:true})
  return UserData;
};
