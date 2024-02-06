import multer from "multer";
import path from "path";

const tempDir = path.resolve("tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

export default upload;
