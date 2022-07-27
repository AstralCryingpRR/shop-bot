const { Schema, model } = require("mongoose");

const ConfigType = Schema({
  id: Number,

  currentId: Number, // айди текущего конфига  / можно сетнуть другой конфиг по команде: set ID
});

module.exports = model("ConfigType", ConfigType);
