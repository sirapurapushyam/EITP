import * as service from "../services/dashboard.service.js";

export const deanOverview = async (req,res,next)=>{
    try{
        const data = await service.getDeanOverview();
        res.json(data);
    }catch(err){
        next(err);
    }
};

export const coordinatorOverview = async(req,res,next)=>{
    try{
        const data = await service.getCoordinatorOverview(req.user);
        res.json(data);
    }catch(err){
        next(err);
    }
};

export const studentOverview = async(req,res,next)=>{
    try{
        const data = await service.getStudentOverview(req.user);
        res.json(data);
    }catch(err){
        next(err);
    }
};

export const internOverview = async(req,res,next)=>{
    try{
        const data = await service.getInternOverview(req.user);
        res.json(data);
    }catch(err){
        next(err);
    }
};