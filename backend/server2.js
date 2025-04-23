const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});

app.get("/contenedores", (req, res) => {
  const sql = "SELECT * FROM registro_contenedores";
  db.query(sql, (err, data) => {
    if (err) return res.json("error");
    return res.json(data);
  });
});

app.get("/contenedores-ubicacion", (req, res) => {
  const sql =
    "SELECT `id_contenedor`,`numeroContenedor`, `ubicacion` FROM registro_contenedores WHERE `ubicacion` IS NOT NULL AND NOT `ubicacion` = '' AND NOT `ubicacion` = 'SALIDA'  ";
  db.query(sql, (err, data) => {
    if (err) return res.json("error");
    return res.json(data);
  });
});



app.put("/contenedor/:id", (req, res) => {
  const sql =
    "UPDATE registro_contenedores SET `numeroContenedor` = ?, `cliente` = ?, `estado` = ?, `carga` = ?, `color` = ?, `peso` = ?, `fechaLlegada` = ?, `transportista` = ?, `operador` = ?, `tamaño` = ? WHERE `id` = ?";

  const values = [
    req.body.numeroContenedor,
    req.body.cliente,
    req.body.estado,
    req.body.carga,
    req.body.color,
    req.body.peso,
    req.body.fechaLlegada,
    req.body.transportista,
    req.body.operador,
    req.body.tamaño,
    req.params.id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al actualizar");
    }
    return res.json(data);
  });
});

app.delete("/eliminar-contenedor/:id", (req, res) => {
  const sql = "DELETE FROM registro_contenedores WHERE id_contenedor = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al eliminar");
    }
    return res.json(data);
  });
});

// Nuevas rutas para la tabla "clientes"
app.get("/clientes", (req, res) => {
  const sql = "SELECT * FROM registro_clientes";
  db.query(sql, (err, data) => {
    if (err) return res.json("error");
    return res.json(data);
  });
});

app.get("/cliente/:id", (req, res) => {
  const sql = "SELECT * FROM registro_clientes WHERE id = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.json("error");
    return res.json(data[0]);
  });
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

app.post("/agregar-cliente", (req, res) => {
  const sql =
    "INSERT INTO `registro_clientes` (`tipo_persona`, `nombre`, `apellido_paterno`, `apellido_materno`, `representante_legal`, `rfc_nit`, `telefono`, `transportista`, `credito_disponible`, `estado`, `municipio`, `ciudad`, `colonia`, `calle`, `numero`, `referencia`, `razon_social`, `razon_comercial`, `email1`, `email2`, `email3`, `email4`) VALUES (?)";
  const values = [
    req.body.tipo_persona,
    req.body.nombre,
    req.body.apellido_paterno,
    req.body.apellido_materno,
    req.body.representante_legal,
    req.body.rfc_nit,
    req.body.telefono,
    req.body.transportista,
    req.body.credito_disponible,
    req.body.estado,
    req.body.municipio,
    req.body.ciudad,
    req.body.colonia,
    req.body.calle,
    req.body.numero,
    req.body.referencia,
    req.body.razon_social,
    req.body.razon_comercial,
    req.body.email1,
    req.body.email2,
    req.body.email3,
    req.body.email4,
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al agregar");
    }
    return res.json(data);
  });
});

app.put("/cliente/:id", (req, res) => {
  const sql =
    "UPDATE registro_clientes SET `tipo_persona` = ?, `nombre` = ?, `apellido_paterno` = ?, `apellido_materno` = ?, `representante_legal` = ?, `rfc_nit` = ?, `telefono` = ?, `transportista` = ?, `credito_disponible` = ?, `estado` = ?, `municipio` = ?, `ciudad` = ?, `colonia` = ?, `calle` = ?, `numero` = ?, `referencia` = ?, `razon_social` = ?, `razon_comercial` = ?, `email1` = ?, `email2` = ?, `email3` = ?, `email4` = ? WHERE `id` = ?";
  const values = [
    req.body.tipo_persona,
    req.body.nombre,
    req.body.apellido_paterno,
    req.body.apellido_materno,
    req.body.representante_legal,
    req.body.rfc_nit,
    req.body.telefono,
    req.body.transportista,
    req.body.credito_disponible,
    req.body.estado,
    req.body.municipio,
    req.body.ciudad,
    req.body.colonia,
    req.body.calle,
    req.body.numero,
    req.body.referencia,
    req.body.razon_social,
    req.body.razon_comercial,
    req.body.email1,
    req.body.email2,
    req.body.email3,
    req.body.email4,
    req.params.id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al actualizar");
    }
    return res.json(data);
  });
});

app.delete("/eliminar-cliente/:id", (req, res) => {
  const sql = "DELETE FROM registro_clientes WHERE id_cliente = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al eliminar");
    }
    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("escuchando...");
});



app.get("/movimientos", (req, res) => {
  const sql =
    "SELECT rm.*, rc.color, rc.numeroContenedor, rc.tamano, rc.peso FROM registro_movimientos rm LEFT JOIN registro_contenedores rc ON rm.id_contenedor = rc.id_contenedor";
  db.query(sql, (err, data) => {
    if (err) return res.json("error");
    return res.json(data);
  });
});

app.get("/movimiento/:id", (req, res) => {
  const sql = "SELECT * FROM registro_movimientos WHERE id = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.json("error");
    return res.json(data[0]);
  });
});

app.put("/movimiento/:id", (req, res) => {
  const sql =
    "UPDATE registro_movimientos SET `tipo_movimiento` = ?, `lugar_origen` = ?, `lugar_fin` = ?, `solicitiado_por` = ?, `realizado_por` = ?, `instrucciones_add` = ?, `comentarios` = ?, `fecha_solicitud` = ?, `hora_solicitud` = ?,`estatus` = ?, `fecha_realizado` = ?, `hora_realizado` = ?, `duracion` = ? WHERE `id` = ?";
  const values = [
    req.body.tipo_movimiento,
    req.body.lugar_origen,
    req.body.lugar_fin,
    req.body.solicitiado_por,
    req.body.realizado_por,
    req.body.instrucciones_add,
    req.body.comentarios,
    req.body.fecha_solicitud,
    req.body.hora_solicitud,
    req.body.estatus,
    req.body.fecha_realizado,
    req.body.hora_realizado,
    req.body.duracion,
    req.params.id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al actualizar");
    }
    return res.json(data);
  });
});

app.delete("/eliminar-movimiento/", (req, res) => {
  const sql = "DELETE FROM registro_movimientos WHERE id_movimiento = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      console.error(err);
      return res.json("error al eliminar");
    }
    return res.json(data);
  });
});

app.post("/crear-movimiento", (req, res) => {
  const sql =
    "INSERT INTO registro_movimientos (`id_contenedor`,`tipo_movimiento`, `lugar_origen`, `lugar_fin`, `solicitado_por`, `realizado_por`, `instrucciones_add`, `comentarios`, `fecha_solicitud`,`hora_solicitud`, `estatus`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    const fecha_hoy = new Date().toISOString().slice(0, 10);
    const hora_hoy = new Date().toISOString().slice(11, 19);
  const values = [
    req.body.id_contenedor,
    req.body.tipo_movimiento,
    req.body.lugar_origen,
    req.body.lugar_fin,
    req.body.solicitado_por,
    req.body.realizado_por,
    req.body.instrucciones_add,
    req.body.comentarios,
    fecha_hoy,
    hora_hoy,
    "Pendiente",
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json("error al agregar movimiento");
    } else {return res.json(data).status(200);} 
    
  });
});



app.put("/actualizar-movimiento/:id_movimiento", (req, res) => {
  const sql =
    "UPDATE registro_movimientos SET `estatus` = ?, `comentarios` = ?, `fecha_realizado` = ?, `hora_realizado` = ?, `duracion` = ? WHERE id_movimiento = ?";
  const values = [
    req.body.estatus,
    req.body.comentarios,
    req.body.fecha_realizado,
    req.body.hora_realizado,
    req.body.duracion,
    req.params.id_movimiento,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json("error al agregar movimiento");
    } else {
      return res.json(data).status(200);
    }
    
  });
});

app.post("/agregar-contenedor", async (req, res) => {
  try {
    const {
      CantidadContenedores,
      fechaLlegada,
      horaLlegada,
      transportista,
      operador,
      estatus,
      eco,
      user,
      acceso,
    } = req.body;

    const results = [];

    // Use a transaction to ensure data integrity across related tables
    await new Promise((resolve, reject) => {
      db.beginTransaction(async (err) => {
        if (err) return reject(err);

        try {
          for (let i = 1; i <= CantidadContenedores; i++) {
            // Extract container data with consistent property access
            const containerData = {
              numeroContenedor: req.body[`numeroContenedor${i}`],
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

            // Insert container
            const containerResult = await queryDatabase(
              `INSERT INTO registro_contenedores 
              (fechaLlegada, horaLlegada, transportista, operador, estatus, numeroContenedor, 
               cliente, estado, carga, color, peso, tamano, ubicacion, unidad_llegada) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                fechaLlegada,
                horaLlegada,
                transportista,
                operador,
                estatus,
                containerData.numeroContenedor,
                containerData.cliente,
                containerData.estado,
                containerData.carga,
                containerData.color,
                containerData.peso,
                containerData.tamano,
                eco,
                eco,
              ]
            );

            const containerId = containerResult.insertId;

            // Insert damage information
            await queryDatabase(
              `INSERT INTO registro_dmg 
              (id_contenedor, num_contenedor, acceso, fecha_inspeccion, hora_inspeccion, 
               dmg_frontal, obs_frontal, dmg_trasero, obs_trasero, 
               dmg_lateral_d, obs_lateral_d, dmg_lateral_i, obs_lateral_i, 
               dmg_candado, obs_candado, num_candado) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                containerId,
                containerData.numeroContenedor,
                acceso,
                fechaLlegada,
                horaLlegada,
                containerData.dmg_frontal,
                containerData.obs_frontal,
                containerData.dmg_trasera,
                containerData.obs_trasera,
                containerData.dmg_lateral_derecha,
                containerData.obs_lateral_derecha,
                containerData.dmg_lateral_izquierda,
                containerData.obs_lateral_izquierda,
                containerData.dmg_candado,
                containerData.obs_candado,
                containerData.num_candado,
              ]
            );

            // Insert movement record
            await queryDatabase(
              `INSERT INTO registro_movimientos 
              (id_contenedor, tipo_movimiento, lugar_origen, lugar_fin, solicitado_por, 
               realizado_por, instrucciones_add, comentarios, fecha_solicitud, 
               hora_solicitud, fecha_realizado, hora_realizado, duracion) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                containerId,
                containerData.tipo_movimiento,
                eco,
                containerData.lugar_fin,
                user,
                null,
                containerData.instrucciones_add,
                null,
                fechaLlegada,
                horaLlegada,
                "Pendiente",
                null,
                null,
              ]
            );

            results.push({
              containerId,
              containerNumber: containerData.numeroContenedor,
            });
          }

          db.commit((err) => {
            if (err) return reject(err);
            resolve();
          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: `${CantidadContenedores} contenedor(es) agregado(s) correctamente`,
      data: results,
    });
  } catch (error) {
    console.error("Error en la ruta agregar-contenedor:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al agregar los contenedores",
    });
  }
});

// Helper function to promisify database queries
function queryDatabase(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}


// Route to update container information and associated data
app.put("/actualizar-contenedor/:containerId", async (req, res) => {
  try {
    const { containerId } = req.params;
    const { 
      fechaLlegada, horaLlegada, transportista, operador, estatus, 
      numeroContenedor1, cliente1, estado1, carga1, color1, peso1, tamano1, 
      ubicacion1, unidad_llegada, 
      // Damage information
      acceso, dmg_frontal1, obs_frontal1, dmg_trasera1, obs_trasera1,
      dmg_lateral_derecha1, obs_lateral_derecha1, dmg_lateral_izquierda1,
      obs_lateral_izquierda1, dmg_candado1, obs_candado1, num_candado1,

      // Movement information
      tipo_movimiento1, lugar_origen1, lugar_fin1, 

      solicitado_por, instrucciones_add1, comentarios1
    } = req.body;
    
    // Begin transaction to ensure all updates succeed or fail together
    await new Promise((resolve, reject) => {
      db.beginTransaction(async (err) => {
        if (err) return reject(err);
        
        try {
          // Update container information
          await queryDatabase(
            `UPDATE registro_contenedores 
             SET fechaLlegada = ?, horaLlegada = ?, transportista = ?, operador = ?, 
                 estatus = ?, numeroContenedor = ?, cliente = ?, estado = ?, 
                 carga = ?, color = ?, peso = ?, tamano = ?, ubicacion = ?, 
                 unidad_llegada = ?
             WHERE id_contenedor = ?`,
            [
              fechaLlegada,
              horaLlegada,
              transportista,
              operador,
              estatus,
              numeroContenedor1,
              cliente1,
              estado1,
              carga1,
              color1,
              peso1,
              tamano1,
              ubicacion1,
              unidad_llegada,
              containerId
            ]
          );
          
          // Update damage information
          await queryDatabase(
            `UPDATE registro_dmg
             SET acceso = ?, fecha_inspeccion = ?, hora_inspeccion = ?,
                 dmg_frontal = ?, obs_frontal = ?, dmg_trasero = ?, obs_trasero = ?,
                 dmg_lateral_d = ?, obs_lateral_d = ?, dmg_lateral_i = ?, obs_lateral_i = ?,
                 dmg_candado = ?, obs_candado = ?, num_candado = ?
             WHERE id_contenedor = ?`,
            [
              acceso,
              fechaLlegada, // Using the same date for consistency
              horaLlegada,  // Using the same time for consistency
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
              containerId
            ]
          );
          
          // Check if we're updating movement information
          if (tipo_movimiento1) {
            // You could either update the latest movement or create a new one
            // Here we'll update the latest movement
            await queryDatabase(
              `UPDATE registro_movimientos
               SET tipo_movimiento = ?, lugar_origen = ?, lugar_fin = ?,
                   solicitado_por = ?, instrucciones_add = ?, comentarios = ?
               WHERE id_contenedor = ? `,
              [
                tipo_movimiento1,
                lugar_origen1,
                lugar_fin1,
                solicitado_por,
                instrucciones_add1,
                comentarios1,
                containerId
              ]
            );
          }
          
          db.commit(err => {
            if (err) return reject(err);
            resolve();
          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });
    });
    
    return res.status(200).json({
      success: true,
      message: "Contenedor actualizado correctamente",
      containerId
    });
    
  } catch (error) {
    console.error("Error en la ruta actualizar-contenedor:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al actualizar el contenedor"
    });
  }
});

// You could also add a route to get container data by ID for editing
app.get("/contenedor/:id_contenedor", async (req, res) => {
  try {
    const { id_contenedor } = req.params;
    
    // Get container data
    const containerData = await queryDatabase(
      `SELECT c.*, 
              d.acceso, d.dmg_frontal, d.obs_frontal, d.dmg_trasero, d.obs_trasero,
              d.dmg_lateral_d, d.obs_lateral_d, d.dmg_lateral_i, d.obs_lateral_i,
              d.dmg_candado, d.obs_candado, d.num_candado,
              m.tipo_movimiento, m.lugar_origen, m.lugar_fin, m.solicitado_por,
              m.instrucciones_add, m.comentarios
       FROM registro_contenedores c
       LEFT JOIN registro_dmg d ON c.id_contenedor = d.id_contenedor
       LEFT JOIN (
         SELECT * FROM registro_movimientos
         WHERE id_contenedor IN (
           SELECT MAX(id_contenedor) FROM registro_movimientos
           GROUP BY id_contenedor
         )
       ) m ON c.id_contenedor = m.id_contenedor
       WHERE c.id_contenedor = ?`,
      [id_contenedor]
    );
    
    if (!containerData || containerData.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Contenedor no encontrado"
      });
    }
    
    return res.status(200).json(containerData[0]);
    
  } catch (error) {
    console.error("Error al obtener contenedor:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al obtener los datos del contenedor"
    });
  }
});