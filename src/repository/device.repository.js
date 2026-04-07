const supabase = require("../config/database");

class DeviceRepository {
  async register({
    userId,
    deviceName,
    category,
    conservationState,
    description,
  }) {
    const { data, error } = await supabase
      .from("dispositivos")
      .insert([
        {
          id_usuario: userId,
          nome_dispositivo: deviceName,
          categoria: category,
          estado_conservacao: conservationState,
          descricao: description,
        },
      ])
      .select("id")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(error.message);
    }

    return data.id;
  }

  async getDevices() {
    const { data, error } = await supabase.from("dispositivos").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getImages(idsList) {
    const { data, error } = await supabase
      .from("imagens")
      .select("*")
      .in("id_dispositivo", idsList);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async saveImage(urls, result) {
    const imagesToInsert = urls.map((url) => ({
      url,
      id_dispositivo: result,
    }));

    const { data, error } = await supabase
      .from("imagens")
      .insert(imagesToInsert);

    if (error) throw new Error(error.message);
  }
}

module.exports = new DeviceRepository();
