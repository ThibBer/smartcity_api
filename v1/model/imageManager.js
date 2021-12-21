const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports.save = async (imageBuffer, name, directory) => {
    return await sharp(imageBuffer).toFile(path.join(__dirname, `${directory}${name}`));
}

module.exports.replace = (imageBuffer, name, directory) => {
    try {
        const imagePath = path.join(__dirname, `${directory}${name}`);

        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
        }

        return sharp(imageBuffer).toFile(imagePath);
    }catch (e){
        console.error(e);
    }
}

module.exports.delete = (name, directory) => {
    const imagePath = path.join(__dirname, `${directory}${name}`);

    if(fs.existsSync(imagePath)){
        fs.unlinkSync(imagePath);
    }
}