const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const dotenv = require("dotenv");

const authenticateToken = require("./authenticateToken.js");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const usuario = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const server = process.env.DB_SERVER;
const database = process.env.DB;

const config = {
  user: usuario,
  password: password,
  server: server,
  database: database,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Conectado a Azure SQL");
    return pool;
  })
  .catch((err) => console.log("❌ Error de conexión:", err));

app.listen(8081, () => {
  console.log("Servidor escuchando en el puerto 8081...");
});

// Rutas para manejar las operaciones CRUD de clientes
{
  app.post("/agregar-cliente", authenticateToken, async (req, res) => {
    try {
      const pool = await poolPromise;
      const request = new sql.Request(pool);

      const {
        tipo_persona,
        nombre,
        apellido_paterno,
        apellido_materno,
        representante_legal,
        rfc_nit,
        telefono,
        transportista,
        credito_disponible,
        estado,
        municipio,
        ciudad,
        colonia,
        calle,
        numero,
        referencia,
        codigo_postal,
        razon_social,
        razon_comercial,
        email1,
        email2,
        email3,
        email4,
      } = req.body;

      const query = `
      INSERT INTO dbo.registro_clientes (
        tipo_persona, nombre, apellido_paterno, apellido_materno,
        representante_legal, rfc_nit, telefono, transportista, credito_disponible,
        estado, municipio, ciudad, colonia, calle, numero, referencia, codigo_postal,
        razon_social, razon_comercial, email1, email2, email3, email4
      ) VALUES (
        @tipo_persona, @nombre, @apellido_paterno, @apellido_materno,
        @representante_legal, @rfc_nit, @telefono, @transportista, @credito_disponible,
        @estado, @municipio, @ciudad, @colonia, @calle, @numero, @referencia, @codigo_postal,
        @razon_social, @razon_comercial, @email1, @email2, @email3, @email4
      )
    `;

      request
        .input("tipo_persona", sql.VarChar, tipo_persona)
        .input("nombre", sql.VarChar, nombre)
        .input("apellido_paterno", sql.VarChar, apellido_paterno)
        .input("apellido_materno", sql.VarChar, apellido_materno)
        .input("representante_legal", sql.VarChar, representante_legal)
        .input("rfc_nit", sql.VarChar, rfc_nit)
        .input("telefono", sql.VarChar, telefono)
        .input("transportista", sql.VarChar, transportista)
        .input("credito_disponible", sql.Decimal(18, 2), credito_disponible)
        .input("estado", sql.VarChar, estado)
        .input("municipio", sql.VarChar, municipio)
        .input("ciudad", sql.VarChar, ciudad)
        .input("colonia", sql.VarChar, colonia)
        .input("calle", sql.VarChar, calle)
        .input("numero", sql.VarChar, numero)
        .input("referencia", sql.VarChar, referencia)
        .input("codigo_postal", sql.VarChar, codigo_postal)
        .input("razon_social", sql.VarChar, razon_social)
        .input("razon_comercial", sql.VarChar, razon_comercial)
        .input("email1", sql.VarChar, email1)
        .input("email2", sql.VarChar, email2)
        .input("email3", sql.VarChar, email3)
        .input("email4", sql.VarChar, email4);

      await request.query(query);

      res.json({ success: true, message: "Cliente agregado correctamente" });
    } catch (err) {
      console.error("Error al agregar cliente:", err);
      res
        .status(500)
        .json({ success: false, message: "Error al agregar cliente" });
    }
  });

  app.get("/clientes", async (req, res) => {
    try {
      const pool = await poolPromise;
const result = await pool.request().query("SELECT * FROM dbo.registro_clientes");
      res.json(result.recordset);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      res.status(500).json({ message: "Error al obtener clientes" });
    }
  });

  app.delete("/eliminar-cliente/:id_cliente", async (req, res) => {
    try {
      await sql.connect(config);
      const { id_cliente } = req.params;
      const request = new sql.Request();
      await request
        .input("id_cliente", sql.Int, id_cliente)
        .query(
          "DELETE FROM dbo.registro_clientes WHERE id_cliente = @id_cliente"
        );
      res.json({ message: "Cliente eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      res.status(500).json({ message: "Error al eliminar cliente" });
    }
  });

  app.get("/nombres-clientes", async (req, res) => {
    try {
      const pool = await poolPromise;

      const result = await pool.request().query(`
      SELECT 
        RTRIM(
          ISNULL(nombre, '') + ' ' +
          ISNULL(apellido_paterno, '') + ' ' +
          ISNULL(apellido_materno, '') + ' ' +
          ISNULL(razon_social, '') + ' ' +
          ISNULL(razon_comercial, '')
        ) AS CLIENTE
      FROM dbo.registro_clientes
    `);

      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("❌ Error al obtener nombres de clientes:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/cliente/:id_cliente", async (req, res) => {
    try {
      const { id_cliente } = req.params;
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("id_cliente", sql.Int, id_cliente)
        .query(`SELECT * FROM dbo.registro_clientes WHERE id_cliente = @id_cliente`);

      const clienteData = result.recordset;

      if (!clienteData || clienteData.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Cliente no encontrado",
        });
      }

      return res.status(200).json(clienteData[0]);
    } catch (error) {
      console.error("❌ Error al obtener cliente:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Error al obtener los datos del cliente",
      });
    }
  });

  app.put("/actualizar-cliente/:id_cliente", async (req, res) => {
    const { id_cliente } = req.params;
    const request = new sql.Request();
    const {
      tipo_persona,
      nombre,
      apellido_paterno,
      apellido_materno,
      representante_legal,
      rfc_nit,
      telefono,
      transportista,
      credito_disponible,
      estado,
      municipio,
      ciudad,
      colonia,
      calle,
      numero,
      referencia,
      codigo_postal,
      razon_social,
      razon_comercial,
      email1,
      email2,
      email3,
      email4,
    } = req.body;

    try {
      await sql.connect(config);
      await request
        .input("id_cliente", sql.Int, id_cliente)
        .input("tipo_persona", sql.VarChar, tipo_persona)
        .input("nombre", sql.VarChar, nombre)
        .input("apellido_paterno", sql.VarChar, apellido_paterno)
        .input("apellido_materno", sql.VarChar, apellido_materno)
        .input("representante_legal", sql.VarChar, representante_legal)
        .input("rfc_nit", sql.VarChar, rfc_nit)
        .input("telefono", sql.VarChar, telefono)
        .input("transportista", sql.VarChar, transportista)
        .input("credito_disponible", sql.Decimal(18, 2), credito_disponible)
        .input("estado", sql.VarChar, estado)
        .input("municipio", sql.VarChar, municipio)
        .input("ciudad", sql.VarChar, ciudad)
        .input("colonia", sql.VarChar, colonia)
        .input("calle", sql.VarChar, calle)
        .input("numero", sql.VarChar, numero)
        .input("referencia", sql.VarChar, referencia)
        .input("codigo_postal", sql.VarChar, codigo_postal)
        .input("razon_social", sql.VarChar, razon_social)
        .input("razon_comercial", sql.VarChar, razon_comercial)
        .input("email1", sql.VarChar, email1)
        .input("email2", sql.VarChar, email2)
        .input("email3", sql.VarChar, email3)
        .input("email4", sql.VarChar, email4);

      await request.query(`
          UPDATE dbo.registro_clientes
          SET tipo_persona = @tipo_persona,
              nombre = @nombre,
              apellido_paterno = @apellido_paterno,
              apellido_materno = @apellido_materno,
              representante_legal = @representante_legal,
              rfc_nit = @rfc_nit,
              telefono = @telefono,
              transportista = @transportista,
              credito_disponible = @credito_disponible,
              estado = @estado,
              municipio = @municipio,
              ciudad = @ciudad,
              colonia = @colonia,
              calle = @calle,
              numero = @numero,
              referencia = @referencia,
              codigo_postal = @codigo_postal,
              razon_social = @razon_social,
              razon_comercial = @razon_comercial,
              email1 = @email1,
              email2 = @email2,
              email3 = @email3,
              email4 = @email4
          WHERE id_cliente = @id_cliente
        `);
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      res.status(500).json({ message: "Error al actualizar cliente" });
    }
    res.json({ message: "Cliente actualizado correctamente" });

  });

      



}

// Rutas para manejar las operaciones CRUD de contenedores
{
  app.get("/contenedores", async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
      SELECT * FROM dbo.registro_contenedores`);
      res.json(result.recordset);
    } catch (err) {
      console.error("Error al obtener contenedores:", err);
      res.status(500).json({ message: "Error al obtener contenedores" });
    }
  });

  app.delete("/eliminar-contenedor/:id_contenedor", async (req, res) => {
    try {
      await sql.connect(config);
      const { id_contenedor } = req.params;
      const request = new sql.Request();
      await request
        .input("id_contenedor", sql.Int, id_contenedor)
        .query(
          "DELETE FROM dbo.registro_contenedores WHERE id_contenedor = @id_contenedor"
        );
      res.json({ message: "Contenedor eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar contenedor:", err);
      res.status(500).json({ message: "Error al eliminar contenedor" });
    }
  });

  app.post("/agregar-contenedor", async (req, res) => {
    const {
      cantidad_contenedores,
      fecha_llegada,
      hora_llegada,
      transportista,
      operador,
      estatus,
      eco,
      user,
      acceso,
    } = req.body;

    console.log(hora_llegada);

    const results = [];

    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);

      await transaction.begin();

      try {
        for (let i = 1; i <= cantidad_contenedores; i++) {
          const containerData = {
            numero_contenedor: req.body[`numero_contenedor${i}`],
            cliente: req.body[`cliente${i}`],
            estado: req.body[`estado${i}`],
            carga: req.body[`carga${i}`],
            color: req.body[`color${i}`],
            peso: req.body[`peso${i}`],
            tamano: req.body[`tamano${i}`],
            dmg_frontal: req.body[`dmg_frontal${i}`],
            obs_frontal: req.body[`obs_frontal${i}`],
            dmg_trasera: req.body[`dmg_trasera${i}`],
            obs_trasera: req.body[`obs_trasera${i}`],
            dmg_lateral_derecha: req.body[`dmg_lateral_derecha${i}`],
            obs_lateral_derecha: req.body[`obs_lateral_derecha${i}`],
            dmg_lateral_izquierda: req.body[`dmg_lateral_izquierda${i}`],
            obs_lateral_izquierda: req.body[`obs_lateral_izquierda${i}`],
            dmg_candado: req.body[`dmg_candado${i}`],
            obs_candado: req.body[`obs_candado${i}`],
            num_candado: req.body[`num_candado${i}`],
            tipo_movimiento: req.body[`tipo_movimiento${i}`],
            lugar_fin: req.body[`lugar_fin${i}`],
            instrucciones_add: req.body[`instrucciones_add${i}`],
          };

          // Insertar en registro_contenedores
          const insertContenedor = await transaction
            .request()
            .input("fecha_llegada", sql.Date, fecha_llegada)
            .input("hora_llegada", sql.VarChar(8), hora_llegada)
            .input("transportista", sql.VarChar(100), transportista)
            .input("operador", sql.VarChar(100), operador)
            .input(
              "numero_contenedor",
              sql.VarChar(50),
              containerData.numero_contenedor
            )
            .input("cliente", sql.VarChar(100), containerData.cliente)
            .input("estado", sql.VarChar(50), containerData.estado)
            .input("carga", sql.VarChar(50), containerData.carga)
            .input("color", sql.VarChar(50), containerData.color)
            .input("peso", sql.VarChar(50), containerData.peso)
            .input("tamano", sql.VarChar(50), containerData.tamano)
            .input("ubicacion", sql.VarChar(100), eco)
            .input("unidad_llegada", sql.VarChar(100), eco)
            .query(`INSERT INTO dbo.registro_contenedores 
                  (fecha_llegada, hora_llegada, transportista, operador, numero_contenedor, 
                   cliente, estado, carga, color, peso, tamano, ubicacion, unidad_llegada)
                  OUTPUT INSERTED.id_contenedor
                  VALUES (@fecha_llegada, @hora_llegada ,@transportista, @operador, 
                          @numero_contenedor, @cliente, @estado, @carga, @color, @peso, @tamano, 
                          @ubicacion, @unidad_llegada)`);

            const containerId = insertContenedor.recordset[0].id_contenedor;

            // Insertar en registro_dmg
            await transaction
              .request()
              .input("id_contenedor", sql.Int, containerId)
              .input(
                "num_contenedor",
                sql.VarChar(50),
                containerData.numero_contenedor
              )
              .input("acceso", sql.VarChar(50), acceso)
              .input("fecha_inspeccion", sql.Date, fecha_llegada)
              .input("hora_inspeccion", sql.VarChar(8), hora_llegada)
              .input("dmg_frontal", sql.Text, containerData.dmg_frontal)
              .input("obs_frontal", sql.Text, containerData.obs_frontal)
              .input("dmg_trasero", sql.Text, containerData.dmg_trasera)
              .input("obs_trasero", sql.Text, containerData.obs_trasera)
              .input(
                "dmg_lateral_d",
                sql.Text,
                containerData.dmg_lateral_derecha
              )
              .input(
                "obs_lateral_d",
                sql.Text,
                containerData.obs_lateral_derecha
              )
              .input(
                "dmg_lateral_i",
                sql.Text,
                containerData.dmg_lateral_izquierda
              )
              .input(
                "obs_lateral_i",
                sql.Text,
                containerData.obs_lateral_izquierda
              )
              .input("dmg_candado", sql.Text, containerData.dmg_candado)
              .input("obs_candado", sql.Text, containerData.obs_candado)
              .input("num_candado", sql.VarChar(50), containerData.num_candado)
              .query(`INSERT INTO dbo.registro_dmg 
                  (id_contenedor, num_contenedor, acceso, fecha_inspeccion, hora_inspeccion,
                   dmg_frontal, obs_frontal, dmg_trasero, obs_trasero, 
                   dmg_lateral_d, obs_lateral_d, dmg_lateral_i, obs_lateral_i, 
                   dmg_candado, obs_candado, num_candado)
                  VALUES (@id_contenedor, @num_contenedor, @acceso, @fecha_inspeccion, @hora_inspeccion,
                          @dmg_frontal, @obs_frontal, @dmg_trasero, @obs_trasero, 
                          @dmg_lateral_d, @obs_lateral_d, @dmg_lateral_i, @obs_lateral_i, 
                          @dmg_candado, @obs_candado, @num_candado)`);

            // Insertar en registro_movimientos
            await transaction
              .request()
              .input("id_contenedor", sql.Int, containerId)
              .input(
                "tipo_movimiento",
                sql.VarChar(50),
                containerData.tipo_movimiento
              )
              .input("lugar_origen", sql.VarChar(100), eco)
              .input("lugar_fin", sql.VarChar(100), containerData.lugar_fin)
              .input("solicitado_por", sql.VarChar(100), user)
              .input("realizado_por", sql.VarChar(100), null)
              .input(
                "instrucciones_add",
                sql.Text,
                containerData.instrucciones_add
              )
              .input("comentarios", sql.Text, null)
              .input("fecha_solicitud", sql.Date, fecha_llegada)
              .input("hora_solicitud", sql.VarChar(8), hora_llegada)
              .input("fecha_realizado", sql.Date, null)
              .input("hora_realizado", sql.VarChar(8), null)
              .input("duracion", sql.VarChar(8), null)
              .input("estatus", sql.VarChar(50), estatus)
              .query(`INSERT INTO dbo.registro_movimientos 
                  (id_contenedor, tipo_movimiento, lugar_origen, lugar_fin, solicitado_por, 
                   realizado_por, instrucciones_add, comentarios, fecha_solicitud, 
                   hora_solicitud, fecha_realizado, hora_realizado, duracion, estatus)
                  VALUES (@id_contenedor, @tipo_movimiento, @lugar_origen, @lugar_fin, @solicitado_por, 
                          @realizado_por, @instrucciones_add, @comentarios, @fecha_solicitud, 
                          @hora_solicitud, @fecha_realizado, @hora_realizado, @duracion, @estatus)`);


          results.push({
            numero_contenedor: containerData.numero_contenedor,
          });
        }

        await transaction.commit();

        res.status(200).json({
          success: true,
          message: `${cantidad_contenedores} contenedor(es) agregado(s) correctamente`,
          data: results,
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (error) {
      console.error("❌ Error en /agregar-contenedor:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  app.get("/contenedor/:id_contenedor", async (req, res) => {
    try {
      const { id_contenedor } = req.params;
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("id_contenedor", sql.Int, id_contenedor).query(`
        SELECT c.*, 
               d.acceso, d.dmg_frontal, d.obs_frontal, d.dmg_trasero, d.obs_trasero,
               d.dmg_lateral_d, d.obs_lateral_d, d.dmg_lateral_i, d.obs_lateral_i,
               d.dmg_candado, d.obs_candado, d.num_candado,
               m.tipo_movimiento, m.lugar_origen, m.lugar_fin, m.solicitado_por,
               m.instrucciones_add, m.comentarios
        FROM dbo.registro_contenedores c
        LEFT JOIN dbo.registro_dmg d ON c.id_contenedor = d.id_contenedor
        LEFT JOIN (
          SELECT rm.*
          FROM dbo.registro_movimientos rm
          INNER JOIN (
            SELECT id_contenedor, MAX(id_movimiento) AS max_id
            FROM dbo.registro_movimientos
            GROUP BY id_contenedor
          ) latest ON rm.id_contenedor = latest.id_contenedor AND rm.id_movimiento = latest.max_id
        ) m ON c.id_contenedor = m.id_contenedor
        WHERE c.id_contenedor = @id_contenedor
      `);

      const containerData = result.recordset;

      if (!containerData || containerData.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Contenedor no encontrado",
        });
      }

      return res.status(200).json(containerData[0]);
    } catch (error) {
      console.error("❌ Error al obtener contenedor:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Error al obtener los datos del contenedor",
      });
    }
  });

 app.put("/actualizar-contenedor/:id_contenedor", async (req, res) => {
   const { id_contenedor } = req.params;

   const {
     fecha_llegada,
     hora_llegada,
     transportista,
     operador,
     eco,
     user,
     acceso,
     estatus,
     // contenedor1
     numero_contenedor1,
     cliente1,
     estado1,
     carga1,
     color1,
     peso1,
     tamano1,
     // daño
     dmg_frontal1,
     obs_frontal1,
     dmg_trasera1,
     obs_trasera1,
     dmg_lateral_derecha1,
     obs_lateral_derecha1,
     dmg_lateral_izquierda1,
     obs_lateral_izquierda1,
     dmg_candado1,
     obs_candado1,
     num_candado1,
     // movimiento
     tipo_movimiento1,
     lugar_fin1,
     instrucciones_add1,
   } = req.body;

   try {
     const pool = await poolPromise;
     const transaction = new sql.Transaction(pool);

     await transaction.begin();

     try {
       // 1. Actualizar registro_contenedores
       await transaction
         .request()
         .input("id_contenedor", sql.Int, id_contenedor)
         .input("fecha_llegada", sql.Date, fecha_llegada)
         .input("hora_llegada", sql.VarChar(8), hora_llegada)
         .input("transportista", sql.VarChar(100), transportista)
         .input("operador", sql.VarChar(100), operador)
         .input("numero_contenedor", sql.VarChar(50), numero_contenedor1)
         .input("cliente", sql.VarChar(100), cliente1)
         .input("estado", sql.VarChar(50), estado1)
         .input("carga", sql.VarChar(50), carga1)
         .input("color", sql.VarChar(50), color1)
         .input("peso", sql.VarChar(50), peso1)
         .input("tamano", sql.VarChar(50), tamano1)
         .input("eco", sql.VarChar(100), eco)
         .query(`UPDATE dbo.registro_contenedores
                SET fecha_llegada = @fecha_llegada,
                    hora_llegada = @hora_llegada,
                    transportista = @transportista,
                    operador = @operador,
                    numero_contenedor = @numero_contenedor,
                    cliente = @cliente,
                    estado = @estado,
                    carga = @carga,
                    color = @color,
                    peso = @peso,
                    tamano = @tamano,
                    ubicacion = @eco,
                    unidad_llegada = @eco
                WHERE id_contenedor = @id_contenedor`);

       // 2. Actualizar registro_dmg
       await transaction
         .request()
         .input("id_contenedor", sql.Int, id_contenedor)
         .input("numero_contenedor", sql.VarChar(50), numero_contenedor1)
         .input("acceso", sql.VarChar(50), acceso)
         .input("fecha_inspeccion", sql.Date, fecha_llegada)
         .input("hora_inspeccion", sql.VarChar(8), hora_llegada)
         .input("dmg_frontal", sql.Text, dmg_frontal1)
         .input("obs_frontal", sql.Text, obs_frontal1)
         .input("dmg_trasero", sql.Text, dmg_trasera1)
         .input("obs_trasero", sql.Text, obs_trasera1)
         .input("dmg_lateral_d", sql.Text, dmg_lateral_derecha1)
         .input("obs_lateral_d", sql.Text, obs_lateral_derecha1)
         .input("dmg_lateral_i", sql.Text, dmg_lateral_izquierda1)
         .input("obs_lateral_i", sql.Text, obs_lateral_izquierda1)
         .input("dmg_candado", sql.Text, dmg_candado1)
         .input("obs_candado", sql.Text, obs_candado1)
         .input("num_candado", sql.VarChar(50), num_candado1)
         .query(`UPDATE dbo.registro_dmg
                SET num_contenedor = @numero_contenedor,
                    acceso = @acceso,
                    fecha_inspeccion = @fecha_inspeccion,
                    hora_inspeccion = @hora_inspeccion,
                    dmg_frontal = @dmg_frontal,
                    obs_frontal = @obs_frontal,
                    dmg_trasero = @dmg_trasero,
                    obs_trasero = @obs_trasero,
                    dmg_lateral_d = @dmg_lateral_d,
                    obs_lateral_d = @obs_lateral_d,
                    dmg_lateral_i = @dmg_lateral_i,
                    obs_lateral_i = @obs_lateral_i,
                    dmg_candado = @dmg_candado,
                    obs_candado = @obs_candado,
                    num_candado = @num_candado
                WHERE id_contenedor = @id_contenedor`);

       // 3. Actualizar registro_movimientos
       await transaction
         .request()
         .input("id_contenedor", sql.Int, id_contenedor)
         .input("tipo_movimiento", sql.VarChar(50), tipo_movimiento1)
         .input("lugar_origen", sql.VarChar(100), eco)
         .input("lugar_fin", sql.VarChar(100), lugar_fin1)
         .input("solicitado_por", sql.VarChar(100), user)
         .input("instrucciones_add", sql.Text, instrucciones_add1)
         .input("fecha_solicitud", sql.Date, fecha_llegada)
         .input("hora_solicitud", sql.VarChar(8), hora_llegada)
         .input("estatus", sql.VarChar(50), estatus)
         .query(`UPDATE dbo.registro_movimientos
                SET tipo_movimiento = @tipo_movimiento,
                    lugar_origen = @lugar_origen,
                    lugar_fin = @lugar_fin,
                    solicitado_por = @solicitado_por,
                    instrucciones_add = @instrucciones_add,
                    fecha_solicitud = @fecha_solicitud,
                    hora_solicitud = @hora_solicitud,
                    estatus = @estatus
                WHERE id_contenedor = @id_contenedor`);

       await transaction.commit();

       res.status(200).json({
         success: true,
         message: `Contenedor ${numero_contenedor1} actualizado correctamente.`,
       });
     } catch (err) {
       await transaction.rollback();
       throw err;
     }
   } catch (error) {
     console.error("❌ Error en /actualizar-contenedor:", error);
     res.status(500).json({
       success: false,
       error: error.message,
     });
   }
 });








}

// Rutas para manejar las operaciones CRUD de movimientos
{
  //contenedores en patio para formulario de nuevo movimiento
  app.get("/contenedores-ubicacion", async (req, res) => {
    try {
      await sql.connect(config);
      const result = await sql.query(
        "SELECT [id_contenedor], [numero_contenedor], [ubicacion] FROM dbo.registro_contenedores WHERE [ubicacion] IS NOT NULL"
      );
      res.json(result.recordset);
    } catch (err) {
      console.error("Error al obtener contenedores:", err);
      res.status(500).json({ message: "Error al obtener contenedores" });
    }
  });

  app.get("/movimientos", async (req, res) => {
    try {
      await sql.connect(config);
      const result = await sql.query(`
      SELECT rm.*, rc.color, rc.numero_contenedor, rc.tamano, rc.peso 
      FROM dbo.registro_movimientos rm 
      LEFT JOIN dbo.registro_contenedores rc ON rm.id_contenedor = rc.id_contenedor
    `);
      res.json(result.recordset);
    } catch (err) {
      console.error("Error al obtener movimientos:", err);
      res.status(500).json({ message: "Error al obtener movimientos" });
    }
  });

  app.put(
    "/actualizar-movimiento/:id_movimiento",
    async (req, res) => {

        const { id_movimiento } = req.params;
        const request = new sql.Request();
        const {
          estatus,
          fecha_realizado,
          hora_realizado,
          lugar_fin,
          id_contenedor,
          duracion,
        } = req.body;
        console.log( fecha_realizado, hora_realizado);

        try {
          const pool = await poolPromise;

        await pool.request()
          .input("id_movimiento", sql.Int, id_movimiento)
          .input("estatus", sql.VarChar(50), estatus)
          .input("fecha_realizado", sql.Date, fecha_realizado)
          .input("hora_realizado", sql.VarChar(8), hora_realizado)
          .input("duracion", sql.Text, duracion)
          .query(
            `UPDATE dbo.registro_movimientos 
            SET estatus = @estatus, fecha_realizado = @fecha_realizado, 
                hora_realizado = @hora_realizado, duracion = @duracion 
            WHERE id_movimiento = @id_movimiento`
          );

          await pool.request()
          .input("id_contenedor", sql.Int, id_contenedor)
          .input("ubicacion", sql.VarChar(100), lugar_fin)
          .query(
            `UPDATE dbo.registro_contenedores 
            SET ubicacion = @ubicacion 
            WHERE id_contenedor = @id_contenedor`
          );

          

        res.json({ message: "Movimiento actualizado correctamente" });
      } catch (err) {
        console.error("Error al actualizar movimiento:", err);
        res.status(500).json({ message: "Error al actualizar movimiento" });
      }
    }

    
  );

  
  app.delete(
    "/eliminar-movimiento/:id_movimiento",
    async (req, res) => {
      try {
        await sql.connect(config);
        const { id_movimiento } = req.params;
        const request = new sql.Request();
        await request
          .input("id_movimiento", sql.Int, id_movimiento)
          .query(
            "DELETE FROM dbo.registro_movimientos WHERE id_movimiento = @id_movimiento"
          );
        res.json({ message: "Movimiento eliminado correctamente" });
      } catch (err) {
        console.error("Error al eliminar movimiento:", err);
        res.status(500).json({ message: "Error al eliminar movimiento" });
      }
    }
  );

  //crear movimiento
  app.post("/crear-movimiento", async (req, res) => {
    try{  
      await sql.connect(config);
      const request = new sql.Request();

      const {
        id_contenedor,
        tipo_movimiento,
        lugar_origen,
        lugar_fin,
        solicitado_por,
        realizado_por,
        instrucciones_add,
        comentarios,
        fecha_solicitud,
        hora_solicitud,
        estatus,
      } = req.body;

      const query = `
        INSERT INTO dbo.registro_movimientos (
          id_contenedor, tipo_movimiento, lugar_origen, lugar_fin, solicitado_por,
          realizado_por, instrucciones_add, comentarios, fecha_solicitud,
          hora_solicitud, estatus
        ) VALUES (
          @id_contenedor, @tipo_movimiento, @lugar_origen, @lugar_fin, @solicitado_por,
          @realizado_por, @instrucciones_add, @comentarios, @fecha_solicitud,
          @hora_solicitud, @estatus
        )
      `;

      request
        .input("id_contenedor", sql.Int, id_contenedor)
        .input("tipo_movimiento", sql.VarChar, tipo_movimiento)
        .input("lugar_origen", sql.VarChar, lugar_origen)
        .input("lugar_fin", sql.VarChar, lugar_fin)
        .input("solicitado_por", sql.VarChar, solicitado_por)
        .input("realizado_por", sql.VarChar, realizado_por)
        .input("instrucciones_add", sql.Text, instrucciones_add)
        .input("comentarios", sql.Text, comentarios)
        .input("fecha_solicitud", sql.Date, fecha_solicitud)
        .input("hora_solicitud", sql.VarChar(8), hora_solicitud)
        .input("estatus", sql.VarChar, estatus);

        await request.query(query);

      res.json({ success: true, message: "Movimiento creado correctamente" });
    } catch (err) {
      console.error("Error al crear movimiento:", err);
      res.status(500).json({ success: false, message: "Error al crear movimiento" });
    }



});
} 


//manejar roles de usuarios

{
  app.get("/rol_usuario", authenticateToken, async (req, res) => {
    try {
      const pool = await poolPromise;
      const request = new sql.Request(pool);
      
      const {
        email
      } = req.query

      console.log("email pasado al backend",email);

      const query = `SELECT [rol] FROM dbo.registro_usuarios WHERE email = @email`;
      request.input("email", sql.VarChar, email);
      const result = await request.query(query);

      if (result.recordset.length === 0) {
        return null;
      }



      res.json(result.recordset);
    } catch (err) {
      console.error("Error al obtener roles:", err);
      res.status(500).json({ message: "Error al obtener roles" });
    }
  });

}