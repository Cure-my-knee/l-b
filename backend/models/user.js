module.exports=(sequelize, DataTypes)=>{
    const User =sequelize.define("crmusers",{
        name: {
            type:DataTypes.STRING,
            allownull:false
        },
        phone:{
            type:DataTypes.STRING,
             allownull:false
         },
         email:{
            type:DataTypes.STRING,
            allownull:false
         },
         password: {
            type:DataTypes.STRING,
            allownull: false
         },
         isAdmin:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
         },
         allowLogin:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
         },
         } );
        //  sequelize.sync({force:true})
         return User;
};
