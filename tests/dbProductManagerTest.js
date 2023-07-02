
import dbProductManager from "../src/dao/dbManagers/dbProductManager.js"
import mongoose from "mongoose";

try {
    await mongoose.connect("mongodb+srv://crgasparini32:GSNltCfSNvAcw1xd@cluster39760cg.jgxfm1z.mongodb.net/ecommerce?retryWrites=true&w=majority");
    console.log("Conectado")
} catch (error) {
    console.log(error);
}

const manager = new dbProductManager();

const productos = [
    {
        title: "The Legend of Zelda: Breath of the Wild",
        description: "Explora un vasto mundo abierto y descubre los secretos de Hyrule.",
        price: 59.99,
        code: "ABC123",
        stock: 10,
        category: "juegos",
        status: true,
        thumbnails: [
        "https://sm.ign.com/ign_es/screenshot/default/caratulaalemana_1dhc.jpg"
        ]
    },
    {
        title: "PlayStation 5",
        description: "La última consola de Sony con gráficos de alta calidad y un rendimiento excepcional.",
        price: 499.99,
        code: "DEF456",
        stock: 5,
        category: "consolas",
        status: true,
        thumbnails: [
        "https://media.tycsports.com/files/2021/05/21/284788/playstation-5_416x234.jpg"
        ]
    },
    {
        title: "Xbox Series X",
        description: "La consola más potente de Xbox que ofrece una experiencia de juego inmersiva.",
        price: 549.99,
        code: "GHI789",
        stock: 8,
        category: "consolas",
        status: true,
        thumbnails: [
        "https://http2.mlstatic.com/D_NQ_NP_963862-MLA45041918050_032021-O.jpg"
        ]
    },
    {
        title: "DualShock 4 Controller",
        description: "Un controlador inalámbrico para PlayStation 4 con funciones innovadoras.",
        price: 59.99,
        code: "JKL012",
        stock: 15,
        category: "accesorios",
        status: true,
        thumbnails: [
        "https://arsonyb2c.vtexassets.com/arquivos/ids/292249/dualshockblack1.jpg?v=637105416256400000"
        ]
    },
    {
        title: "Super Mario Odyssey",
        description: "Acompaña a Mario en una aventura por diferentes reinos para rescatar a la princesa Peach.",
        price: 49.99,
        code: "MNO345",
        stock: 3,
        category: "juegos",
        status: true,
        thumbnails: [
        "https://media.vandal.net/m/43395/super-mario-odyssey-2017102611035_25.jpg"
        ]
    },
    {
        title: "Nintendo Switch",
        description: "Una consola híbrida que permite jugar tanto en la televisión como en modo portátil.",
        price: 299.99,
        code: "PQR678",
        stock: 2,
        category: "consolas",
        status: true,
        thumbnails: [
        "https://http2.mlstatic.com/D_NQ_NP_803086-MLA47920649105_102021-O.webp"
        ]
    },
    {
        title: "Xbox Wireless Controller",
        description: "Un controlador inalámbrico para Xbox Series X/S y Xbox One.",
        price: 49.99,
        code: "STU901",
        stock: 12,
        category: "accesorios",
        status: true,
        thumbnails: [
        "https://http2.mlstatic.com/D_Q_NP_734635-MLA54147001787_032023-O.webp"
        ]
    },
    {
        title: "FIFA 22",
        description: "Disfruta del popular simulador de fútbol con mejoras gráficas y nuevas características.",
        price: 59.99,
        code: "VWX234",
        stock: 7,
        category: "juegos",
        status: true,
        thumbnails: [
        "https://areajugones.sport.es/wp-content/uploads/2021/07/captura-portada-fifa-22-ps4.jpg"
        ]
    },
    {
        title: "Nintendo Switch Lite",
        description: "Una versión compacta y ligera de la consola Nintendo Switch.",
        price: 199.99,
        code: "YZA567",
        stock: 6,
        category: "consolas",
        status: true,
        thumbnails: [
        "https://metajuego1.com/assets/uploads/product_EryG4UXzcR98pdStveDo.jpg"
        ]
    },
    {
        title: "Razer DeathAdder Elite",
        description: "Un mouse ergonómico para juegos con sensor óptico de alta precisión.",
        price: 69.99,
        code: "BCD890",
        stock: 9,
        category: "accesorios",
        status: true,
        thumbnails: [
        "https://katech.com.ar/wp-content/uploads/MOU031_1-jpg.webp"
        ]
    }
  ];
  

  const productos2 = [
    {
      title: "Producto 1",
      description: "Descripción del Producto 1",
      price: 19.99,
      code: "ABC123",
      stock: 10,
      category: "juegos",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto1_1.jpg",
        "https://ejemplo.com/producto1_2.jpg"
      ]
    },
    {
      title: "Producto 2",
      description: "Descripción del Producto 2",
      price: 9.99,
      code: "DEF456",
      stock: 5,
      category: "consolas",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto2_1.jpg",
        "https://ejemplo.com/producto2_2.jpg"
      ]
    },
    {
      title: "Producto 3",
      description: "Descripción del Producto 3",
      price: 24.99,
      code: "GHI789",
      stock: 8,
      category: "consolas",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto3_1.jpg",
        "https://ejemplo.com/producto3_2.jpg"
      ]
    },
    {
      title: "Producto 4",
      description: "Descripción del Producto 4",
      price: 14.99,
      code: "JKL012",
      stock: 15,
      category: "accesorios",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto4_1.jpg",
        "https://ejemplo.com/producto4_2.jpg"
      ]
    },
    {
      title: "Producto 5",
      description: "Descripción del Producto 5",
      price: 29.99,
      code: "MNO345",
      stock: 3,
      category: "juegos",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto5_1.jpg",
        "https://ejemplo.com/producto5_2.jpg"
      ]
    },
    {
      title: "Producto 6",
      description: "Descripción del Producto 6",
      price: 49.99,
      code: "PQR678",
      stock: 2,
      category: "consolas",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto6_1.jpg",
        "https://ejemplo.com/producto6_2.jpg"
      ]
    },
    {
      title: "Producto 7",
      description: "Descripción del Producto 7",
      price: 39.99,
      code: "STU901",
      stock: 12,
      category: "accesorios",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto7_1.jpg",
        "https://ejemplo.com/producto7_2.jpg"
      ]
    },
    {
      title: "Producto 8",
      description: "Descripción del Producto 8",
      price: 59.99,
      code: "VWX234",
      stock: 7,
      category: "juegos",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto8_1.jpg",
        "https://ejemplo.com/producto8_2.jpg"
      ]
    },
    {
      title: "Producto 9",
      description: "Descripción del Producto 9",
      price: 19.99,
      code: "YZA567",
      stock: 6,
      category: "consolas",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto9_1.jpg",
        "https://ejemplo.com/producto9_2.jpg"
      ]
    },
    {
      title: "Producto 10",
      description: "Descripción del Producto 10",
      price: 9.99,
      code: "BCD890",
      stock: 9,
      category: "accesorios",
      status: true,
      thumbnails: [
        "https://ejemplo.com/producto10_1.jpg",
        "https://ejemplo.com/producto10_2.jpg"
      ]
    }
  ];
  

const env = async () => {
    for (let i = 0; i < 10; i++) {
        await manager.add(productos[i]);
    }
    console.log("finalizado")
}

env();