import multer  from "multer";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads')//saves the file uploaded by the user temporararily on the local server
    },
    filename:function(req,file,cb){
        // const unqiueSuffix=new Date().toLocaleString()
        cb(null,file.originalname)
    }
})
export const upload=multer({
    storage,
})