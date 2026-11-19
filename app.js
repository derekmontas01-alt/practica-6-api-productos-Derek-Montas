const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})

// ============================================================
// PRÁCTICA 6: Métodos completados (POST, PUT y DELETE)
// ============================================================

// POST /productos - Crear nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body || {}

    // Validar que los campos obligatorios vengan en la petición
    if (!nombre || !descripcion || precio === undefined || precio === null || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Convertir el precio a número y validar que sea mayor que cero
    const precioNumerico = parseFloat(precio)
    if (Number.isNaN(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        })
    }

    // Generar un ID único tomando el máximo actual + 1
    const nuevoId = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    // Agregar el producto al arreglo y responder con código 201
    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

// PUT /productos/:id - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si el producto no existe, responder con código 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body || {}

    // Validar que los campos obligatorios estén presentes
    if (!nombre || !descripcion || precio === undefined || precio === null || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Convertir el precio a número y validar que sea mayor que cero
    const precioNumerico = parseFloat(precio)
    if (Number.isNaN(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        })
    }

    // Reemplazar los datos conservando el mismo id
    const productoActualizado = {
        id,
        nombre,
        descripcion,
        precio: precioNumerico
    }

    productos[indice] = productoActualizado
    res.status(200).json(productoActualizado)
})

// DELETE /productos/:id - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si el producto no existe, responder con código 404
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // Eliminar el producto del arreglo usando splice()
    const [productoEliminado] = productos.splice(indice, 1)

    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})