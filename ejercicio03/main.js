const http = require("http");
const PORT = 3000;


let estudiantes = [];
let idCounter = 1;

const repo = {
  getAll: () => estudiantes,
  getById: (id) => estudiantes.find(e => e.id === id),
  add: (data) => {
    // Validaciones obligatorias
    if (!data.name || !data.email || !data.course || !data.phone) {
      return { error: "Faltan campos obligatorios (name, email, course, phone)" };
    }

    const estudiante = {
      id: idCounter++,
      name: data.name,
      grade: data.grade || null,
      age: data.age || null,
      email: data.email,
      phone: data.phone,
      enrollmentNumber: data.enrollmentNumber || null,
      course: data.course,
      year: data.year || null,
      subjects: data.subjects || [],
      gpa: data.gpa || null,
      status: data.status || "activo",
      admissionDate: data.admissionDate || new Date().toISOString()
    };
    estudiantes.push(estudiante);
    return estudiante;
  },
  update: (id, data) => {
    const index = estudiantes.findIndex(e => e.id === id);
    if (index === -1) return null;
    estudiantes[index] = { ...estudiantes[index], ...data };
    return estudiantes[index];
  },
  remove: (id) => {
    const index = estudiantes.findIndex(e => e.id === id);
    if (index === -1) return null;
    return estudiantes.splice(index, 1)[0];
  },
  listByStatus: (status) => estudiantes.filter(e => e.status === status),
  listByGrade: (grade) => estudiantes.filter(e => e.grade === grade)
};

const server = http.createServer((req, res) => {
  const { url, method } = req;

  
  if (url === "/students" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(repo.getAll()));
  }


  else if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);
    if (student) {
      res.statusCode = 200;
      res.end(JSON.stringify(student));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  else if (url === "/students" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const result = repo.add(JSON.parse(body));
      if (result.error) {
        res.statusCode = 400;
        res.end(JSON.stringify(result));
      } else {
        res.statusCode = 201;
        res.end(JSON.stringify(result));
      }
    });
  }

  else if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const updated = repo.update(id, JSON.parse(body));
      if (updated) {
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
      }
    });
  }

  else if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deleted = repo.remove(id);
    if (deleted) {
      res.statusCode = 200;
      res.end(JSON.stringify(deleted));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  else if (url === "/ListByStatus" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { status } = JSON.parse(body);
      const result = repo.listByStatus(status);
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    });
  }

  else if (url === "/ListByGrade" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { grade } = JSON.parse(body);
      const result = repo.listByGrade(grade);
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    });
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
