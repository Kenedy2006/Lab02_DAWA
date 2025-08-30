const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 5000;

// función para renderizar vistas con datos
function renderView(viewName, data, res) {
  const filePath = path.join(__dirname, "views", `${viewName}.hbs`);

  fs.readFile(filePath, "utf8", (err, templateData) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error interno del servidor");
      return;
    }

    const template = handlebars.compile(templateData);
    const html = template(data);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    renderView("home", {
      title: "Servidor con Handlebars",
      welcomeMessage: "Bienvenido al laboratorio de Node.js",
      day: new Date().toLocaleDateString("es-PE"),
      students: ["Ana", "Luis", "Pedro", "María"],
    }, res);

  } else if (req.url === "/about") {
    renderView("about", {
      title: "Acerca del curso",
      course: "Programación Backend con Node.js",
      teacher: "Ing. Juan Horse Developer",
      date: new Date().toLocaleDateString("es-PE"),
    }, res);

  } else if (req.url === "/students") {
    renderView("students", {
      title: "Notas de estudiantes",
      students: [
        { name: "Ana", grade: 18 },
        { name: "Luis", grade: 12 },
        { name: "Pedro", grade: 16 },
        { name: "María", grade: 14 },
      ]
    }, res);

  } else {
    res.statusCode = 404;
    res.end("<h1>404 - Página no encontrada</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

handlebars.registerHelper("gt", function (a, b) {
  return a > b;
});
