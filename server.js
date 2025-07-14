const express = require("express");
const cors = require("cors");
const MongoDB = require("./app/utils/mongodb.util");
const config = require("./app/config");
const ApiError = require("./app/api-error");
const docgiaRoute = require("./app/routes/docgia.route");
const nhanvienRoute = require("./app/routes/nhanvien.route");
const nhaxuatbanRoute = require("./app/routes/nhaxuatban.route");
const sachRoute = require("./app/routes/sach.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({ message: "Backend Quản lý thư viện" });
});

app.use("/docgia", docgiaRoute);
app.use("/nhanvien", nhanvienRoute);
app.use("/nhaxuatban", nhaxuatbanRoute);
app.use("/sach", sachRoute);

// Xử lý route không tồn tại
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});


// Xử lý lỗi chung
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

MongoDB.connect(config.db.uri)
    .then(() => {
        app.listen(config.app.port, () => {
            console.log(`Server is running on http://localhost:${config.app.port}`);
        });
    })
    .catch((err) => {
        console.error("Cannot connect to MongoDB", err);
        process.exit();
    });