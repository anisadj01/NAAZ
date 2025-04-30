const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false, // Désactive les logs SQL pour plus de clarté
  define: {
    freezeTableName: true, // ✅ Empêche Sequelize de modifier le nom des tables
  },
});

sequelize.authenticate()
  .then(() => console.log("✅ Connexion réussie à MySQL"))
  .catch(err => console.error("❌ Erreur de connexion :", err));

module.exports = sequelize;
