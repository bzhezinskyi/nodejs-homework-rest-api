const multer = require("multer");
const Jimp = require("jimp");

class UserAvatarService {
  static upload() {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "tmp");
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single("avatar");
  }

  static async save(userEmail, file) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `${userEmail}.${ext}`;

    const fullFilePath = `public/avatars/${fileName}`;

    Jimp.read(file.path)
      .then((avatar) => {
        return avatar
          .resize(250, 250) // resize
          .write(fullFilePath); // save
      })
      .catch((err) => {
        console.error(err);
      });

    return `/avatars/${fileName}`;
  }
}

module.exports = UserAvatarService;
