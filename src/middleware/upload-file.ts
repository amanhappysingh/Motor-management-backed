import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(process.cwd(), "src", "uploads", "motor-out-location")
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const fileUploader = multer({ storage });
