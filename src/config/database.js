import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAM}`

export const conectarAoBancoDeDados = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = conectarAoBancoDeDados;
