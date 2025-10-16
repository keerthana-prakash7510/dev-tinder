export const adminAuth = (req,res,next)=>{
    console.log("Authentication is getting checked!")
    const authToken = "xyz";
    const isAdminAuthorized = authToken ==="xyz";
    if(!isAdminAuthorized){
        res.status(404).send("Unauthorized Access");
    }else{
        next();
    }
}

export const userAuth = (req,res,next)=>{
    console.log("Authentication is getting checked!")
    const authToken = "xyz";
    const isAdminAuthorized = authToken ==="xyz";
    if(!isAdminAuthorized){
        res.status(404).send("Unauthorized Access");
    }else{
        next();
    }
}

